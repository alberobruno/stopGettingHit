import { decode } from '@shelacek/ubjson';
import fs from 'fs';
import iconv from 'iconv-lite';
import { mapValues } from 'lodash-es';
import { Command } from '../types.esm.js';
import { exists } from './exists.esm.js';
import { toHalfwidth } from './fullwidth.esm.js';

var SlpInputSource;

(function (SlpInputSource) {
  SlpInputSource["BUFFER"] = "buffer";
  SlpInputSource["FILE"] = "file";
})(SlpInputSource || (SlpInputSource = {}));

function getRef(input) {
  switch (input.source) {
    case SlpInputSource.FILE:
      if (!input.filePath) {
        throw new Error("File source requires a file path");
      }

      const fd = fs.openSync(input.filePath, "r");
      return {
        source: input.source,
        fileDescriptor: fd
      };

    case SlpInputSource.BUFFER:
      return {
        source: input.source,
        buffer: input.buffer
      };

    default:
      throw new Error("Source type not supported");
  }
}

function readRef(ref, buffer, offset, length, position) {
  switch (ref.source) {
    case SlpInputSource.FILE:
      return fs.readSync(ref.fileDescriptor, buffer, offset, length, position);

    case SlpInputSource.BUFFER:
      return ref.buffer.copy(buffer, offset, position, position + length);

    default:
      throw new Error("Source type not supported");
  }
}

function getLenRef(ref) {
  switch (ref.source) {
    case SlpInputSource.FILE:
      const fileStats = fs.fstatSync(ref.fileDescriptor);
      return fileStats.size;

    case SlpInputSource.BUFFER:
      return ref.buffer.length;

    default:
      throw new Error("Source type not supported");
  }
}
/**
 * Opens a file at path
 */


function openSlpFile(input) {
  const ref = getRef(input);
  const rawDataPosition = getRawDataPosition(ref);
  const rawDataLength = getRawDataLength(ref, rawDataPosition);
  const metadataPosition = rawDataPosition + rawDataLength + 10; // remove metadata string

  const metadataLength = getMetadataLength(ref, metadataPosition);
  const messageSizes = getMessageSizes(ref, rawDataPosition);
  return {
    ref,
    rawDataPosition,
    rawDataLength,
    metadataPosition,
    metadataLength,
    messageSizes
  };
}
function closeSlpFile(file) {
  switch (file.ref.source) {
    case SlpInputSource.FILE:
      fs.closeSync(file.ref.fileDescriptor);
      break;
  }
} // This function gets the position where the raw data starts

function getRawDataPosition(ref) {
  const buffer = new Uint8Array(1);
  readRef(ref, buffer, 0, buffer.length, 0);

  if (buffer[0] === 0x36) {
    return 0;
  }

  if (buffer[0] !== "{".charCodeAt(0)) {
    return 0; // return error?
  }

  return 15;
}

function getRawDataLength(ref, position) {
  const fileSize = getLenRef(ref);

  if (position === 0) {
    return fileSize;
  }

  const buffer = new Uint8Array(4);
  readRef(ref, buffer, 0, buffer.length, position - 4);
  const rawDataLen = buffer[0] << 24 | buffer[1] << 16 | buffer[2] << 8 | buffer[3];

  if (rawDataLen > 0) {
    // If this method manages to read a number, it's probably trustworthy
    return rawDataLen;
  } // If the above does not return a valid data length,
  // return a file size based on file length. This enables
  // some support for severed files


  return fileSize - position;
}

function getMetadataLength(ref, position) {
  const len = getLenRef(ref);
  return len - position - 1;
}

function getMessageSizes(ref, position) {
  const messageSizes = {}; // Support old file format

  if (position === 0) {
    messageSizes[0x36] = 0x140;
    messageSizes[0x37] = 0x6;
    messageSizes[0x38] = 0x46;
    messageSizes[0x39] = 0x1;
    return messageSizes;
  }

  const buffer = new Uint8Array(2);
  readRef(ref, buffer, 0, buffer.length, position);

  if (buffer[0] !== Command.MESSAGE_SIZES) {
    return {};
  }

  const payloadLength = buffer[1];
  messageSizes[0x35] = payloadLength;
  const messageSizesBuffer = new Uint8Array(payloadLength - 1);
  readRef(ref, messageSizesBuffer, 0, messageSizesBuffer.length, position + 2);

  for (let i = 0; i < payloadLength - 1; i += 3) {
    const command = messageSizesBuffer[i]; // Get size of command

    messageSizes[command] = messageSizesBuffer[i + 1] << 8 | messageSizesBuffer[i + 2];
  }

  return messageSizes;
}

function getEnabledItems(view) {
  const offsets = [0x1, 0x100, 0x10000, 0x1000000, 0x100000000];
  const enabledItems = offsets.reduce((acc, byteOffset, index) => {
    const byte = readUint8(view, 0x28 + index);
    return acc + byte * byteOffset;
  }, 0);
  return enabledItems;
}

function getGameInfoBlock(view) {
  const offset = 0x5;
  return {
    gameBitfield1: readUint8(view, 0x0 + offset),
    gameBitfield2: readUint8(view, 0x1 + offset),
    gameBitfield3: readUint8(view, 0x2 + offset),
    gameBitfield4: readUint8(view, 0x3 + offset),
    bombRainEnabled: (readUint8(view, 0x6 + offset) & 0xff) > 0 ? true : false,
    itemSpawnBehavior: readInt8(view, 0xb + offset),
    selfDestructScoreValue: readInt8(view, 0xc + offset),
    //stageId: readUint16(view, 0xe + offset),
    //gameTimer: readUint32(view, 0x10 + offset),
    itemSpawnBitfield1: readUint8(view, 0x23 + offset),
    itemSpawnBitfield2: readUint8(view, 0x24 + offset),
    itemSpawnBitfield3: readUint8(view, 0x25 + offset),
    itemSpawnBitfield4: readUint8(view, 0x26 + offset),
    itemSpawnBitfield5: readUint8(view, 0x27 + offset),
    damageRatio: readFloat(view, 0x30 + offset)
  };
}
/**
 * Iterates through slp events and parses payloads
 */


function iterateEvents(slpFile, callback, startPos = null) {
  const ref = slpFile.ref;
  let readPosition = startPos !== null && startPos > 0 ? startPos : slpFile.rawDataPosition;
  const stopReadingAt = slpFile.rawDataPosition + slpFile.rawDataLength; // Generate read buffers for each

  const commandPayloadBuffers = mapValues(slpFile.messageSizes, size => new Uint8Array(size + 1));
  let splitMessageBuffer = new Uint8Array(0);
  const commandByteBuffer = new Uint8Array(1);

  while (readPosition < stopReadingAt) {
    var _commandByteBuffer$;

    readRef(ref, commandByteBuffer, 0, 1, readPosition);
    let commandByte = (_commandByteBuffer$ = commandByteBuffer[0]) != null ? _commandByteBuffer$ : 0;
    let buffer = commandPayloadBuffers[commandByte];

    if (buffer === undefined) {
      // If we don't have an entry for this command, return false to indicate failed read
      return readPosition;
    }

    if (buffer.length > stopReadingAt - readPosition) {
      return readPosition;
    }

    const advanceAmount = buffer.length;
    readRef(ref, buffer, 0, buffer.length, readPosition);

    if (commandByte === Command.SPLIT_MESSAGE) {
      var _readUint, _readUint2;

      // Here we have a split message, we will collect data from them until the last
      // message of the list is received
      const view = new DataView(buffer.buffer);
      const size = (_readUint = readUint16(view, 0x201)) != null ? _readUint : 512;
      const isLastMessage = readBool(view, 0x204);
      const internalCommand = (_readUint2 = readUint8(view, 0x203)) != null ? _readUint2 : 0; // If this is the first message, initialize the splitMessageBuffer
      // with the internal command byte because our parseMessage function
      // seems to expect a command byte at the start

      if (splitMessageBuffer.length === 0) {
        splitMessageBuffer = new Uint8Array(1);
        splitMessageBuffer[0] = internalCommand;
      } // Collect new data into splitMessageBuffer


      const appendBuf = buffer.slice(0x1, 0x1 + size);
      const mergedBuf = new Uint8Array(splitMessageBuffer.length + appendBuf.length);
      mergedBuf.set(splitMessageBuffer);
      mergedBuf.set(appendBuf, splitMessageBuffer.length);
      splitMessageBuffer = mergedBuf;

      if (isLastMessage) {
        var _splitMessageBuffer$;

        commandByte = (_splitMessageBuffer$ = splitMessageBuffer[0]) != null ? _splitMessageBuffer$ : 0;
        buffer = splitMessageBuffer;
        splitMessageBuffer = new Uint8Array(0);
      }
    }

    const parsedPayload = parseMessage(commandByte, buffer);
    const shouldStop = callback(commandByte, parsedPayload, buffer);

    if (shouldStop) {
      break;
    }

    readPosition += advanceAmount;
  }

  return readPosition;
}
function parseMessage(command, payload) {
  const view = new DataView(payload.buffer);

  switch (command) {
    case Command.GAME_START:
      const getPlayerObject = playerIndex => {
        // Controller Fix stuff
        const cfOffset = playerIndex * 0x8;
        const dashback = readUint32(view, 0x141 + cfOffset);
        const shieldDrop = readUint32(view, 0x145 + cfOffset);
        let controllerFix = "None";

        if (dashback !== shieldDrop) {
          controllerFix = "Mixed";
        } else if (dashback === 1) {
          controllerFix = "UCF";
        } else if (dashback === 2) {
          controllerFix = "Dween";
        } // Nametag stuff


        const nametagLength = 0x10;
        const nametagOffset = playerIndex * nametagLength;
        const nametagStart = 0x161 + nametagOffset;
        const nametagBuf = payload.slice(nametagStart, nametagStart + nametagLength);
        const nameTagString = iconv.decode(nametagBuf, "Shift_JIS").split("\0").shift();
        const nametag = nameTagString ? toHalfwidth(nameTagString) : ""; // Display name

        const displayNameLength = 0x1f;
        const displayNameOffset = playerIndex * displayNameLength;
        const displayNameStart = 0x1a5 + displayNameOffset;
        const displayNameBuf = payload.slice(displayNameStart, displayNameStart + displayNameLength);
        const displayNameString = iconv.decode(displayNameBuf, "Shift_JIS").split("\0").shift();
        const displayName = displayNameString ? toHalfwidth(displayNameString) : ""; // Connect code

        const connectCodeLength = 0xa;
        const connectCodeOffset = playerIndex * connectCodeLength;
        const connectCodeStart = 0x221 + connectCodeOffset;
        const connectCodeBuf = payload.slice(connectCodeStart, connectCodeStart + connectCodeLength);
        const connectCodeString = iconv.decode(connectCodeBuf, "Shift_JIS").split("\0").shift();
        const connectCode = connectCodeString ? toHalfwidth(connectCodeString) : "";
        const userIdLength = 0x1d;
        const userIdOffset = playerIndex * userIdLength;
        const userIdStart = 0x249 + userIdOffset;
        const userIdBuf = payload.slice(userIdStart, userIdStart + userIdLength);
        const userIdString = iconv.decode(userIdBuf, "utf8").split("\0").shift();
        const userId = userIdString != null ? userIdString : "";
        const offset = playerIndex * 0x24;
        return {
          playerIndex,
          port: playerIndex + 1,
          characterId: readUint8(view, 0x65 + offset),
          type: readUint8(view, 0x66 + offset),
          startStocks: readUint8(view, 0x67 + offset),
          characterColor: readUint8(view, 0x68 + offset),
          teamShade: readUint8(view, 0x6c + offset),
          handicap: readUint8(view, 0x6d + offset),
          teamId: readUint8(view, 0x6e + offset),
          staminaMode: Boolean(readUint8(view, 0x6c + playerIndex * 0x24, 0x01)),
          silentCharacter: Boolean(readUint8(view, 0x6c + playerIndex * 0x24, 0x02)),
          lowGravity: Boolean(readUint8(view, 0x6c + playerIndex * 0x24, 0x04)),
          invisible: Boolean(readUint8(view, 0x6c + playerIndex * 0x24, 0x08)),
          blackStockIcon: Boolean(readUint8(view, 0x6c + playerIndex * 0x24, 0x10)),
          metal: Boolean(readUint8(view, 0x6c + playerIndex * 0x24, 0x20)),
          startOnAngelPlatform: Boolean(readUint8(view, 0x6c + playerIndex * 0x24, 0x40)),
          rumbleEnabled: Boolean(readUint8(view, 0x6c + playerIndex * 0x24, 0x80)),
          cpuLevel: readUint8(view, 0x74 + offset),
          offenseRatio: readFloat(view, 0x7d + offset),
          defenseRatio: readFloat(view, 0x81 + offset),
          modelScale: readFloat(view, 0x85 + offset),
          controllerFix,
          nametag,
          displayName,
          connectCode,
          userId
        };
      };

      const matchIdLength = 51;
      const matchIdStart = 0x2be;
      const matchIdBuf = payload.slice(matchIdStart, matchIdStart + matchIdLength);
      const matchIdString = iconv.decode(matchIdBuf, "utf8").split("\0").shift();
      const matchId = matchIdString != null ? matchIdString : "";
      return {
        slpVersion: `${readUint8(view, 0x1)}.${readUint8(view, 0x2)}.${readUint8(view, 0x3)}`,
        timerType: readUint8(view, 0x5, 0x03),
        inGameMode: readUint8(view, 0x5, 0xe0),
        friendlyFireEnabled: !!readUint8(view, 0x6, 0x01),
        isTeams: readBool(view, 0xd),
        itemSpawnBehavior: readUint8(view, 0x10),
        stageId: readUint16(view, 0x13),
        startingTimerSeconds: readUint32(view, 0x15),
        enabledItems: getEnabledItems(view),
        players: [0, 1, 2, 3].map(getPlayerObject),
        scene: readUint8(view, 0x1a3),
        gameMode: readUint8(view, 0x1a4),
        language: readUint8(view, 0x2bd),
        gameInfoBlock: getGameInfoBlock(view),
        randomSeed: readUint32(view, 0x13d),
        isPAL: readBool(view, 0x1a1),
        isFrozenPS: readBool(view, 0x1a2),
        matchInfo: {
          matchId,
          gameNumber: readUint32(view, 0x2f1),
          tiebreakerNumber: readUint32(view, 0x2f5)
        }
      };

    case Command.FRAME_START:
      return {
        frame: readInt32(view, 0x1),
        seed: readUint32(view, 0x5),
        sceneFrameCounter: readUint32(view, 0x9)
      };

    case Command.PRE_FRAME_UPDATE:
      return {
        frame: readInt32(view, 0x1),
        playerIndex: readUint8(view, 0x5),
        isFollower: readBool(view, 0x6),
        seed: readUint32(view, 0x7),
        actionStateId: readUint16(view, 0xb),
        positionX: readFloat(view, 0xd),
        positionY: readFloat(view, 0x11),
        facingDirection: readFloat(view, 0x15),
        joystickX: readFloat(view, 0x19),
        joystickY: readFloat(view, 0x1d),
        cStickX: readFloat(view, 0x21),
        cStickY: readFloat(view, 0x25),
        trigger: readFloat(view, 0x29),
        buttons: readUint32(view, 0x2d),
        physicalButtons: readUint16(view, 0x31),
        physicalLTrigger: readFloat(view, 0x33),
        physicalRTrigger: readFloat(view, 0x37),
        rawJoystickX: readInt8(view, 0x3b),
        percent: readFloat(view, 0x3c)
      };

    case Command.POST_FRAME_UPDATE:
      const selfInducedSpeeds = {
        airX: readFloat(view, 0x35),
        y: readFloat(view, 0x39),
        attackX: readFloat(view, 0x3d),
        attackY: readFloat(view, 0x41),
        groundX: readFloat(view, 0x45)
      };
      return {
        frame: readInt32(view, 0x1),
        playerIndex: readUint8(view, 0x5),
        isFollower: readBool(view, 0x6),
        internalCharacterId: readUint8(view, 0x7),
        actionStateId: readUint16(view, 0x8),
        positionX: readFloat(view, 0xa),
        positionY: readFloat(view, 0xe),
        facingDirection: readFloat(view, 0x12),
        percent: readFloat(view, 0x16),
        shieldSize: readFloat(view, 0x1a),
        lastAttackLanded: readUint8(view, 0x1e),
        currentComboCount: readUint8(view, 0x1f),
        lastHitBy: readUint8(view, 0x20),
        stocksRemaining: readUint8(view, 0x21),
        actionStateCounter: readFloat(view, 0x22),
        miscActionState: readFloat(view, 0x2b),
        isAirborne: readBool(view, 0x2f),
        lastGroundId: readUint16(view, 0x30),
        jumpsRemaining: readUint8(view, 0x32),
        lCancelStatus: readUint8(view, 0x33),
        hurtboxCollisionState: readUint8(view, 0x34),
        selfInducedSpeeds: selfInducedSpeeds,
        hitlagRemaining: readFloat(view, 0x49),
        animationIndex: readUint32(view, 0x4d)
      };

    case Command.ITEM_UPDATE:
      return {
        frame: readInt32(view, 0x1),
        typeId: readUint16(view, 0x5),
        state: readUint8(view, 0x7),
        facingDirection: readFloat(view, 0x8),
        velocityX: readFloat(view, 0xc),
        velocityY: readFloat(view, 0x10),
        positionX: readFloat(view, 0x14),
        positionY: readFloat(view, 0x18),
        damageTaken: readUint16(view, 0x1c),
        expirationTimer: readFloat(view, 0x1e),
        spawnId: readUint32(view, 0x22),
        missileType: readUint8(view, 0x26),
        turnipFace: readUint8(view, 0x27),
        chargeShotLaunched: readUint8(view, 0x28),
        chargePower: readUint8(view, 0x29),
        owner: readInt8(view, 0x2a)
      };

    case Command.FRAME_BOOKEND:
      return {
        frame: readInt32(view, 0x1),
        latestFinalizedFrame: readInt32(view, 0x5)
      };

    case Command.GAME_END:
      const placements = [0, 1, 2, 3].map(playerIndex => {
        const position = readInt8(view, 0x3 + playerIndex);
        return {
          playerIndex,
          position
        };
      });
      return {
        gameEndMethod: readUint8(view, 0x1),
        lrasInitiatorIndex: readInt8(view, 0x2),
        placements
      };

    case Command.GECKO_LIST:
      const codes = [];
      let pos = 1;

      while (pos < payload.length) {
        var _readUint3;

        const word1 = (_readUint3 = readUint32(view, pos)) != null ? _readUint3 : 0;
        const codetype = word1 >> 24 & 0xfe;
        const address = (word1 & 0x01ffffff) + 0x80000000;
        let offset = 8; // Default code length, most codes are this length

        if (codetype === 0xc0 || codetype === 0xc2) {
          var _readUint4;

          const lineCount = (_readUint4 = readUint32(view, pos + 4)) != null ? _readUint4 : 0;
          offset = 8 + lineCount * 8;
        } else if (codetype === 0x06) {
          var _readUint5;

          const byteLen = (_readUint5 = readUint32(view, pos + 4)) != null ? _readUint5 : 0;
          offset = 8 + (byteLen + 7 & 0xfffffff8);
        } else if (codetype === 0x08) {
          offset = 16;
        }

        codes.push({
          type: codetype,
          address: address,
          contents: payload.slice(pos, pos + offset)
        });
        pos += offset;
      }

      return {
        contents: payload.slice(1),
        codes: codes
      };

    default:
      return null;
  }
}

function canReadFromView(view, offset, length) {
  const viewLength = view.byteLength;
  return offset + length <= viewLength;
}

function readFloat(view, offset) {
  if (!canReadFromView(view, offset, 4)) {
    return null;
  }

  return view.getFloat32(offset);
}

function readInt32(view, offset) {
  if (!canReadFromView(view, offset, 4)) {
    return null;
  }

  return view.getInt32(offset);
}

function readInt8(view, offset) {
  if (!canReadFromView(view, offset, 1)) {
    return null;
  }

  return view.getInt8(offset);
}

function readUint32(view, offset) {
  if (!canReadFromView(view, offset, 4)) {
    return null;
  }

  return view.getUint32(offset);
}

function readUint16(view, offset) {
  if (!canReadFromView(view, offset, 2)) {
    return null;
  }

  return view.getUint16(offset);
}

function readUint8(view, offset, bitmask = 0xff) {
  if (!canReadFromView(view, offset, 1)) {
    return null;
  }

  return view.getUint8(offset) & bitmask;
}

function readBool(view, offset) {
  if (!canReadFromView(view, offset, 1)) {
    return null;
  }

  return !!view.getUint8(offset);
}

function getMetadata(slpFile) {
  if (slpFile.metadataLength <= 0) {
    // This will happen on a severed incomplete file
    // $FlowFixMe
    return null;
  }

  const buffer = new Uint8Array(slpFile.metadataLength);
  readRef(slpFile.ref, buffer, 0, buffer.length, slpFile.metadataPosition);
  let metadata = null;

  try {
    metadata = decode(buffer);
  } catch (ex) {// Do nothing
    // console.log(ex);
  } // $FlowFixMe


  return metadata;
}
function getGameEnd(slpFile) {
  const {
    ref,
    rawDataPosition,
    rawDataLength,
    messageSizes
  } = slpFile;
  const gameEndPayloadSize = messageSizes[Command.GAME_END];

  if (!exists(gameEndPayloadSize) || gameEndPayloadSize <= 0) {
    return null;
  } // Add one to account for command byte


  const gameEndSize = gameEndPayloadSize + 1;
  const gameEndPosition = rawDataPosition + rawDataLength - gameEndSize;
  const buffer = new Uint8Array(gameEndSize);
  readRef(ref, buffer, 0, buffer.length, gameEndPosition);

  if (buffer[0] !== Command.GAME_END) {
    // This isn't even a game end payload
    return null;
  }

  const gameEndMessage = parseMessage(Command.GAME_END, buffer);

  if (!gameEndMessage) {
    return null;
  }

  return gameEndMessage;
}
function extractFinalPostFrameUpdates(slpFile) {
  const {
    ref,
    rawDataPosition,
    rawDataLength,
    messageSizes
  } = slpFile; // The following should exist on all replay versions

  const postFramePayloadSize = messageSizes[Command.POST_FRAME_UPDATE];
  const gameEndPayloadSize = messageSizes[Command.GAME_END];
  const frameBookendPayloadSize = messageSizes[Command.FRAME_BOOKEND]; // Technically this should not be possible

  if (!exists(postFramePayloadSize)) {
    return [];
  }

  const gameEndSize = gameEndPayloadSize ? gameEndPayloadSize + 1 : 0;
  const postFrameSize = postFramePayloadSize + 1;
  const frameBookendSize = frameBookendPayloadSize ? frameBookendPayloadSize + 1 : 0;
  let frameNum = null;
  let postFramePosition = rawDataPosition + rawDataLength - gameEndSize - frameBookendSize - postFrameSize;
  const postFrameUpdates = [];

  do {
    const buffer = new Uint8Array(postFrameSize);
    readRef(ref, buffer, 0, buffer.length, postFramePosition);

    if (buffer[0] !== Command.POST_FRAME_UPDATE) {
      break;
    }

    const postFrameMessage = parseMessage(Command.POST_FRAME_UPDATE, buffer);

    if (!postFrameMessage) {
      break;
    }

    if (frameNum === null) {
      frameNum = postFrameMessage.frame;
    } else if (frameNum !== postFrameMessage.frame) {
      // If post frame message is found but the frame doesn't match, it's not part of the final frame
      break;
    }

    postFrameUpdates.unshift(postFrameMessage);
    postFramePosition -= postFrameSize;
  } while (postFramePosition >= rawDataPosition);

  return postFrameUpdates;
}

export { SlpInputSource, closeSlpFile, extractFinalPostFrameUpdates, getGameEnd, getMetadata, iterateEvents, openSlpFile, parseMessage };
//# sourceMappingURL=slpReader.esm.js.map

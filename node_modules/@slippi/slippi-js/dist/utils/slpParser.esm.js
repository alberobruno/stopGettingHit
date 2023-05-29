import { EventEmitter } from 'events';
import { get, set, keyBy } from 'lodash-es';
import semver from 'semver';
import { Frames, Command, ItemSpawnType, GameMode } from '../types.esm.js';
import { exists } from './exists.esm.js';
import { RollbackCounter } from './rollbackCounter.esm.js';

const ITEM_SETTINGS_BIT_COUNT = 40;
const MAX_ROLLBACK_FRAMES = 7;
var SlpParserEvent;

(function (SlpParserEvent) {
  SlpParserEvent["SETTINGS"] = "settings";
  SlpParserEvent["END"] = "end";
  SlpParserEvent["FRAME"] = "frame";
  SlpParserEvent["FINALIZED_FRAME"] = "finalized-frame";
  SlpParserEvent["ROLLBACK_FRAME"] = "rollback-frame";
})(SlpParserEvent || (SlpParserEvent = {})); // If strict mode is on, we will do strict validation checking
// which could throw errors on invalid data.
// Default to false though since probably only real time applications
// would care about valid data.


const defaultSlpParserOptions = {
  strict: false
};
class SlpParser extends EventEmitter {
  constructor(options) {
    super();
    this.frames = {};
    this.rollbackCounter = new RollbackCounter();
    this.settings = null;
    this.gameEnd = null;
    this.latestFrameIndex = null;
    this.settingsComplete = false;
    this.lastFinalizedFrame = Frames.FIRST - 1;
    this.options = void 0;
    this.geckoList = null;
    this.options = Object.assign({}, defaultSlpParserOptions, options);
  } // eslint-disable-next-line @typescript-eslint/no-explicit-any


  handleCommand(command, payload) {
    switch (command) {
      case Command.GAME_START:
        this._handleGameStart(payload);

        break;

      case Command.FRAME_START:
        this._handleFrameStart(payload);

        break;

      case Command.POST_FRAME_UPDATE:
        // We need to handle the post frame update first since that
        // will finalize the settings object, before we fire the frame update
        this._handlePostFrameUpdate(payload);

        this._handleFrameUpdate(command, payload);

        break;

      case Command.PRE_FRAME_UPDATE:
        this._handleFrameUpdate(command, payload);

        break;

      case Command.ITEM_UPDATE:
        this._handleItemUpdate(payload);

        break;

      case Command.FRAME_BOOKEND:
        this._handleFrameBookend(payload);

        break;

      case Command.GAME_END:
        this._handleGameEnd(payload);

        break;

      case Command.GECKO_LIST:
        this._handleGeckoList(payload);

        break;
    }
  }
  /**
   * Resets the parser state to their default values.
   */


  reset() {
    this.frames = {};
    this.settings = null;
    this.gameEnd = null;
    this.latestFrameIndex = null;
    this.settingsComplete = false;
    this.lastFinalizedFrame = Frames.FIRST - 1;
  }

  getLatestFrameNumber() {
    var _this$latestFrameInde;

    return (_this$latestFrameInde = this.latestFrameIndex) != null ? _this$latestFrameInde : Frames.FIRST - 1;
  }

  getPlayableFrameCount() {
    if (this.latestFrameIndex === null) {
      return 0;
    }

    return this.latestFrameIndex < Frames.FIRST_PLAYABLE ? 0 : this.latestFrameIndex - Frames.FIRST_PLAYABLE;
  }

  getLatestFrame() {
    // return this.playerFrames[this.latestFrameIndex];
    // TODO: Modify this to check if we actually have all the latest frame data and return that
    // TODO: If we do. For now I'm just going to take a shortcut
    const allFrames = this.getFrames();
    const frameIndex = this.latestFrameIndex !== null ? this.latestFrameIndex : Frames.FIRST;
    const indexToUse = this.gameEnd ? frameIndex : frameIndex - 1;
    return get(allFrames, indexToUse) || null;
  }

  getSettings() {
    return this.settingsComplete ? this.settings : null;
  }

  getItems() {
    var _this$settings, _this$settings2;

    if (((_this$settings = this.settings) == null ? void 0 : _this$settings.itemSpawnBehavior) === ItemSpawnType.OFF) {
      return null;
    }

    const itemBitfield = (_this$settings2 = this.settings) == null ? void 0 : _this$settings2.enabledItems;

    if (!exists(itemBitfield)) {
      return null;
    }

    const enabledItems = []; // Ideally we would be able to do this with bitshifting instead, but javascript
    // truncates numbers after 32 bits when doing bitwise operations

    for (let i = 0; i < ITEM_SETTINGS_BIT_COUNT; i++) {
      if (Math.floor(itemBitfield / 2 ** i) & 1) {
        enabledItems.push(2 ** i);
      }
    }

    return enabledItems;
  }

  getGameEnd() {
    return this.gameEnd;
  }

  getFrames() {
    return this.frames;
  }

  getRollbackFrames() {
    return {
      frames: this.rollbackCounter.getFrames(),
      count: this.rollbackCounter.getCount(),
      lengths: this.rollbackCounter.getLengths()
    };
  }

  getFrame(num) {
    return this.frames[num] || null;
  }

  getGeckoList() {
    return this.geckoList;
  }

  _handleGeckoList(payload) {
    this.geckoList = payload;
  }

  _handleGameEnd(payload) {
    // Finalize remaining frames if necessary
    if (this.latestFrameIndex !== null && this.latestFrameIndex !== this.lastFinalizedFrame) {
      this._finalizeFrames(this.latestFrameIndex);
    }

    payload = payload;
    this.gameEnd = payload;
    this.emit(SlpParserEvent.END, this.gameEnd);
  }

  _handleGameStart(payload) {
    this.settings = payload;
    const players = payload.players;
    this.settings.players = players.filter(player => player.type !== 3); // Check to see if the file was created after the sheik fix so we know
    // we don't have to process the first frame of the game for the full settings

    if (payload.slpVersion && semver.gte(payload.slpVersion, "1.6.0")) {
      this._completeSettings();
    }
  }

  _handleFrameStart(payload) {
    const currentFrameNumber = payload.frame;
    set(this.frames, [currentFrameNumber, "start"], payload);
  }

  _handlePostFrameUpdate(payload) {
    if (this.settingsComplete) {
      return;
    } // Finish calculating settings


    if (payload.frame <= Frames.FIRST) {
      const playerIndex = payload.playerIndex;
      const playersByIndex = keyBy(this.settings.players, "playerIndex");

      switch (payload.internalCharacterId) {
        case 0x7:
          playersByIndex[playerIndex].characterId = 0x13; // Sheik

          break;

        case 0x13:
          playersByIndex[playerIndex].characterId = 0x12; // Zelda

          break;
      }
    }

    if (payload.frame > Frames.FIRST) {
      this._completeSettings();
    }
  }

  _handleFrameUpdate(command, payload) {
    payload = payload;
    const location = command === Command.PRE_FRAME_UPDATE ? "pre" : "post";
    const field = payload.isFollower ? "followers" : "players";
    const currentFrameNumber = payload.frame;
    this.latestFrameIndex = currentFrameNumber;

    if (location === "pre" && !payload.isFollower) {
      const currentFrame = this.frames[currentFrameNumber];
      const wasRolledback = this.rollbackCounter.checkIfRollbackFrame(currentFrame, payload.playerIndex);

      if (wasRolledback) {
        // frame is about to be overwritten
        this.emit(SlpParserEvent.ROLLBACK_FRAME, currentFrame);
      }
    }

    set(this.frames, [currentFrameNumber, field, payload.playerIndex, location], payload);
    set(this.frames, [currentFrameNumber, "frame"], currentFrameNumber); // If file is from before frame bookending, add frame to stats computer here. Does a little
    // more processing than necessary, but it works

    const settings = this.getSettings();

    if (settings && (!settings.slpVersion || semver.lte(settings.slpVersion, "2.2.0"))) {
      this.emit(SlpParserEvent.FRAME, this.frames[currentFrameNumber]); // Finalize the previous frame since no bookending exists

      this._finalizeFrames(currentFrameNumber - 1);
    } else {
      set(this.frames, [currentFrameNumber, "isTransferComplete"], false);
    }
  }

  _handleItemUpdate(payload) {
    var _this$frames$currentF, _this$frames$currentF2;

    const currentFrameNumber = payload.frame;
    const items = (_this$frames$currentF = (_this$frames$currentF2 = this.frames[currentFrameNumber]) == null ? void 0 : _this$frames$currentF2.items) != null ? _this$frames$currentF : [];
    items.push(payload); // Set items with newest

    set(this.frames, [currentFrameNumber, "items"], items);
  }

  _handleFrameBookend(payload) {
    const latestFinalizedFrame = payload.latestFinalizedFrame;
    const currentFrameNumber = payload.frame;
    set(this.frames, [currentFrameNumber, "isTransferComplete"], true); // Fire off a normal frame event

    this.emit(SlpParserEvent.FRAME, this.frames[currentFrameNumber]); // Finalize frames if necessary

    const validLatestFrame = this.settings.gameMode === GameMode.ONLINE;

    if (validLatestFrame && latestFinalizedFrame >= Frames.FIRST) {
      // Ensure valid latestFinalizedFrame
      if (this.options.strict && latestFinalizedFrame < currentFrameNumber - MAX_ROLLBACK_FRAMES) {
        throw new Error(`latestFinalizedFrame should be within ${MAX_ROLLBACK_FRAMES} frames of ${currentFrameNumber}`);
      }

      this._finalizeFrames(latestFinalizedFrame);
    } else {
      // Since we don't have a valid finalized frame, just finalize the frame based on MAX_ROLLBACK_FRAMES
      this._finalizeFrames(currentFrameNumber - MAX_ROLLBACK_FRAMES);
    }
  }
  /**
   * Fires off the FINALIZED_FRAME event for frames up until a certain number
   * @param num The frame to finalize until
   */


  _finalizeFrames(num) {
    while (this.lastFinalizedFrame < num) {
      const frameToFinalize = this.lastFinalizedFrame + 1;
      const frame = this.getFrame(frameToFinalize); // Check that we have all the pre and post frame data for all players if we're in strict mode

      if (this.options.strict) {
        for (const player of this.settings.players) {
          const playerFrameInfo = frame.players[player.playerIndex]; // Allow player frame info to be empty in non 1v1 games since
          // players which have been defeated will have no frame info.

          if (this.settings.players.length > 2 && !playerFrameInfo) {
            continue;
          }

          const {
            pre,
            post
          } = playerFrameInfo;

          if (!pre || !post) {
            const preOrPost = pre ? "pre" : "post";
            throw new Error(`Could not finalize frame ${frameToFinalize} of ${num}: missing ${preOrPost}-frame update for player ${player.playerIndex}`);
          }
        }
      } // Our frame is complete so finalize the frame


      this.emit(SlpParserEvent.FINALIZED_FRAME, frame);
      this.lastFinalizedFrame = frameToFinalize;
    }
  }

  _completeSettings() {
    if (!this.settingsComplete) {
      this.settingsComplete = true;
      this.emit(SlpParserEvent.SETTINGS, this.settings);
    }
  }

}

export { MAX_ROLLBACK_FRAMES, SlpParser, SlpParserEvent };
//# sourceMappingURL=slpParser.esm.js.map

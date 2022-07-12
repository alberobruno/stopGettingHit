import { Writable } from 'stream';
import '../console/communication.esm.js';
import { NETWORK_MESSAGE } from '../console/consoleConnection.esm.js';
import '../console/dolphinConnection.esm.js';
import '../console/types.esm.js';
import { Command } from '../types.esm.js';
import { parseMessage } from './slpReader.esm.js';

var SlpStreamMode;

(function (SlpStreamMode) {
  SlpStreamMode["AUTO"] = "AUTO";
  SlpStreamMode["MANUAL"] = "MANUAL";
})(SlpStreamMode || (SlpStreamMode = {}));

const defaultSettings = {
  suppressErrors: false,
  mode: SlpStreamMode.AUTO
};
var SlpStreamEvent;

(function (SlpStreamEvent) {
  SlpStreamEvent["RAW"] = "slp-raw";
  SlpStreamEvent["COMMAND"] = "slp-command";
})(SlpStreamEvent || (SlpStreamEvent = {}));
/**
 * SlpStream is a writable stream of Slippi data. It passes the data being written in
 * and emits an event based on what kind of Slippi messages were processed.
 *
 * SlpStream emits two events: "slp-raw" and "slp-command". The "slp-raw" event emits the raw buffer
 * bytes whenever it processes each command. You can manually parse this or write it to a
 * file. The "slp-command" event returns the parsed payload which you can access the attributes.
 *
 * @class SlpStream
 * @extends {Writable}
 */


class SlpStream extends Writable {
  // True only if in manual mode and the game has completed

  /**
   *Creates an instance of SlpStream.
   * @param {Partial<SlpStreamSettings>} [slpOptions]
   * @param {WritableOptions} [opts]
   * @memberof SlpStream
   */
  constructor(slpOptions, opts) {
    super(opts);
    this.gameEnded = false;
    this.settings = void 0;
    this.payloadSizes = null;
    this.previousBuffer = Buffer.from([]);
    this.settings = Object.assign({}, defaultSettings, slpOptions);
  }

  restart() {
    this.gameEnded = false;
    this.payloadSizes = null;
  } // eslint-disable-next-line @typescript-eslint/no-explicit-any


  _write(newData, encoding, callback) {
    if (encoding !== "buffer") {
      throw new Error(`Unsupported stream encoding. Expected 'buffer' got '${encoding}'.`);
    } // Join the current data with the old data


    const data = Uint8Array.from(Buffer.concat([this.previousBuffer, newData])); // Clear previous data

    this.previousBuffer = Buffer.from([]);
    const dataView = new DataView(data.buffer); // Iterate through the data

    let index = 0;

    while (index < data.length) {
      // We want to filter out the network messages
      if (Buffer.from(data.slice(index, index + 5)).toString() === NETWORK_MESSAGE) {
        index += 5;
        continue;
      } // Make sure we have enough data to read a full payload


      const command = dataView.getUint8(index);
      let payloadSize = 0;

      if (this.payloadSizes) {
        var _this$payloadSizes$ge;

        payloadSize = (_this$payloadSizes$ge = this.payloadSizes.get(command)) != null ? _this$payloadSizes$ge : 0;
      }

      const remainingLen = data.length - index;

      if (remainingLen < payloadSize + 1) {
        // If remaining length is not long enough for full payload, save the remaining
        // data until we receive more data. The data has been split up.
        this.previousBuffer = data.slice(index);
        break;
      } // Only process if the game is still going


      if (this.settings.mode === SlpStreamMode.MANUAL && this.gameEnded) {
        break;
      } // Increment by one for the command byte


      index += 1;
      const payloadPtr = data.slice(index);
      const payloadDataView = new DataView(data.buffer, index);
      let payloadLen = 0;

      try {
        payloadLen = this._processCommand(command, payloadPtr, payloadDataView);
      } catch (err) {
        // Only throw the error if we're not suppressing the errors
        if (!this.settings.suppressErrors) {
          throw err;
        }

        payloadLen = 0;
      }

      index += payloadLen;
    }

    callback();
  }

  _writeCommand(command, entirePayload, payloadSize) {
    const payloadBuf = entirePayload.slice(0, payloadSize);
    const bufToWrite = Buffer.concat([Buffer.from([command]), payloadBuf]); // Forward the raw buffer onwards

    this.emit(SlpStreamEvent.RAW, {
      command: command,
      payload: bufToWrite
    });
    return new Uint8Array(bufToWrite);
  }

  _processCommand(command, entirePayload, dataView) {
    // Handle the message size command
    if (command === Command.MESSAGE_SIZES) {
      const payloadSize = dataView.getUint8(0); // Set the payload sizes

      this.payloadSizes = processReceiveCommands(dataView); // Emit the raw command event

      this._writeCommand(command, entirePayload, payloadSize);

      this.emit(SlpStreamEvent.COMMAND, {
        command: command,
        payload: this.payloadSizes
      });
      return payloadSize;
    }

    let payloadSize = 0;

    if (this.payloadSizes) {
      var _this$payloadSizes$ge2;

      payloadSize = (_this$payloadSizes$ge2 = this.payloadSizes.get(command)) != null ? _this$payloadSizes$ge2 : 0;
    } // Fetch the payload and parse it


    let payload;
    let parsedPayload = null;

    if (payloadSize > 0) {
      payload = this._writeCommand(command, entirePayload, payloadSize);
      parsedPayload = parseMessage(command, payload);
    }

    if (!parsedPayload) {
      return payloadSize;
    }

    switch (command) {
      case Command.GAME_END:
        // Stop parsing data until we manually restart the stream
        if (this.settings.mode === SlpStreamMode.MANUAL) {
          this.gameEnded = true;
        }

        break;
    }

    this.emit(SlpStreamEvent.COMMAND, {
      command: command,
      payload: parsedPayload
    });
    return payloadSize;
  }

}

const processReceiveCommands = dataView => {
  const payloadSizes = new Map();
  const payloadLen = dataView.getUint8(0);

  for (let i = 1; i < payloadLen; i += 3) {
    const commandByte = dataView.getUint8(i);
    const payloadSize = dataView.getUint16(i + 1);
    payloadSizes.set(commandByte, payloadSize);
  }

  return payloadSizes;
};

export { SlpStream, SlpStreamEvent, SlpStreamMode };
//# sourceMappingURL=slpStream.esm.js.map

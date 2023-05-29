import { format } from 'date-fns';
import path from 'path';
import { Command } from '../types.esm.js';
import { SlpFile } from './slpFile.esm.js';
import { SlpStream, SlpStreamEvent } from './slpStream.esm.js';

/**
 * The default function to use for generating new SLP files.
 */

function getNewFilePath(folder, date) {
  return path.join(folder, `Game_${format(date, "yyyyMMdd")}T${format(date, "HHmmss")}.slp`);
}

const defaultSettings = {
  outputFiles: true,
  folderPath: ".",
  consoleNickname: "unknown",
  newFilename: getNewFilePath
};
var SlpFileWriterEvent;

(function (SlpFileWriterEvent) {
  SlpFileWriterEvent["NEW_FILE"] = "new-file";
  SlpFileWriterEvent["FILE_COMPLETE"] = "file-complete";
})(SlpFileWriterEvent || (SlpFileWriterEvent = {}));
/**
 * SlpFileWriter lets us not only emit events as an SlpStream but also
 * writes the data that is being passed in to an SLP file. Use this if
 * you want to process Slippi data in real time but also want to be able
 * to write out the data to an SLP file.
 *
 * @export
 * @class SlpFileWriter
 * @extends {SlpStream}
 */


class SlpFileWriter extends SlpStream {
  /**
   * Creates an instance of SlpFileWriter.
   */
  constructor(options, opts) {
    super(options, opts);
    this.currentFile = null;
    this.options = void 0;
    this.options = Object.assign({}, defaultSettings, options);

    this._setupListeners();
  }

  _writePayload(payload) {
    // Write data to the current file
    if (this.currentFile) {
      this.currentFile.write(payload);
    }
  }

  _setupListeners() {
    this.on(SlpStreamEvent.RAW, data => {
      const {
        command,
        payload
      } = data;

      switch (command) {
        case Command.MESSAGE_SIZES:
          // Create the new game first before writing the payload
          this._handleNewGame();

          this._writePayload(payload);

          break;

        case Command.GAME_END:
          // Write payload first before ending the game
          this._writePayload(payload);

          this._handleEndGame();

          break;

        default:
          this._writePayload(payload);

          break;
      }
    });
  }
  /**
   * Return the name of the SLP file currently being written or null if
   * no file is being written to currently.
   *
   * @returns {(string | null)}
   * @memberof SlpFileWriter
   */


  getCurrentFilename() {
    if (this.currentFile !== null) {
      return path.resolve(this.currentFile.path());
    }

    return null;
  }
  /**
   * Ends the current file being written to.
   *
   * @returns {(string | null)}
   * @memberof SlpFileWriter
   */


  endCurrentFile() {
    this._handleEndGame();
  }
  /**
   * Updates the settings to be the desired ones passed in.
   *
   * @param {Partial<SlpFileWriterOptions>} settings
   * @memberof SlpFileWriter
   */


  updateSettings(settings) {
    this.options = Object.assign({}, this.options, settings);
  }

  _handleNewGame() {
    // Only create a new file if we're outputting files
    if (this.options.outputFiles) {
      const filePath = this.options.newFilename(this.options.folderPath, new Date());
      this.currentFile = new SlpFile(filePath, this); // console.log(`Creating new file at: ${filePath}`);

      this.emit(SlpFileWriterEvent.NEW_FILE, filePath);
    }
  }

  _handleEndGame() {
    // End the stream
    if (this.currentFile) {
      // Set the console nickname
      this.currentFile.setMetadata({
        consoleNickname: this.options.consoleNickname
      });
      this.currentFile.end(); // console.log(`Finished writing file: ${this.currentFile.path()}`);

      this.emit(SlpFileWriterEvent.FILE_COMPLETE, this.currentFile.path()); // Clear current file

      this.currentFile = null;
    }
  }

}

export { SlpFileWriter, SlpFileWriterEvent };
//# sourceMappingURL=slpFileWriter.esm.js.map

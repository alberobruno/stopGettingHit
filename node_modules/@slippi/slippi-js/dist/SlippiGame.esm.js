import { ActionsComputer } from './stats/actions.esm.js';
import { ComboComputer } from './stats/combos.esm.js';
import './stats/common.esm.js';
import { ConversionComputer } from './stats/conversions.esm.js';
import { InputComputer } from './stats/inputs.esm.js';
import { generateOverallStats } from './stats/overall.esm.js';
import { Stats } from './stats/stats.esm.js';
import { StockComputer } from './stats/stocks.esm.js';
import { TargetBreakComputer } from './stats/targets.esm.js';
import { GameMode, GameEndMethod } from './types.esm.js';
import { getWinners } from './utils/getWinners.esm.js';
import { extractDistanceInfoFromFrame } from './utils/homeRunDistance.esm.js';
import { SlpParser, SlpParserEvent } from './utils/slpParser.esm.js';
import { SlpInputSource, openSlpFile, iterateEvents, closeSlpFile, getGameEnd, getMetadata, extractFinalPostFrameUpdates } from './utils/slpReader.esm.js';

/**
 * Slippi Game class that wraps a file
 */

class SlippiGame {
  constructor(input, opts) {
    this.input = void 0;
    this.metadata = null;
    this.finalStats = null;
    this.parser = void 0;
    this.readPosition = null;
    this.actionsComputer = new ActionsComputer();
    this.conversionComputer = new ConversionComputer();
    this.comboComputer = new ComboComputer();
    this.stockComputer = new StockComputer();
    this.inputComputer = new InputComputer();
    this.targetBreakComputer = new TargetBreakComputer();
    this.statsComputer = void 0;

    if (typeof input === "string") {
      this.input = {
        source: SlpInputSource.FILE,
        filePath: input
      };
    } else if (input instanceof Buffer) {
      this.input = {
        source: SlpInputSource.BUFFER,
        buffer: input
      };
    } else if (input instanceof ArrayBuffer) {
      this.input = {
        source: SlpInputSource.BUFFER,
        buffer: Buffer.from(input)
      };
    } else {
      throw new Error("Cannot create SlippiGame with input of that type");
    } // Set up stats calculation


    this.statsComputer = new Stats(opts);
    this.statsComputer.register(this.actionsComputer, this.comboComputer, this.conversionComputer, this.inputComputer, this.stockComputer, this.targetBreakComputer);
    this.parser = new SlpParser();
    this.parser.on(SlpParserEvent.SETTINGS, settings => {
      this.statsComputer.setup(settings);
    }); // Use finalized frames for stats computation

    this.parser.on(SlpParserEvent.FINALIZED_FRAME, frame => {
      this.statsComputer.addFrame(frame);
    });
  }

  _process(shouldStop = () => false, file) {
    if (this.parser.getGameEnd() !== null) {
      return;
    }

    const slpfile = file != null ? file : openSlpFile(this.input); // Generate settings from iterating through file

    this.readPosition = iterateEvents(slpfile, (command, payload) => {
      if (!payload) {
        // If payload is falsy, keep iterating. The parser probably just doesn't know
        // about this command yet
        return false;
      }

      this.parser.handleCommand(command, payload);
      return shouldStop(command, payload);
    }, this.readPosition);

    if (!file) {
      closeSlpFile(slpfile);
    }
  }
  /**
   * Gets the game settings, these are the settings that describe the starting state of
   * the game such as characters, stage, etc.
   */


  getSettings() {
    // Settings is only complete after post-frame update
    this._process(() => this.parser.getSettings() !== null);

    return this.parser.getSettings();
  }

  getItems() {
    this._process();

    return this.parser.getItems();
  }

  getLatestFrame() {
    this._process();

    return this.parser.getLatestFrame();
  }

  getGameEnd(options = {}) {
    if (options != null && options.skipProcessing) {
      // Read game end block directly
      const slpfile = openSlpFile(this.input);
      const gameEnd = getGameEnd(slpfile);
      closeSlpFile(slpfile);
      return gameEnd;
    }

    this._process();

    return this.parser.getGameEnd();
  }

  getFrames() {
    this._process();

    return this.parser.getFrames();
  }

  getRollbackFrames() {
    this._process();

    return this.parser.getRollbackFrames();
  }

  getGeckoList() {
    this._process(() => this.parser.getGeckoList() !== null);

    return this.parser.getGeckoList();
  }

  getStats() {
    if (this.finalStats) {
      return this.finalStats;
    }

    this._process();

    const settings = this.parser.getSettings();

    if (!settings) {
      return null;
    } // Finish processing if we're not up to date


    this.statsComputer.process();
    const inputs = this.inputComputer.fetch();
    const stocks = this.stockComputer.fetch();
    const conversions = this.conversionComputer.fetch();
    const playableFrameCount = this.parser.getPlayableFrameCount();
    const overall = generateOverallStats({
      settings,
      inputs,
      conversions,
      playableFrameCount
    });
    const gameEnd = this.parser.getGameEnd();
    const gameComplete = gameEnd !== null;
    const stats = {
      lastFrame: this.parser.getLatestFrameNumber(),
      playableFrameCount,
      stocks: stocks,
      conversions: conversions,
      combos: this.comboComputer.fetch(),
      actionCounts: this.actionsComputer.fetch(),
      overall: overall,
      gameComplete
    };

    if (gameComplete) {
      // If the game is complete, store a cached version of stats because it should not
      // change anymore. Ideally the statsCompuer.process and fetch functions would simply do no
      // work in this case instead but currently the conversions fetch function,
      // generateOverallStats, and maybe more are doing work on every call.
      this.finalStats = stats;
    }

    return stats;
  }

  getStadiumStats() {
    this._process();

    const settings = this.parser.getSettings();

    if (!settings) {
      return null;
    }

    const latestFrame = this.parser.getLatestFrame();
    const players = latestFrame == null ? void 0 : latestFrame.players;

    if (!players) {
      return null;
    }

    this.statsComputer.process();

    switch (settings.gameMode) {
      case GameMode.TARGET_TEST:
        return {
          type: "target-test",
          targetBreaks: this.targetBreakComputer.fetch()
        };

      case GameMode.HOME_RUN_CONTEST:
        const distanceInfo = extractDistanceInfoFromFrame(settings, latestFrame);

        if (!distanceInfo) {
          return null;
        }

        return {
          type: "home-run-contest",
          distance: distanceInfo.distance,
          units: distanceInfo.units
        };

      default:
        return null;
    }
  }

  getMetadata() {
    if (this.metadata) {
      return this.metadata;
    }

    const slpfile = openSlpFile(this.input);
    this.metadata = getMetadata(slpfile);
    closeSlpFile(slpfile);
    return this.metadata;
  }

  getFilePath() {
    var _this$input$filePath;

    if (this.input.source !== SlpInputSource.FILE) {
      return null;
    }

    return (_this$input$filePath = this.input.filePath) != null ? _this$input$filePath : null;
  }

  getWinners() {
    // Read game end block directly
    const slpfile = openSlpFile(this.input);
    const gameEnd = getGameEnd(slpfile);

    this._process(() => this.parser.getSettings() !== null, slpfile);

    const settings = this.parser.getSettings();

    if (!gameEnd || !settings) {
      // Technically using the final post frame updates, it should be possible to compute winners for
      // replays without a gameEnd message. But I'll leave this here anyway
      closeSlpFile(slpfile);
      return [];
    } // If we went to time, let's fetch the post frame updates to compute the winner


    let finalPostFrameUpdates = [];

    if (gameEnd.gameEndMethod === GameEndMethod.TIME) {
      finalPostFrameUpdates = extractFinalPostFrameUpdates(slpfile);
    }

    closeSlpFile(slpfile);
    return getWinners(gameEnd, settings, finalPostFrameUpdates);
  }

}

export { SlippiGame };
//# sourceMappingURL=SlippiGame.esm.js.map

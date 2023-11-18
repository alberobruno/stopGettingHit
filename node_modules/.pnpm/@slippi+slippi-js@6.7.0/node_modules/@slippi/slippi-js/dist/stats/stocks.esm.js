import { getSinglesPlayerPermutationsFromSettings, didLoseStock, isDead } from './common.esm.js';

class StockComputer {
  constructor() {
    this.state = new Map();
    this.playerPermutations = new Array();
    this.stocks = new Array();
  }

  setup(settings) {
    // Reset state
    this.state = new Map();
    this.playerPermutations = getSinglesPlayerPermutationsFromSettings(settings);
    this.stocks = [];
    this.playerPermutations.forEach(indices => {
      const playerState = {
        stock: null
      };
      this.state.set(indices, playerState);
    });
  }

  processFrame(frame, allFrames) {
    this.playerPermutations.forEach(indices => {
      const state = this.state.get(indices);

      if (state) {
        handleStockCompute(allFrames, state, indices, frame, this.stocks);
      }
    });
  }

  fetch() {
    return this.stocks;
  }

}

function handleStockCompute(frames, state, indices, frame, stocks) {
  const playerFrame = frame.players[indices.playerIndex].post;
  const currentFrameNumber = playerFrame.frame;
  const prevFrameNumber = currentFrameNumber - 1;
  const prevPlayerFrame = frames[prevFrameNumber] ? frames[prevFrameNumber].players[indices.playerIndex].post : null; // If there is currently no active stock, wait until the player is no longer spawning.
  // Once the player is no longer spawning, start the stock

  if (!state.stock) {
    const isPlayerDead = isDead(playerFrame.actionStateId);

    if (isPlayerDead) {
      return;
    }

    state.stock = {
      playerIndex: indices.playerIndex,
      startFrame: currentFrameNumber,
      endFrame: null,
      startPercent: 0,
      endPercent: null,
      currentPercent: 0,
      count: playerFrame.stocksRemaining,
      deathAnimation: null
    };
    stocks.push(state.stock);
  } else if (prevPlayerFrame && didLoseStock(playerFrame, prevPlayerFrame)) {
    var _prevPlayerFrame$perc;

    state.stock.endFrame = playerFrame.frame;
    state.stock.endPercent = (_prevPlayerFrame$perc = prevPlayerFrame.percent) != null ? _prevPlayerFrame$perc : 0;
    state.stock.deathAnimation = playerFrame.actionStateId;
    state.stock = null;
  } else {
    var _playerFrame$percent;

    state.stock.currentPercent = (_playerFrame$percent = playerFrame.percent) != null ? _playerFrame$percent : 0;
  }
}

export { StockComputer };
//# sourceMappingURL=stocks.esm.js.map

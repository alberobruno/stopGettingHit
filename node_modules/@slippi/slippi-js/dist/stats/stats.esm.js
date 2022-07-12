import { get } from 'lodash-es';
import { Frames } from '../types.esm.js';

const defaultOptions = {
  processOnTheFly: false
};
class Stats {
  constructor(options) {
    this.options = void 0;
    this.lastProcessedFrame = null;
    this.frames = {};
    this.players = [];
    this.allComputers = new Array();
    this.options = Object.assign({}, defaultOptions, options);
  }
  /**
   * Should reset the frames to their default values.
   */


  setup(settings) {
    // Reset the frames since it's a new game
    this.frames = {};
    this.players = settings.players.map(v => v.playerIndex); // Forward the settings on to the individual stat computer

    this.allComputers.forEach(comp => comp.setup(settings));
  }

  register(...computer) {
    this.allComputers.push(...computer);
  }

  process() {
    if (this.players.length === 0) {
      return;
    }

    let i = this.lastProcessedFrame !== null ? this.lastProcessedFrame + 1 : Frames.FIRST;

    while (this.frames[i]) {
      const frame = this.frames[i]; // Don't attempt to compute stats on frames that have not been fully received

      if (!isCompletedFrame(this.players, frame)) {
        return;
      }

      this.allComputers.forEach(comp => comp.processFrame(frame, this.frames));
      this.lastProcessedFrame = i;
      i++;
    }
  }

  addFrame(frame) {
    this.frames[frame.frame] = frame;

    if (this.options.processOnTheFly) {
      this.process();
    }
  }

}

function isCompletedFrame(players, frame) {
  if (!frame) {
    return false;
  } // This function checks whether we have successfully received an entire frame.
  // It is not perfect because it does not wait for follower frames. Fortunately,
  // follower frames are not used for any stat calculations so this doesn't matter
  // for our purposes.


  for (const player of players) {
    const playerPostFrame = get(frame, ["players", player, "post"]);

    if (!playerPostFrame) {
      return false;
    }
  }

  return true;
}

export { Stats };
//# sourceMappingURL=stats.esm.js.map

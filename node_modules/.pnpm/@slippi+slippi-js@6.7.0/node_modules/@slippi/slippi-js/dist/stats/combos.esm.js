import { EventEmitter } from 'events';
import { last } from 'lodash-es';
import { getSinglesPlayerPermutationsFromSettings, isDamaged, isGrabbed, isCommandGrabbed, calcDamageTaken, isTeching, isDown, didLoseStock, isDead, Timers } from './common.esm.js';

var ComboEvent;

(function (ComboEvent) {
  ComboEvent["COMBO_START"] = "COMBO_START";
  ComboEvent["COMBO_EXTEND"] = "COMBO_EXTEND";
  ComboEvent["COMBO_END"] = "COMBO_END";
})(ComboEvent || (ComboEvent = {}));

class ComboComputer extends EventEmitter {
  constructor(...args) {
    super(...args);
    this.playerPermutations = new Array();
    this.state = new Map();
    this.combos = new Array();
    this.settings = null;
  }

  setup(settings) {
    // Reset the state
    this.settings = settings;
    this.state = new Map();
    this.combos = [];
    this.playerPermutations = getSinglesPlayerPermutationsFromSettings(settings);
    this.playerPermutations.forEach(indices => {
      const playerState = {
        combo: null,
        move: null,
        resetCounter: 0,
        lastHitAnimation: null,
        event: null
      };
      this.state.set(indices, playerState);
    });
  }

  processFrame(frame, allFrames) {
    this.playerPermutations.forEach(indices => {
      const state = this.state.get(indices);

      if (state) {
        handleComboCompute(allFrames, state, indices, frame, this.combos); // Emit an event for the new combo

        if (state.event !== null) {
          this.emit(state.event, {
            combo: last(this.combos),
            settings: this.settings
          });
          state.event = null;
        }
      }
    });
  }

  fetch() {
    return this.combos;
  }

}

function handleComboCompute(frames, state, indices, frame, combos) {
  const currentFrameNumber = frame.frame;
  const playerFrame = frame.players[indices.playerIndex].post;
  const opponentFrame = frame.players[indices.opponentIndex].post;
  const prevFrameNumber = currentFrameNumber - 1;
  let prevPlayerFrame = null;
  let prevOpponentFrame = null;

  if (frames[prevFrameNumber]) {
    prevPlayerFrame = frames[prevFrameNumber].players[indices.playerIndex].post;
    prevOpponentFrame = frames[prevFrameNumber].players[indices.opponentIndex].post;
  }

  const oppActionStateId = opponentFrame.actionStateId;
  const opntIsDamaged = isDamaged(oppActionStateId);
  const opntIsGrabbed = isGrabbed(oppActionStateId);
  const opntIsCommandGrabbed = isCommandGrabbed(oppActionStateId);
  const opntDamageTaken = prevOpponentFrame ? calcDamageTaken(opponentFrame, prevOpponentFrame) : 0; // Keep track of whether actionState changes after a hit. Used to compute move count
  // When purely using action state there was a bug where if you did two of the same
  // move really fast (such as ganon's jab), it would count as one move. Added
  // the actionStateCounter at this point which counts the number of frames since
  // an animation started. Should be more robust, for old files it should always be
  // null and null < null = false

  const actionChangedSinceHit = playerFrame.actionStateId !== state.lastHitAnimation;
  const actionCounter = playerFrame.actionStateCounter;
  const prevActionCounter = prevPlayerFrame ? prevPlayerFrame.actionStateCounter : 0;
  const actionFrameCounterReset = actionCounter < prevActionCounter;

  if (actionChangedSinceHit || actionFrameCounterReset) {
    state.lastHitAnimation = null;
  } // If opponent took damage and was put in some kind of stun this frame, either
  // start a combo or count the moves for the existing combo


  if (opntIsDamaged || opntIsGrabbed || opntIsCommandGrabbed) {
    let comboStarted = false;

    if (!state.combo) {
      var _prevOpponentFrame$pe, _opponentFrame$percen;

      state.combo = {
        playerIndex: indices.opponentIndex,
        startFrame: currentFrameNumber,
        endFrame: null,
        startPercent: prevOpponentFrame ? (_prevOpponentFrame$pe = prevOpponentFrame.percent) != null ? _prevOpponentFrame$pe : 0 : 0,
        currentPercent: (_opponentFrame$percen = opponentFrame.percent) != null ? _opponentFrame$percen : 0,
        endPercent: null,
        moves: [],
        didKill: false,
        lastHitBy: indices.playerIndex
      };
      combos.push(state.combo); // Track whether this is a new combo or not

      comboStarted = true;
    }

    if (opntDamageTaken) {
      // If animation of last hit has been cleared that means this is a new move. This
      // prevents counting multiple hits from the same move such as fox's drill
      if (state.lastHitAnimation === null) {
        state.move = {
          playerIndex: indices.playerIndex,
          frame: currentFrameNumber,
          moveId: playerFrame.lastAttackLanded,
          hitCount: 0,
          damage: 0
        };
        state.combo.moves.push(state.move); // Make sure we don't overwrite the START event

        if (!comboStarted) {
          state.event = ComboEvent.COMBO_EXTEND;
        }
      }

      if (state.move) {
        state.move.hitCount += 1;
        state.move.damage += opntDamageTaken;
      } // Store previous frame animation to consider the case of a trade, the previous
      // frame should always be the move that actually connected... I hope


      state.lastHitAnimation = prevPlayerFrame ? prevPlayerFrame.actionStateId : null;
    }

    if (comboStarted) {
      state.event = ComboEvent.COMBO_START;
    }
  }

  if (!state.combo) {
    // The rest of the function handles combo termination logic, so if we don't
    // have a combo started, there is no need to continue
    return;
  }

  const opntIsTeching = isTeching(oppActionStateId);
  const opntIsDowned = isDown(oppActionStateId);
  const opntDidLoseStock = prevOpponentFrame && didLoseStock(opponentFrame, prevOpponentFrame);
  const opntIsDying = isDead(oppActionStateId); // Update percent if opponent didn't lose stock

  if (!opntDidLoseStock) {
    var _opponentFrame$percen2;

    state.combo.currentPercent = (_opponentFrame$percen2 = opponentFrame.percent) != null ? _opponentFrame$percen2 : 0;
  }

  if (opntIsDamaged || opntIsGrabbed || opntIsCommandGrabbed || opntIsTeching || opntIsDowned || opntIsDying) {
    // If opponent got grabbed or damaged, reset the reset counter
    state.resetCounter = 0;
  } else {
    state.resetCounter += 1;
  }

  let shouldTerminate = false; // Termination condition 1 - player kills opponent

  if (opntDidLoseStock) {
    state.combo.didKill = true;
    shouldTerminate = true;
  } // Termination condition 2 - combo resets on time


  if (state.resetCounter > Timers.COMBO_STRING_RESET_FRAMES) {
    shouldTerminate = true;
  } // If combo should terminate, mark the end states and add it to list


  if (shouldTerminate) {
    var _prevOpponentFrame$pe2;

    state.combo.endFrame = playerFrame.frame;
    state.combo.endPercent = prevOpponentFrame ? (_prevOpponentFrame$pe2 = prevOpponentFrame.percent) != null ? _prevOpponentFrame$pe2 : 0 : 0;
    state.event = ComboEvent.COMBO_END;
    state.combo = null;
    state.move = null;
  }
}

export { ComboComputer, ComboEvent };
//# sourceMappingURL=combos.esm.js.map

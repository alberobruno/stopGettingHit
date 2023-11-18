import { Frames } from '../types.esm.js';
import { getSinglesPlayerPermutationsFromSettings } from './common.esm.js';

var JoystickRegion;

(function (JoystickRegion) {
  JoystickRegion[JoystickRegion["DZ"] = 0] = "DZ";
  JoystickRegion[JoystickRegion["NE"] = 1] = "NE";
  JoystickRegion[JoystickRegion["SE"] = 2] = "SE";
  JoystickRegion[JoystickRegion["SW"] = 3] = "SW";
  JoystickRegion[JoystickRegion["NW"] = 4] = "NW";
  JoystickRegion[JoystickRegion["N"] = 5] = "N";
  JoystickRegion[JoystickRegion["E"] = 6] = "E";
  JoystickRegion[JoystickRegion["S"] = 7] = "S";
  JoystickRegion[JoystickRegion["W"] = 8] = "W";
})(JoystickRegion || (JoystickRegion = {}));

class InputComputer {
  constructor() {
    this.state = new Map();
    this.playerPermutations = new Array();
  }

  setup(settings) {
    // Reset the state
    this.state = new Map();
    this.playerPermutations = getSinglesPlayerPermutationsFromSettings(settings);
    this.playerPermutations.forEach(indices => {
      const playerState = {
        playerIndex: indices.playerIndex,
        opponentIndex: indices.opponentIndex,
        inputCount: 0,
        joystickInputCount: 0,
        cstickInputCount: 0,
        buttonInputCount: 0,
        triggerInputCount: 0
      };
      this.state.set(indices, playerState);
    });
  }

  processFrame(frame, allFrames) {
    this.playerPermutations.forEach(indices => {
      const state = this.state.get(indices);

      if (state) {
        handleInputCompute(allFrames, state, indices, frame);
      }
    });
  }

  fetch() {
    return Array.from(this.state.values());
  }

}

function handleInputCompute(frames, state, indices, frame) {
  const playerFrame = frame.players[indices.playerIndex].pre;
  const currentFrameNumber = playerFrame.frame;
  const prevFrameNumber = currentFrameNumber - 1;
  const prevPlayerFrame = frames[prevFrameNumber] ? frames[prevFrameNumber].players[indices.playerIndex].pre : null;

  if (currentFrameNumber < Frames.FIRST_PLAYABLE || !prevPlayerFrame) {
    // Don't count inputs until the game actually starts
    return;
  } // First count the number of buttons that go from 0 to 1
  // Increment action count by amount of button presses


  const invertedPreviousButtons = ~prevPlayerFrame.physicalButtons;
  const currentButtons = playerFrame.physicalButtons;
  const buttonChanges = invertedPreviousButtons & currentButtons & 0xfff;
  const newInputsPressed = countSetBits(buttonChanges);
  state.inputCount += newInputsPressed;
  state.buttonInputCount += newInputsPressed; // Increment action count when sticks change from one region to another.
  // Don't increment when stick returns to deadzone

  const prevAnalogRegion = getJoystickRegion(prevPlayerFrame.joystickX, prevPlayerFrame.joystickY);
  const currentAnalogRegion = getJoystickRegion(playerFrame.joystickX, playerFrame.joystickY);

  if (prevAnalogRegion !== currentAnalogRegion && currentAnalogRegion !== JoystickRegion.DZ) {
    state.inputCount += 1;
    state.joystickInputCount += 1;
  } // Do the same for c-stick


  const prevCstickRegion = getJoystickRegion(prevPlayerFrame.cStickX, prevPlayerFrame.cStickY);
  const currentCstickRegion = getJoystickRegion(playerFrame.cStickX, playerFrame.cStickY);

  if (prevCstickRegion !== currentCstickRegion && currentCstickRegion !== JoystickRegion.DZ) {
    state.inputCount += 1;
    state.cstickInputCount += 1;
  } // Increment action on analog trigger... I'm not sure when. This needs revision
  // Currently will update input count when the button gets pressed past 0.3
  // Changes from hard shield to light shield should probably count as inputs but
  // are not counted here


  if (prevPlayerFrame.physicalLTrigger < 0.3 && playerFrame.physicalLTrigger >= 0.3) {
    state.inputCount += 1;
    state.triggerInputCount += 1;
  }

  if (prevPlayerFrame.physicalRTrigger < 0.3 && playerFrame.physicalRTrigger >= 0.3) {
    state.inputCount += 1;
    state.triggerInputCount += 1;
  }
}

function countSetBits(x) {
  // This function solves the Hamming Weight problem. Effectively it counts the number of
  // bits in the input that are set to 1
  // This implementation is supposedly very efficient when most bits are zero.
  // Found: https://en.wikipedia.org/wiki/Hamming_weight#Efficient_implementation
  let bits = x;
  let count;

  for (count = 0; bits; count += 1) {
    bits &= bits - 1;
  }

  return count;
}

function getJoystickRegion(x, y) {
  let region = JoystickRegion.DZ;

  if (x >= 0.2875 && y >= 0.2875) {
    region = JoystickRegion.NE;
  } else if (x >= 0.2875 && y <= -0.2875) {
    region = JoystickRegion.SE;
  } else if (x <= -0.2875 && y <= -0.2875) {
    region = JoystickRegion.SW;
  } else if (x <= -0.2875 && y >= 0.2875) {
    region = JoystickRegion.NW;
  } else if (y >= 0.2875) {
    region = JoystickRegion.N;
  } else if (x >= 0.2875) {
    region = JoystickRegion.E;
  } else if (y <= -0.2875) {
    region = JoystickRegion.S;
  } else if (x <= -0.2875) {
    region = JoystickRegion.W;
  }

  return region;
}

export { InputComputer };
//# sourceMappingURL=inputs.esm.js.map

var State;

(function (State) {
  // Animation ID ranges
  State[State["DAMAGE_START"] = 75] = "DAMAGE_START";
  State[State["DAMAGE_END"] = 91] = "DAMAGE_END";
  State[State["CAPTURE_START"] = 223] = "CAPTURE_START";
  State[State["CAPTURE_END"] = 232] = "CAPTURE_END";
  State[State["GUARD_START"] = 178] = "GUARD_START";
  State[State["GUARD_END"] = 182] = "GUARD_END";
  State[State["GROUNDED_CONTROL_START"] = 14] = "GROUNDED_CONTROL_START";
  State[State["GROUNDED_CONTROL_END"] = 24] = "GROUNDED_CONTROL_END";
  State[State["SQUAT_START"] = 39] = "SQUAT_START";
  State[State["SQUAT_END"] = 41] = "SQUAT_END";
  State[State["DOWN_START"] = 183] = "DOWN_START";
  State[State["DOWN_END"] = 198] = "DOWN_END";
  State[State["TECH_START"] = 199] = "TECH_START";
  State[State["TECH_END"] = 204] = "TECH_END";
  State[State["DYING_START"] = 0] = "DYING_START";
  State[State["DYING_END"] = 10] = "DYING_END";
  State[State["CONTROLLED_JUMP_START"] = 24] = "CONTROLLED_JUMP_START";
  State[State["CONTROLLED_JUMP_END"] = 34] = "CONTROLLED_JUMP_END";
  State[State["GROUND_ATTACK_START"] = 44] = "GROUND_ATTACK_START";
  State[State["GROUND_ATTACK_END"] = 64] = "GROUND_ATTACK_END";
  State[State["AERIAL_ATTACK_START"] = 65] = "AERIAL_ATTACK_START";
  State[State["AERIAL_ATTACK_END"] = 74] = "AERIAL_ATTACK_END";
  State[State["ATTACK_FTILT_START"] = 51] = "ATTACK_FTILT_START";
  State[State["ATTACK_FTILT_END"] = 55] = "ATTACK_FTILT_END";
  State[State["ATTACK_FSMASH_START"] = 58] = "ATTACK_FSMASH_START";
  State[State["ATTACK_FSMASH_END"] = 62] = "ATTACK_FSMASH_END"; // Animation ID specific

  State[State["ROLL_FORWARD"] = 233] = "ROLL_FORWARD";
  State[State["ROLL_BACKWARD"] = 234] = "ROLL_BACKWARD";
  State[State["SPOT_DODGE"] = 235] = "SPOT_DODGE";
  State[State["AIR_DODGE"] = 236] = "AIR_DODGE";
  State[State["ACTION_WAIT"] = 14] = "ACTION_WAIT";
  State[State["ACTION_DASH"] = 20] = "ACTION_DASH";
  State[State["ACTION_KNEE_BEND"] = 24] = "ACTION_KNEE_BEND";
  State[State["GUARD_ON"] = 178] = "GUARD_ON";
  State[State["TECH_MISS_UP"] = 183] = "TECH_MISS_UP";
  State[State["JAB_RESET_UP"] = 185] = "JAB_RESET_UP";
  State[State["TECH_MISS_DOWN"] = 191] = "TECH_MISS_DOWN";
  State[State["JAB_RESET_DOWN"] = 193] = "JAB_RESET_DOWN";
  State[State["NEUTRAL_TECH"] = 199] = "NEUTRAL_TECH";
  State[State["FORWARD_TECH"] = 200] = "FORWARD_TECH";
  State[State["BACKWARD_TECH"] = 201] = "BACKWARD_TECH";
  State[State["WALL_TECH"] = 202] = "WALL_TECH";
  State[State["MISSED_WALL_TECH"] = 247] = "MISSED_WALL_TECH";
  State[State["DASH"] = 20] = "DASH";
  State[State["TURN"] = 18] = "TURN";
  State[State["LANDING_FALL_SPECIAL"] = 43] = "LANDING_FALL_SPECIAL";
  State[State["JUMP_FORWARD"] = 25] = "JUMP_FORWARD";
  State[State["JUMP_BACKWARD"] = 26] = "JUMP_BACKWARD";
  State[State["FALL_FORWARD"] = 30] = "FALL_FORWARD";
  State[State["FALL_BACKWARD"] = 31] = "FALL_BACKWARD";
  State[State["GRAB"] = 212] = "GRAB";
  State[State["DASH_GRAB"] = 214] = "DASH_GRAB";
  State[State["GRAB_WAIT"] = 216] = "GRAB_WAIT";
  State[State["PUMMEL"] = 217] = "PUMMEL";
  State[State["CLIFF_CATCH"] = 252] = "CLIFF_CATCH";
  State[State["THROW_UP"] = 221] = "THROW_UP";
  State[State["THROW_FORWARD"] = 219] = "THROW_FORWARD";
  State[State["THROW_DOWN"] = 222] = "THROW_DOWN";
  State[State["THROW_BACK"] = 220] = "THROW_BACK";
  State[State["DAMAGE_FALL"] = 38] = "DAMAGE_FALL";
  State[State["ATTACK_JAB1"] = 44] = "ATTACK_JAB1";
  State[State["ATTACK_JAB2"] = 45] = "ATTACK_JAB2";
  State[State["ATTACK_JAB3"] = 46] = "ATTACK_JAB3";
  State[State["ATTACK_JABM"] = 47] = "ATTACK_JABM";
  State[State["ATTACK_DASH"] = 50] = "ATTACK_DASH";
  State[State["ATTACK_UTILT"] = 56] = "ATTACK_UTILT";
  State[State["ATTACK_DTILT"] = 57] = "ATTACK_DTILT";
  State[State["ATTACK_USMASH"] = 63] = "ATTACK_USMASH";
  State[State["ATTACK_DSMASH"] = 64] = "ATTACK_DSMASH";
  State[State["AERIAL_NAIR"] = 65] = "AERIAL_NAIR";
  State[State["AERIAL_FAIR"] = 66] = "AERIAL_FAIR";
  State[State["AERIAL_BAIR"] = 67] = "AERIAL_BAIR";
  State[State["AERIAL_UAIR"] = 68] = "AERIAL_UAIR";
  State[State["AERIAL_DAIR"] = 69] = "AERIAL_DAIR"; // Weird GnW IDs

  State[State["GNW_JAB1"] = 341] = "GNW_JAB1";
  State[State["GNW_JABM"] = 342] = "GNW_JABM";
  State[State["GNW_DTILT"] = 345] = "GNW_DTILT";
  State[State["GNW_FSMASH"] = 346] = "GNW_FSMASH";
  State[State["GNW_NAIR"] = 347] = "GNW_NAIR";
  State[State["GNW_BAIR"] = 348] = "GNW_BAIR";
  State[State["GNW_UAIR"] = 349] = "GNW_UAIR"; // Peach FSMASH ID
  // FSMASH1 = Golf Club, FSMASH2 = Frying Pan, FSMASH3 = Tennis Racket

  State[State["PEACH_FSMASH1"] = 349] = "PEACH_FSMASH1";
  State[State["PEACH_FSMASH2"] = 350] = "PEACH_FSMASH2";
  State[State["PEACH_FSMASH3"] = 351] = "PEACH_FSMASH3"; // Command Grabs

  State[State["BARREL_WAIT"] = 293] = "BARREL_WAIT";
  State[State["COMMAND_GRAB_RANGE1_START"] = 266] = "COMMAND_GRAB_RANGE1_START";
  State[State["COMMAND_GRAB_RANGE1_END"] = 304] = "COMMAND_GRAB_RANGE1_END";
  State[State["COMMAND_GRAB_RANGE2_START"] = 327] = "COMMAND_GRAB_RANGE2_START";
  State[State["COMMAND_GRAB_RANGE2_END"] = 338] = "COMMAND_GRAB_RANGE2_END";
})(State || (State = {}));

const Timers = {
  PUNISH_RESET_FRAMES: 45,
  RECOVERY_RESET_FRAMES: 45,
  COMBO_STRING_RESET_FRAMES: 45
};
function getSinglesPlayerPermutationsFromSettings(settings) {
  if (!settings || settings.players.length !== 2) {
    // Only return opponent indices for singles
    return [];
  }

  return [{
    playerIndex: settings.players[0].playerIndex,
    opponentIndex: settings.players[1].playerIndex
  }, {
    playerIndex: settings.players[1].playerIndex,
    opponentIndex: settings.players[0].playerIndex
  }];
}
function didLoseStock(frame, prevFrame) {
  if (!frame || !prevFrame) {
    return false;
  }

  return prevFrame.stocksRemaining - frame.stocksRemaining > 0;
}
function isInControl(state) {
  const ground = state >= State.GROUNDED_CONTROL_START && state <= State.GROUNDED_CONTROL_END;
  const squat = state >= State.SQUAT_START && state <= State.SQUAT_END;
  const groundAttack = state > State.GROUND_ATTACK_START && state <= State.GROUND_ATTACK_END;
  const isGrab = state === State.GRAB; // TODO: Add grounded b moves?

  return ground || squat || groundAttack || isGrab;
}
function isTeching(state) {
  return state >= State.TECH_START && state <= State.TECH_END;
}
function isDown(state) {
  return state >= State.DOWN_START && state <= State.DOWN_END;
}
function isDamaged(state) {
  return state >= State.DAMAGE_START && state <= State.DAMAGE_END || state === State.DAMAGE_FALL || state === State.JAB_RESET_UP || state === State.JAB_RESET_DOWN;
}
function isGrabbed(state) {
  return state >= State.CAPTURE_START && state <= State.CAPTURE_END;
} // TODO: Find better implementation of 3 seperate ranges

function isCommandGrabbed(state) {
  return (state >= State.COMMAND_GRAB_RANGE1_START && state <= State.COMMAND_GRAB_RANGE1_END || state >= State.COMMAND_GRAB_RANGE2_START && state <= State.COMMAND_GRAB_RANGE2_END) && state !== State.BARREL_WAIT;
}
function isDead(state) {
  return state >= State.DYING_START && state <= State.DYING_END;
}
function calcDamageTaken(frame, prevFrame) {
  var _frame$percent, _prevFrame$percent;

  const percent = (_frame$percent = frame.percent) != null ? _frame$percent : 0;
  const prevPercent = (_prevFrame$percent = prevFrame.percent) != null ? _prevFrame$percent : 0;
  return percent - prevPercent;
}

export { State, Timers, calcDamageTaken, didLoseStock, getSinglesPlayerPermutationsFromSettings, isCommandGrabbed, isDamaged, isDead, isDown, isGrabbed, isInControl, isTeching };
//# sourceMappingURL=common.esm.js.map

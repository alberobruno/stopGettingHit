import moveNames from './moves.esm.js';

const UnknownMove = {
  id: -1,
  name: "Unknown Move",
  shortName: "unknown"
};
function getMoveInfo(moveId) {
  const moveName = moveNames[moveId.toString()];

  if (!moveName) {
    return UnknownMove;
  }

  return {
    id: moveId,
    name: moveName.name,
    shortName: moveName.shortName
  };
}
function getMoveShortName(moveId) {
  const move = getMoveInfo(moveId);
  return move.shortName;
}
function getMoveName(moveId) {
  const move = getMoveInfo(moveId);
  return move.name;
}

export { UnknownMove, getMoveInfo, getMoveName, getMoveShortName };
//# sourceMappingURL=moveUtils.esm.js.map

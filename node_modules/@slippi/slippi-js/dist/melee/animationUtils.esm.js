// eslint-disable-next-line
function getDeathDirection(actionStateId) {
  if (actionStateId > 0xa) {
    return null;
  }

  switch (actionStateId) {
    case 0:
      return "down";

    case 1:
      return "left";

    case 2:
      return "right";

    default:
      return "up";
  }
}

export { getDeathDirection };
//# sourceMappingURL=animationUtils.esm.js.map

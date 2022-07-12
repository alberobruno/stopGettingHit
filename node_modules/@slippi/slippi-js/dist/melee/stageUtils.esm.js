import stageNames from './stages.esm.js';

const UnknownStage = {
  id: -1,
  name: "Unknown Stage"
};
function getStageInfo(stageId) {
  const stageName = stageNames[stageId.toString()];

  if (!stageName) {
    return UnknownStage;
  }

  return {
    id: stageId,
    name: stageName
  };
}
function getStageName(stageId) {
  const stage = getStageInfo(stageId);
  return stage.name;
}

export { UnknownStage, getStageInfo, getStageName };
//# sourceMappingURL=stageUtils.esm.js.map

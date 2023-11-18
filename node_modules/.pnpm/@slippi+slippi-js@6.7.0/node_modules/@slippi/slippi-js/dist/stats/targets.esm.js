import { GameMode, Frames } from '../types.esm.js';
import { exists } from '../utils/exists.esm.js';

const TARGET_ITEM_TYPE_ID = 209;
class TargetBreakComputer {
  constructor() {
    this.targetBreaks = new Array();
    this.isTargetTestGame = false;
  }

  setup(settings) {
    // Reset the state
    this.targetBreaks = [];
    this.isTargetTestGame = settings.gameMode === GameMode.TARGET_TEST;
  }

  processFrame(frame, allFrames) {
    if (!this.isTargetTestGame) {
      return;
    }

    handleTargetBreak(allFrames, frame, this.targetBreaks);
  }

  fetch() {
    return this.targetBreaks;
  }

}

function handleTargetBreak(frames, frame, targetBreaks) {
  var _frames$currentFrameN, _frames$currentFrameN2, _frames$currentFrameN3, _frames$prevFrameNumb, _frames$prevFrameNumb2, _frames$prevFrameNumb3;

  const currentFrameNumber = frame.frame;
  const prevFrameNumber = currentFrameNumber - 1; // Add all targets on the first frame

  if (currentFrameNumber === Frames.FIRST) {
    var _frames$Frames$FIRST$, _frames$Frames$FIRST, _frames$Frames$FIRST$2;

    const targets = (_frames$Frames$FIRST$ = (_frames$Frames$FIRST = frames[Frames.FIRST]) == null ? void 0 : (_frames$Frames$FIRST$2 = _frames$Frames$FIRST.items) == null ? void 0 : _frames$Frames$FIRST$2.filter(item => item.typeId === TARGET_ITEM_TYPE_ID)) != null ? _frames$Frames$FIRST$ : [];
    targets.forEach(target => {
      targetBreaks.push({
        spawnId: target.spawnId,
        frameDestroyed: null,
        positionX: target.positionX,
        positionY: target.positionY
      });
    });
  }

  const currentTargets = (_frames$currentFrameN = (_frames$currentFrameN2 = frames[currentFrameNumber]) == null ? void 0 : (_frames$currentFrameN3 = _frames$currentFrameN2.items) == null ? void 0 : _frames$currentFrameN3.filter(item => item.typeId === TARGET_ITEM_TYPE_ID)) != null ? _frames$currentFrameN : [];
  const previousTargets = (_frames$prevFrameNumb = (_frames$prevFrameNumb2 = frames[prevFrameNumber]) == null ? void 0 : (_frames$prevFrameNumb3 = _frames$prevFrameNumb2.items) == null ? void 0 : _frames$prevFrameNumb3.filter(item => item.typeId === TARGET_ITEM_TYPE_ID)) != null ? _frames$prevFrameNumb : [];
  const currentTargetIds = currentTargets.map(item => item.spawnId).filter(exists);
  const previousTargetIds = previousTargets.map(item => item.spawnId).filter(exists); // Check if any targets were destroyed

  const brokenTargetIds = previousTargetIds.filter(id => !currentTargetIds.includes(id));
  brokenTargetIds.forEach(id => {
    // Update the target break
    const targetBreak = targetBreaks.find(targetBreak => targetBreak.spawnId === id);

    if (targetBreak) {
      targetBreak.frameDestroyed = currentFrameNumber;
    }
  });
}

export { TargetBreakComputer };
//# sourceMappingURL=targets.esm.js.map

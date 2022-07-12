import type { FrameEntryType, RollbackFramesType } from "../types";
export declare class RollbackCounter {
    private rollbackFrames;
    private rollbackFrameCount;
    private rollbackPlayerIdx;
    private lastFrameWasRollback;
    private currentRollbackLength;
    private rollbackLengths;
    checkIfRollbackFrame(currentFrame: FrameEntryType | undefined, playerIdx: number): boolean | undefined;
    getFrames(): RollbackFramesType;
    getCount(): number;
    getLengths(): number[];
}
//# sourceMappingURL=rollbackCounter.d.ts.map
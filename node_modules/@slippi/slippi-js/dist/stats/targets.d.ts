import type { FrameEntryType, FramesType, GameStartType } from "../types";
import type { TargetBreakType } from "./common";
import type { StatComputer } from "./stats";
export declare class TargetBreakComputer implements StatComputer<TargetBreakType[]> {
    private targetBreaks;
    private isTargetTestGame;
    setup(settings: GameStartType): void;
    processFrame(frame: FrameEntryType, allFrames: FramesType): void;
    fetch(): TargetBreakType[];
}
//# sourceMappingURL=targets.d.ts.map
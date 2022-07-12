import type { FrameEntryType, GameStartType } from "../types";
import type { ActionCountsType } from "./common";
import type { StatComputer } from "./stats";
export declare class ActionsComputer implements StatComputer<ActionCountsType[]> {
    private playerPermutations;
    private state;
    setup(settings: GameStartType): void;
    processFrame(frame: FrameEntryType): void;
    fetch(): ActionCountsType[];
}
//# sourceMappingURL=actions.d.ts.map
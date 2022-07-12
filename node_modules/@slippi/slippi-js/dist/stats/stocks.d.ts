import type { FrameEntryType, FramesType, GameStartType } from "../types";
import type { StockType } from "./common";
import type { StatComputer } from "./stats";
export declare class StockComputer implements StatComputer<StockType[]> {
    private state;
    private playerPermutations;
    private stocks;
    setup(settings: GameStartType): void;
    processFrame(frame: FrameEntryType, allFrames: FramesType): void;
    fetch(): StockType[];
}
//# sourceMappingURL=stocks.d.ts.map
import type { FrameEntryType, FramesType, GameStartType } from "../types";
import type { StatComputer } from "./stats";
export interface PlayerInput {
    playerIndex: number;
    opponentIndex: number;
    inputCount: number;
    joystickInputCount: number;
    cstickInputCount: number;
    buttonInputCount: number;
    triggerInputCount: number;
}
export declare class InputComputer implements StatComputer<PlayerInput[]> {
    private state;
    private playerPermutations;
    setup(settings: GameStartType): void;
    processFrame(frame: FrameEntryType, allFrames: FramesType): void;
    fetch(): PlayerInput[];
}
//# sourceMappingURL=inputs.d.ts.map
/// <reference types="node" />
import { EventEmitter } from "events";
import type { EnabledItemType, FrameEntryType, FramesType, GameEndType, GameStartType, GeckoListType, RollbackFrames } from "../types";
import { Command } from "../types";
export declare const MAX_ROLLBACK_FRAMES = 7;
export declare enum SlpParserEvent {
    SETTINGS = "settings",
    END = "end",
    FRAME = "frame",
    FINALIZED_FRAME = "finalized-frame",
    ROLLBACK_FRAME = "rollback-frame"
}
declare const defaultSlpParserOptions: {
    strict: boolean;
};
export declare type SlpParserOptions = typeof defaultSlpParserOptions;
export declare class SlpParser extends EventEmitter {
    private frames;
    private rollbackCounter;
    private settings;
    private gameEnd;
    private latestFrameIndex;
    private settingsComplete;
    private lastFinalizedFrame;
    private options;
    private geckoList;
    constructor(options?: Partial<SlpParserOptions>);
    handleCommand(command: Command, payload: any): void;
    /**
     * Resets the parser state to their default values.
     */
    reset(): void;
    getLatestFrameNumber(): number;
    getPlayableFrameCount(): number;
    getLatestFrame(): FrameEntryType | null;
    getSettings(): GameStartType | null;
    getItems(): EnabledItemType[] | null;
    getGameEnd(): GameEndType | null;
    getFrames(): FramesType;
    getRollbackFrames(): RollbackFrames;
    getFrame(num: number): FrameEntryType | null;
    getGeckoList(): GeckoListType | null;
    private _handleGeckoList;
    private _handleGameEnd;
    private _handleGameStart;
    private _handleFrameStart;
    private _handlePostFrameUpdate;
    private _handleFrameUpdate;
    private _handleItemUpdate;
    private _handleFrameBookend;
    /**
     * Fires off the FINALIZED_FRAME event for frames up until a certain number
     * @param num The frame to finalize until
     */
    private _finalizeFrames;
    private _completeSettings;
}
export {};
//# sourceMappingURL=slpParser.d.ts.map
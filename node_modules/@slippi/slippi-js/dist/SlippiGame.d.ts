/// <reference types="node" />
import type { StadiumStatsType, StatOptions, StatsType } from "./stats";
import { Stats } from "./stats";
import type { EnabledItemType, FrameEntryType, FramesType, GameEndType, GameStartType, GeckoListType, MetadataType, PlacementType, RollbackFrames } from "./types";
/**
 * Slippi Game class that wraps a file
 */
export declare class SlippiGame {
    private input;
    private metadata;
    private finalStats;
    private parser;
    private readPosition;
    private actionsComputer;
    private conversionComputer;
    private comboComputer;
    private stockComputer;
    private inputComputer;
    private targetBreakComputer;
    protected statsComputer: Stats;
    constructor(input: string | Buffer | ArrayBuffer, opts?: StatOptions);
    private _process;
    /**
     * Gets the game settings, these are the settings that describe the starting state of
     * the game such as characters, stage, etc.
     */
    getSettings(): GameStartType | null;
    getItems(): EnabledItemType[] | null;
    getLatestFrame(): FrameEntryType | null;
    getGameEnd(options?: {
        skipProcessing?: boolean;
    }): GameEndType | null;
    getFrames(): FramesType;
    getRollbackFrames(): RollbackFrames;
    getGeckoList(): GeckoListType | null;
    getStats(): StatsType | null;
    getStadiumStats(): StadiumStatsType | null;
    getMetadata(): MetadataType | null;
    getFilePath(): string | null;
    getWinners(): PlacementType[];
}
//# sourceMappingURL=SlippiGame.d.ts.map
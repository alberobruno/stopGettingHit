import type { FrameEntryType, GameStartType } from "../types";
declare type HomeRunDistanceUnits = "feet" | "meters";
export declare function positionToHomeRunDistance(distance: number, units?: HomeRunDistanceUnits): number;
export declare function extractDistanceInfoFromFrame(settings: Pick<GameStartType, "language">, lastFrame: Pick<FrameEntryType, "players">): {
    distance: number;
    units: HomeRunDistanceUnits;
} | null;
export {};
//# sourceMappingURL=homeRunDistance.d.ts.map
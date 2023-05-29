export declare enum Command {
    SPLIT_MESSAGE = 16,
    MESSAGE_SIZES = 53,
    GAME_START = 54,
    PRE_FRAME_UPDATE = 55,
    POST_FRAME_UPDATE = 56,
    GAME_END = 57,
    FRAME_START = 58,
    ITEM_UPDATE = 59,
    FRAME_BOOKEND = 60,
    GECKO_LIST = 61
}
export interface PlayerType {
    playerIndex: number;
    port: number;
    characterId: number | null;
    type: number | null;
    startStocks: number | null;
    characterColor: number | null;
    teamShade: number | null;
    handicap: number | null;
    teamId: number | null;
    staminaMode: boolean | null;
    silentCharacter: boolean | null;
    invisible: boolean | null;
    lowGravity: boolean | null;
    blackStockIcon: boolean | null;
    metal: boolean | null;
    startOnAngelPlatform: boolean | null;
    rumbleEnabled: boolean | null;
    cpuLevel: number | null;
    offenseRatio: number | null;
    defenseRatio: number | null;
    modelScale: number | null;
    controllerFix: string | null;
    nametag: string | null;
    displayName: string;
    connectCode: string;
    userId: string;
}
export declare enum GameMode {
    VS = 2,
    ONLINE = 8,
    TARGET_TEST = 15,
    HOME_RUN_CONTEST = 32
}
export declare enum Language {
    JAPANESE = 0,
    ENGLISH = 1
}
export interface GameStartType {
    slpVersion: string | null;
    timerType: TimerType | null;
    inGameMode: number | null;
    friendlyFireEnabled: boolean | null;
    isTeams: boolean | null;
    stageId: number | null;
    startingTimerSeconds: number | null;
    itemSpawnBehavior: ItemSpawnType | null;
    enabledItems: number | null;
    players: PlayerType[];
    scene: number | null;
    gameMode: GameMode | null;
    language: Language | null;
    gameInfoBlock: GameInfoType | null;
    randomSeed: number | null;
    isPAL: boolean | null;
    isFrozenPS: boolean | null;
    matchInfo: MatchInfo | null;
}
interface MatchInfo {
    matchId: string | null;
    gameNumber: number | null;
    tiebreakerNumber: number | null;
}
export interface FrameStartType {
    frame: number | null;
    seed: number | null;
    sceneFrameCounter: number | null;
}
export interface GameInfoType {
    gameBitfield1: number | null;
    gameBitfield2: number | null;
    gameBitfield3: number | null;
    gameBitfield4: number | null;
    bombRainEnabled: boolean | null;
    selfDestructScoreValue: number | null;
    itemSpawnBitfield1: number | null;
    itemSpawnBitfield2: number | null;
    itemSpawnBitfield3: number | null;
    itemSpawnBitfield4: number | null;
    itemSpawnBitfield5: number | null;
    damageRatio: number | null;
}
export declare enum TimerType {
    NONE = 0,
    DECREASING = 2,
    INCREASING = 3
}
export declare enum ItemSpawnType {
    OFF = 255,
    VERY_LOW = 0,
    LOW = 1,
    MEDIUM = 2,
    HIGH = 3,
    VERY_HIGH = 4
}
export declare enum EnabledItemType {
    METAL_BOX = 1,
    CLOAKING_DEVICE = 2,
    POKEBALL = 4,
    UNKNOWN_ITEM_BIT_4 = 8,
    UNKNOWN_ITEM_BIT_5 = 16,
    UNKNOWN_ITEM_BIT_6 = 32,
    UNKNOWN_ITEM_BIT_7 = 64,
    UNKNOWN_ITEM_BIT_8 = 128,
    FAN = 256,
    FIRE_FLOWER = 512,
    SUPER_MUSHROOM = 1024,
    POISON_MUSHROOM = 2048,
    HAMMER = 4096,
    WARP_STAR = 8192,
    SCREW_ATTACK = 16384,
    BUNNY_HOOD = 32768,
    RAY_GUN = 65536,
    FREEZIE = 131072,
    FOOD = 262144,
    MOTION_SENSOR_BOMB = 524288,
    FLIPPER = 1048576,
    SUPER_SCOPE = 2097152,
    STAR_ROD = 4194304,
    LIPS_STICK = 8388608,
    HEART_CONTAINER = 16777216,
    MAXIM_TOMATO = 33554432,
    STARMAN = 67108864,
    HOME_RUN_BAT = 134217728,
    BEAM_SWORD = 268435456,
    PARASOL = 536870912,
    GREEN_SHELL = 1073741824,
    RED_SHELL = 2147483648,
    CAPSULE = 4294967296,
    BOX = 8589934592,
    BARREL = 17179869184,
    EGG = 34359738368,
    PARTY_BALL = 68719476736,
    BARREL_CANNON = 137438953472,
    BOMB_OMB = 274877906944,
    MR_SATURN = 549755813888
}
export interface PreFrameUpdateType {
    frame: number | null;
    playerIndex: number | null;
    isFollower: boolean | null;
    seed: number | null;
    actionStateId: number | null;
    positionX: number | null;
    positionY: number | null;
    facingDirection: number | null;
    joystickX: number | null;
    joystickY: number | null;
    cStickX: number | null;
    cStickY: number | null;
    trigger: number | null;
    buttons: number | null;
    physicalButtons: number | null;
    physicalLTrigger: number | null;
    physicalRTrigger: number | null;
    rawJoystickX: number | null;
    percent: number | null;
}
export interface PostFrameUpdateType {
    frame: number | null;
    playerIndex: number | null;
    isFollower: boolean | null;
    internalCharacterId: number | null;
    actionStateId: number | null;
    positionX: number | null;
    positionY: number | null;
    facingDirection: number | null;
    percent: number | null;
    shieldSize: number | null;
    lastAttackLanded: number | null;
    currentComboCount: number | null;
    lastHitBy: number | null;
    stocksRemaining: number | null;
    actionStateCounter: number | null;
    miscActionState: number | null;
    isAirborne: boolean | null;
    lastGroundId: number | null;
    jumpsRemaining: number | null;
    lCancelStatus: number | null;
    hurtboxCollisionState: number | null;
    selfInducedSpeeds: SelfInducedSpeedsType | null;
    hitlagRemaining: number | null;
    animationIndex: number | null;
}
export interface SelfInducedSpeedsType {
    airX: number | null;
    y: number | null;
    attackX: number | null;
    attackY: number | null;
    groundX: number | null;
}
export interface ItemUpdateType {
    frame: number | null;
    typeId: number | null;
    state: number | null;
    facingDirection: number | null;
    velocityX: number | null;
    velocityY: number | null;
    positionX: number | null;
    positionY: number | null;
    damageTaken: number | null;
    expirationTimer: number | null;
    spawnId: number | null;
    missileType: number | null;
    turnipFace: number | null;
    chargeShotLaunched: number | null;
    chargePower: number | null;
    owner: number | null;
}
export interface FrameBookendType {
    frame: number | null;
    latestFinalizedFrame: number | null;
}
export declare enum GameEndMethod {
    UNRESOLVED = 0,
    RESOLVED = 3,
    TIME = 1,
    GAME = 2,
    NO_CONTEST = 7
}
export interface GameEndType {
    gameEndMethod: GameEndMethod | null;
    lrasInitiatorIndex: number | null;
    placements: PlacementType[];
}
export interface PlacementType {
    playerIndex: number;
    position: number | null;
}
export interface GeckoListType {
    codes: GeckoCodeType[];
    contents: Uint8Array;
}
export interface GeckoCodeType {
    type: number | null;
    address: number | null;
    contents: Uint8Array;
}
export interface MetadataType {
    startAt?: string | null;
    playedOn?: string | null;
    lastFrame?: number | null;
    players?: {
        [playerIndex: number]: {
            characters: {
                [internalCharacterId: number]: number;
            };
            names?: {
                netplay?: string | null;
                code?: string | null;
            };
        };
    } | null;
    consoleNick?: string | null;
}
export declare type EventPayloadTypes = GameStartType | FrameStartType | PreFrameUpdateType | PostFrameUpdateType | ItemUpdateType | FrameBookendType | GameEndType | GeckoListType;
export declare type EventCallbackFunc = (command: Command, payload?: EventPayloadTypes | null, buffer?: Uint8Array | null) => boolean;
export interface FrameEntryType {
    frame: number;
    start?: FrameStartType;
    players: {
        [playerIndex: number]: {
            pre: PreFrameUpdateType;
            post: PostFrameUpdateType;
        } | null;
    };
    followers: {
        [playerIndex: number]: {
            pre: PreFrameUpdateType;
            post: PostFrameUpdateType;
        } | null;
    };
    items?: ItemUpdateType[];
}
export declare enum Frames {
    FIRST = -123,
    FIRST_PLAYABLE = -39
}
export interface FramesType {
    [frameIndex: number]: FrameEntryType;
}
export interface RollbackFramesType {
    [frameIndex: number]: FrameEntryType[];
}
export interface RollbackFrames {
    frames: RollbackFramesType;
    count: number;
    lengths: number[];
}
export {};
//# sourceMappingURL=types.d.ts.map
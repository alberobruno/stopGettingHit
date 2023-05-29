'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var lodash = require('lodash');
var events = require('events');
var dateFns = require('date-fns');
var fs = require('fs');
var stream = require('stream');
var ubjson = require('@shelacek/ubjson');
var net = require('net');
var inject = require('reconnect-core');
var iconv = require('iconv-lite');
var path = require('path');
var semver = require('semver');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n["default"] = e;
  return n;
}

var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var net__default = /*#__PURE__*/_interopDefaultLegacy(net);
var inject__default = /*#__PURE__*/_interopDefaultLegacy(inject);
var iconv__default = /*#__PURE__*/_interopDefaultLegacy(iconv);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var semver__default = /*#__PURE__*/_interopDefaultLegacy(semver);

// eslint-disable-next-line
function getDeathDirection(actionStateId) {
  if (actionStateId > 0xa) {
    return null;
  }

  switch (actionStateId) {
    case 0:
      return "down";

    case 1:
      return "left";

    case 2:
      return "right";

    default:
      return "up";
  }
}

var animationUtils = {
  __proto__: null,
  getDeathDirection: getDeathDirection
};

var characters = {
	"0": {
	name: "Captain Falcon",
	shortName: "Falcon",
	colors: [
		"Black",
		"Red",
		"White",
		"Green",
		"Blue"
	]
},
	"1": {
	name: "Donkey Kong",
	shortName: "DK",
	colors: [
		"Black",
		"Red",
		"Blue",
		"Green"
	]
},
	"2": {
	name: "Fox",
	colors: [
		"Red",
		"Blue",
		"Green"
	]
},
	"3": {
	name: "Mr. Game & Watch",
	shortName: "G&W",
	colors: [
		"Red",
		"Blue",
		"Green"
	]
},
	"4": {
	name: "Kirby",
	colors: [
		"Yellow",
		"Blue",
		"Red",
		"Green",
		"White"
	]
},
	"5": {
	name: "Bowser",
	colors: [
		"Red",
		"Blue",
		"Black"
	]
},
	"6": {
	name: "Link",
	colors: [
		"Red",
		"Blue",
		"Black",
		"White"
	]
},
	"7": {
	name: "Luigi",
	colors: [
		"White",
		"Blue",
		"Red"
	]
},
	"8": {
	name: "Mario",
	colors: [
		"Yellow",
		"Black",
		"Blue",
		"Green"
	]
},
	"9": {
	name: "Marth",
	colors: [
		"Red",
		"Green",
		"Black",
		"White"
	]
},
	"10": {
	name: "Mewtwo",
	colors: [
		"Red",
		"Blue",
		"Green"
	]
},
	"11": {
	name: "Ness",
	colors: [
		"Yellow",
		"Blue",
		"Green"
	]
},
	"12": {
	name: "Peach",
	colors: [
		"Daisy",
		"White",
		"Blue",
		"Green"
	]
},
	"13": {
	name: "Pikachu",
	colors: [
		"Red",
		"Party Hat",
		"Cowboy Hat"
	]
},
	"14": {
	name: "Ice Climbers",
	shortName: "ICs",
	colors: [
		"Green",
		"Orange",
		"Red"
	]
},
	"15": {
	name: "Jigglypuff",
	shortName: "Puff",
	colors: [
		"Red",
		"Blue",
		"Headband",
		"Crown"
	]
},
	"16": {
	name: "Samus",
	colors: [
		"Pink",
		"Black",
		"Green",
		"Purple"
	]
},
	"17": {
	name: "Yoshi",
	colors: [
		"Red",
		"Blue",
		"Yellow",
		"Pink",
		"Cyan"
	]
},
	"18": {
	name: "Zelda",
	colors: [
		"Red",
		"Blue",
		"Green",
		"White"
	]
},
	"19": {
	name: "Sheik",
	colors: [
		"Red",
		"Blue",
		"Green",
		"White"
	]
},
	"20": {
	name: "Falco",
	colors: [
		"Red",
		"Blue",
		"Green"
	]
},
	"21": {
	name: "Young Link",
	shortName: "YLink",
	colors: [
		"Red",
		"Blue",
		"White",
		"Black"
	]
},
	"22": {
	name: "Dr. Mario",
	shortName: "Doc",
	colors: [
		"Red",
		"Blue",
		"Green",
		"Black"
	]
},
	"23": {
	name: "Roy",
	colors: [
		"Red",
		"Blue",
		"Green",
		"Yellow"
	]
},
	"24": {
	name: "Pichu",
	colors: [
		"Red",
		"Blue",
		"Green"
	]
},
	"25": {
	name: "Ganondorf",
	shortName: "Ganon",
	colors: [
		"Red",
		"Blue",
		"Green",
		"Purple"
	]
},
	"26": {
	name: "Master Hand"
},
	"27": {
	name: "Wireframe (Male)"
},
	"28": {
	name: "Wireframe (Female)"
},
	"29": {
	name: "Gigabowser"
},
	"30": {
	name: "Crazy Hand"
},
	"31": {
	name: "Sandbag"
},
	"32": {
	name: "Popo"
}
};

const DEFAULT_COLOR = "Default";
const UnknownCharacter = {
  id: -1,
  name: "Unknown Character",
  shortName: "Unknown",
  colors: [DEFAULT_COLOR]
};

function generateCharacterInfo(id, info) {
  var _info$shortName, _info$colors;

  if (!info) {
    return UnknownCharacter;
  }

  return {
    id,
    name: info.name,
    shortName: (_info$shortName = info.shortName) != null ? _info$shortName : info.name,
    colors: [DEFAULT_COLOR, ...((_info$colors = info.colors) != null ? _info$colors : [])]
  };
}

function getAllCharacters() {
  return Object.entries(characters).map(([id, data]) => generateCharacterInfo(parseInt(id, 10), data)).sort((a, b) => a.id - b.id);
}
function getCharacterInfo(externalCharacterId) {
  const data = characters[externalCharacterId.toString()];
  return generateCharacterInfo(externalCharacterId, data);
}
function getCharacterShortName(externalCharacterId) {
  const character = getCharacterInfo(externalCharacterId);
  return character.shortName;
}
function getCharacterName(externalCharacterId) {
  const character = getCharacterInfo(externalCharacterId);
  return character.name;
} // Return a human-readable color from a characterCode.

function getCharacterColorName(externalCharacterId, characterColor) {
  const character = getCharacterInfo(externalCharacterId);
  const color = character.colors[characterColor];

  if (color) {
    return color;
  }

  return DEFAULT_COLOR;
}

var characterUtils = {
  __proto__: null,
  UnknownCharacter: UnknownCharacter,
  getAllCharacters: getAllCharacters,
  getCharacterInfo: getCharacterInfo,
  getCharacterShortName: getCharacterShortName,
  getCharacterName: getCharacterName,
  getCharacterColorName: getCharacterColorName
};

var moveNames = {
	"1": {
	name: "Miscellaneous",
	shortName: "misc"
},
	"2": {
	name: "Jab",
	shortName: "jab"
},
	"3": {
	name: "Jab",
	shortName: "jab"
},
	"4": {
	name: "Jab",
	shortName: "jab"
},
	"5": {
	name: "Rapid Jabs",
	shortName: "rapid-jabs"
},
	"6": {
	name: "Dash Attack",
	shortName: "dash"
},
	"7": {
	name: "Forward Tilt",
	shortName: "ftilt"
},
	"8": {
	name: "Up Tilt",
	shortName: "utilt"
},
	"9": {
	name: "Down Tilt",
	shortName: "dtilt"
},
	"10": {
	name: "Forward Smash",
	shortName: "fsmash"
},
	"11": {
	name: "Up Smash",
	shortName: "usmash"
},
	"12": {
	name: "Down Smash",
	shortName: "dsmash"
},
	"13": {
	name: "Neutral Air",
	shortName: "nair"
},
	"14": {
	name: "Forward Air",
	shortName: "fair"
},
	"15": {
	name: "Back Air",
	shortName: "bair"
},
	"16": {
	name: "Up Air",
	shortName: "uair"
},
	"17": {
	name: "Down Air",
	shortName: "dair"
},
	"18": {
	name: "Neutral B",
	shortName: "neutral-b"
},
	"19": {
	name: "Side B",
	shortName: "side-b"
},
	"20": {
	name: "Up B",
	shortName: "up-b"
},
	"21": {
	name: "Down B",
	shortName: "down-b"
},
	"50": {
	name: "Getup Attack",
	shortName: "getup"
},
	"51": {
	name: "Getup Attack (Slow)",
	shortName: "getup-slow"
},
	"52": {
	name: "Grab Pummel",
	shortName: "pummel"
},
	"53": {
	name: "Forward Throw",
	shortName: "fthrow"
},
	"54": {
	name: "Back Throw",
	shortName: "bthrow"
},
	"55": {
	name: "Up Throw",
	shortName: "uthrow"
},
	"56": {
	name: "Down Throw",
	shortName: "dthrow"
},
	"61": {
	name: "Edge Attack (Slow)",
	shortName: "edge-slow"
},
	"62": {
	name: "Edge Attack",
	shortName: "edge"
}
};

const UnknownMove = {
  id: -1,
  name: "Unknown Move",
  shortName: "unknown"
};
function getMoveInfo(moveId) {
  const moveName = moveNames[moveId.toString()];

  if (!moveName) {
    return UnknownMove;
  }

  return {
    id: moveId,
    name: moveName.name,
    shortName: moveName.shortName
  };
}
function getMoveShortName(moveId) {
  const move = getMoveInfo(moveId);
  return move.shortName;
}
function getMoveName(moveId) {
  const move = getMoveInfo(moveId);
  return move.name;
}

var moveUtils = {
  __proto__: null,
  UnknownMove: UnknownMove,
  getMoveInfo: getMoveInfo,
  getMoveShortName: getMoveShortName,
  getMoveName: getMoveName
};

var stageNames = {
	"2": "Fountain of Dreams",
	"3": "Pokémon Stadium",
	"4": "Princess Peach's Castle",
	"5": "Kongo Jungle",
	"6": "Brinstar",
	"7": "Corneria",
	"8": "Yoshi's Story",
	"9": "Onett",
	"10": "Mute City",
	"11": "Rainbow Cruise",
	"12": "Jungle Japes",
	"13": "Great Bay",
	"14": "Hyrule Temple",
	"15": "Brinstar Depths",
	"16": "Yoshi's Island",
	"17": "Green Greens",
	"18": "Fourside",
	"19": "Mushroom Kingdom I",
	"20": "Mushroom Kingdom II",
	"22": "Venom",
	"23": "Poké Floats",
	"24": "Big Blue",
	"25": "Icicle Mountain",
	"26": "Icetop",
	"27": "Flat Zone",
	"28": "Dream Land N64",
	"29": "Yoshi's Island N64",
	"30": "Kongo Jungle N64",
	"31": "Battlefield",
	"32": "Final Destination",
	"33": "Target Test (Mario)",
	"34": "Target Test (Captain Falcon)",
	"35": "Target Test (Young Link)",
	"36": "Target Test (Donkey Kong)",
	"37": "Target Test (Dr. Mario)",
	"38": "Target Test (Falco)",
	"39": "Target Test (Fox)",
	"40": "Target Test (Ice Climbers)",
	"41": "Target Test (Kirby)",
	"42": "Target Test (Bowser)",
	"43": "Target Test (Link)",
	"44": "Target Test (Luigi)",
	"45": "Target Test (Marth)",
	"46": "Target Test (Mewtwo)",
	"47": "Target Test (Ness)",
	"48": "Target Test (Peach)",
	"49": "Target Test (Pichu)",
	"50": "Target Test (Pikachu)",
	"51": "Target Test (Jigglypuff)",
	"52": "Target Test (Samus)",
	"53": "Target Test (Sheik)",
	"54": "Target Test (Yoshi)",
	"55": "Target Test (Zelda)",
	"56": "Target Test (Mr. Game & Watch)",
	"57": "Target Test (Roy)",
	"58": "Target Test (Ganondorf)",
	"84": "Home-Run Contest"
};

const UnknownStage = {
  id: -1,
  name: "Unknown Stage"
};
function getStageInfo(stageId) {
  const stageName = stageNames[stageId.toString()];

  if (!stageName) {
    return UnknownStage;
  }

  return {
    id: stageId,
    name: stageName
  };
}
function getStageName(stageId) {
  const stage = getStageInfo(stageId);
  return stage.name;
}

var stageUtils = {
  __proto__: null,
  UnknownStage: UnknownStage,
  getStageInfo: getStageInfo,
  getStageName: getStageName
};

exports.Character = void 0;

(function (Character) {
  Character[Character["CAPTAIN_FALCON"] = 0] = "CAPTAIN_FALCON";
  Character[Character["DONKEY_KONG"] = 1] = "DONKEY_KONG";
  Character[Character["FOX"] = 2] = "FOX";
  Character[Character["GAME_AND_WATCH"] = 3] = "GAME_AND_WATCH";
  Character[Character["KIRBY"] = 4] = "KIRBY";
  Character[Character["BOWSER"] = 5] = "BOWSER";
  Character[Character["LINK"] = 6] = "LINK";
  Character[Character["LUIGI"] = 7] = "LUIGI";
  Character[Character["MARIO"] = 8] = "MARIO";
  Character[Character["MARTH"] = 9] = "MARTH";
  Character[Character["MEWTWO"] = 10] = "MEWTWO";
  Character[Character["NESS"] = 11] = "NESS";
  Character[Character["PEACH"] = 12] = "PEACH";
  Character[Character["PIKACHU"] = 13] = "PIKACHU";
  Character[Character["ICE_CLIMBERS"] = 14] = "ICE_CLIMBERS";
  Character[Character["JIGGLYPUFF"] = 15] = "JIGGLYPUFF";
  Character[Character["SAMUS"] = 16] = "SAMUS";
  Character[Character["YOSHI"] = 17] = "YOSHI";
  Character[Character["ZELDA"] = 18] = "ZELDA";
  Character[Character["SHEIK"] = 19] = "SHEIK";
  Character[Character["FALCO"] = 20] = "FALCO";
  Character[Character["YOUNG_LINK"] = 21] = "YOUNG_LINK";
  Character[Character["DR_MARIO"] = 22] = "DR_MARIO";
  Character[Character["ROY"] = 23] = "ROY";
  Character[Character["PICHU"] = 24] = "PICHU";
  Character[Character["GANONDORF"] = 25] = "GANONDORF";
  Character[Character["MASTER_HAND"] = 26] = "MASTER_HAND";
  Character[Character["WIREFRAME_MALE"] = 27] = "WIREFRAME_MALE";
  Character[Character["WIREFRAME_FEMALE"] = 28] = "WIREFRAME_FEMALE";
  Character[Character["GIGA_BOWSER"] = 29] = "GIGA_BOWSER";
  Character[Character["CRAZY_HAND"] = 30] = "CRAZY_HAND";
  Character[Character["SANDBAG"] = 31] = "SANDBAG";
  Character[Character["POPO"] = 32] = "POPO";
})(exports.Character || (exports.Character = {}));

exports.Stage = void 0;

(function (Stage) {
  Stage[Stage["FOUNTAIN_OF_DREAMS"] = 2] = "FOUNTAIN_OF_DREAMS";
  Stage[Stage["POKEMON_STADIUM"] = 3] = "POKEMON_STADIUM";
  Stage[Stage["PEACHS_CASTLE"] = 4] = "PEACHS_CASTLE";
  Stage[Stage["KONGO_JUNGLE"] = 5] = "KONGO_JUNGLE";
  Stage[Stage["BRINSTAR"] = 6] = "BRINSTAR";
  Stage[Stage["CORNERIA"] = 7] = "CORNERIA";
  Stage[Stage["YOSHIS_STORY"] = 8] = "YOSHIS_STORY";
  Stage[Stage["ONETT"] = 9] = "ONETT";
  Stage[Stage["MUTE_CITY"] = 10] = "MUTE_CITY";
  Stage[Stage["RAINBOW_CRUISE"] = 11] = "RAINBOW_CRUISE";
  Stage[Stage["JUNGLE_JAPES"] = 12] = "JUNGLE_JAPES";
  Stage[Stage["GREAT_BAY"] = 13] = "GREAT_BAY";
  Stage[Stage["HYRULE_TEMPLE"] = 14] = "HYRULE_TEMPLE";
  Stage[Stage["BRINSTAR_DEPTHS"] = 15] = "BRINSTAR_DEPTHS";
  Stage[Stage["YOSHIS_ISLAND"] = 16] = "YOSHIS_ISLAND";
  Stage[Stage["GREEN_GREENS"] = 17] = "GREEN_GREENS";
  Stage[Stage["FOURSIDE"] = 18] = "FOURSIDE";
  Stage[Stage["MUSHROOM_KINGDOM"] = 19] = "MUSHROOM_KINGDOM";
  Stage[Stage["MUSHROOM_KINGDOM_2"] = 20] = "MUSHROOM_KINGDOM_2";
  Stage[Stage["VENOM"] = 22] = "VENOM";
  Stage[Stage["POKE_FLOATS"] = 23] = "POKE_FLOATS";
  Stage[Stage["BIG_BLUE"] = 24] = "BIG_BLUE";
  Stage[Stage["ICICLE_MOUNTAIN"] = 25] = "ICICLE_MOUNTAIN";
  Stage[Stage["ICETOP"] = 26] = "ICETOP";
  Stage[Stage["FLAT_ZONE"] = 27] = "FLAT_ZONE";
  Stage[Stage["DREAMLAND"] = 28] = "DREAMLAND";
  Stage[Stage["YOSHIS_ISLAND_N64"] = 29] = "YOSHIS_ISLAND_N64";
  Stage[Stage["KONGO_JUNGLE_N64"] = 30] = "KONGO_JUNGLE_N64";
  Stage[Stage["BATTLEFIELD"] = 31] = "BATTLEFIELD";
  Stage[Stage["FINAL_DESTINATION"] = 32] = "FINAL_DESTINATION";
  Stage[Stage["TARGET_TEST_MARIO"] = 33] = "TARGET_TEST_MARIO";
  Stage[Stage["TARGET_TEST_CAPTAIN_FALCON"] = 34] = "TARGET_TEST_CAPTAIN_FALCON";
  Stage[Stage["TARGET_TEST_YOUNG_LINK"] = 35] = "TARGET_TEST_YOUNG_LINK";
  Stage[Stage["TARGET_TEST_DONKEY_KONG"] = 36] = "TARGET_TEST_DONKEY_KONG";
  Stage[Stage["TARGET_TEST_DR_MARIO"] = 37] = "TARGET_TEST_DR_MARIO";
  Stage[Stage["TARGET_TEST_FALCO"] = 38] = "TARGET_TEST_FALCO";
  Stage[Stage["TARGET_TEST_FOX"] = 39] = "TARGET_TEST_FOX";
  Stage[Stage["TARGET_TEST_ICE_CLIMBERS"] = 40] = "TARGET_TEST_ICE_CLIMBERS";
  Stage[Stage["TARGET_TEST_KIRBY"] = 41] = "TARGET_TEST_KIRBY";
  Stage[Stage["TARGET_TEST_BOWSER"] = 42] = "TARGET_TEST_BOWSER";
  Stage[Stage["TARGET_TEST_LINK"] = 43] = "TARGET_TEST_LINK";
  Stage[Stage["TARGET_TEST_LUIGI"] = 44] = "TARGET_TEST_LUIGI";
  Stage[Stage["TARGET_TEST_MARTH"] = 45] = "TARGET_TEST_MARTH";
  Stage[Stage["TARGET_TEST_MEWTWO"] = 46] = "TARGET_TEST_MEWTWO";
  Stage[Stage["TARGET_TEST_NESS"] = 47] = "TARGET_TEST_NESS";
  Stage[Stage["TARGET_TEST_PEACH"] = 48] = "TARGET_TEST_PEACH";
  Stage[Stage["TARGET_TEST_PICHU"] = 49] = "TARGET_TEST_PICHU";
  Stage[Stage["TARGET_TEST_PIKACHU"] = 50] = "TARGET_TEST_PIKACHU";
  Stage[Stage["TARGET_TEST_JIGGLYPUFF"] = 51] = "TARGET_TEST_JIGGLYPUFF";
  Stage[Stage["TARGET_TEST_SAMUS"] = 52] = "TARGET_TEST_SAMUS";
  Stage[Stage["TARGET_TEST_SHEIK"] = 53] = "TARGET_TEST_SHEIK";
  Stage[Stage["TARGET_TEST_YOSHI"] = 54] = "TARGET_TEST_YOSHI";
  Stage[Stage["TARGET_TEST_ZELDA"] = 55] = "TARGET_TEST_ZELDA";
  Stage[Stage["TARGET_TEST_GAME_AND_WATCH"] = 56] = "TARGET_TEST_GAME_AND_WATCH";
  Stage[Stage["TARGET_TEST_ROY"] = 57] = "TARGET_TEST_ROY";
  Stage[Stage["TARGET_TEST_GANONDORF"] = 58] = "TARGET_TEST_GANONDORF";
  Stage[Stage["RACE_TO_THE_FINISH"] = 82] = "RACE_TO_THE_FINISH";
  Stage[Stage["GRAB_THE_TROPHIES"] = 83] = "GRAB_THE_TROPHIES";
  Stage[Stage["HOME_RUN_CONTEST"] = 84] = "HOME_RUN_CONTEST";
  Stage[Stage["ALL_STAR_LOBBY"] = 85] = "ALL_STAR_LOBBY";
  Stage[Stage["EVENT_ONE"] = 202] = "EVENT_ONE";
  Stage[Stage["EVENT_EIGHTEEN"] = 203] = "EVENT_EIGHTEEN";
  Stage[Stage["EVENT_THREE"] = 204] = "EVENT_THREE";
  Stage[Stage["EVENT_FOUR"] = 205] = "EVENT_FOUR";
  Stage[Stage["EVENT_FIVE"] = 206] = "EVENT_FIVE";
  Stage[Stage["EVENT_SIX"] = 207] = "EVENT_SIX";
  Stage[Stage["EVENT_SEVEN"] = 208] = "EVENT_SEVEN";
  Stage[Stage["EVENT_EIGHT"] = 209] = "EVENT_EIGHT";
  Stage[Stage["EVENT_NINE"] = 210] = "EVENT_NINE";
  Stage[Stage["EVENT_TEN_PART_ONE"] = 211] = "EVENT_TEN_PART_ONE";
  Stage[Stage["EVENT_ELEVEN"] = 212] = "EVENT_ELEVEN";
  Stage[Stage["EVENT_TWELVE"] = 213] = "EVENT_TWELVE";
  Stage[Stage["EVENT_THIRTEEN"] = 214] = "EVENT_THIRTEEN";
  Stage[Stage["EVENT_FOURTEEN"] = 215] = "EVENT_FOURTEEN";
  Stage[Stage["EVENT_THIRTY_SEVEN"] = 216] = "EVENT_THIRTY_SEVEN";
  Stage[Stage["EVENT_SIXTEEN"] = 217] = "EVENT_SIXTEEN";
  Stage[Stage["EVENT_SEVENTEEN"] = 218] = "EVENT_SEVENTEEN";
  Stage[Stage["EVENT_TWO"] = 219] = "EVENT_TWO";
  Stage[Stage["EVENT_NINETEEN"] = 220] = "EVENT_NINETEEN";
  Stage[Stage["EVENT_TWENTY_PART_ONE"] = 221] = "EVENT_TWENTY_PART_ONE";
  Stage[Stage["EVENT_TWENTY_ONE"] = 222] = "EVENT_TWENTY_ONE";
  Stage[Stage["EVENT_TWENTY_TWO"] = 223] = "EVENT_TWENTY_TWO";
  Stage[Stage["EVENT_TWENTY_SEVEN"] = 224] = "EVENT_TWENTY_SEVEN";
  Stage[Stage["EVENT_TWENTY_FOUR"] = 225] = "EVENT_TWENTY_FOUR";
  Stage[Stage["EVENT_TWENTY_FIVE"] = 226] = "EVENT_TWENTY_FIVE";
  Stage[Stage["EVENT_TWENTY_SIX"] = 227] = "EVENT_TWENTY_SIX";
  Stage[Stage["EVENT_TWENTY_THREE"] = 228] = "EVENT_TWENTY_THREE";
  Stage[Stage["EVENT_TWENTY_EIGHT"] = 229] = "EVENT_TWENTY_EIGHT";
  Stage[Stage["EVENT_TWENTY_NINE"] = 230] = "EVENT_TWENTY_NINE";
  Stage[Stage["EVENT_THIRTY_PART_ONE"] = 231] = "EVENT_THIRTY_PART_ONE";
  Stage[Stage["EVENT_THIRTY_ONE"] = 232] = "EVENT_THIRTY_ONE";
  Stage[Stage["EVENT_THIRTY_TWO"] = 233] = "EVENT_THIRTY_TWO";
  Stage[Stage["EVENT_THIRTY_THREE"] = 234] = "EVENT_THIRTY_THREE";
  Stage[Stage["EVENT_THIRTY_FOUR"] = 235] = "EVENT_THIRTY_FOUR";
  Stage[Stage["EVENT_FORTY_EIGHT"] = 236] = "EVENT_FORTY_EIGHT";
  Stage[Stage["EVENT_THIRTY_SIX_PART_ONE"] = 237] = "EVENT_THIRTY_SIX_PART_ONE";
  Stage[Stage["EVENT_FIFTEEN"] = 238] = "EVENT_FIFTEEN";
  Stage[Stage["EVENT_THIRTY_EIGHT"] = 239] = "EVENT_THIRTY_EIGHT";
  Stage[Stage["EVENT_THIRTY_NINE"] = 240] = "EVENT_THIRTY_NINE";
  Stage[Stage["EVENT_FORTY_PART_ONE"] = 241] = "EVENT_FORTY_PART_ONE";
  Stage[Stage["EVENT_FORTY_ONE"] = 242] = "EVENT_FORTY_ONE";
  Stage[Stage["EVENT_FORTY_TWO"] = 243] = "EVENT_FORTY_TWO";
  Stage[Stage["EVENT_FORTY_THREE"] = 244] = "EVENT_FORTY_THREE";
  Stage[Stage["EVENT_FORTY_FOUR"] = 245] = "EVENT_FORTY_FOUR";
  Stage[Stage["EVENT_FORTY_FIVE"] = 246] = "EVENT_FORTY_FIVE";
  Stage[Stage["EVENT_FORTY_SIX"] = 247] = "EVENT_FORTY_SIX";
  Stage[Stage["EVENT_FORTY_SEVEN"] = 248] = "EVENT_FORTY_SEVEN";
  Stage[Stage["EVENT_THIRTY_FIVE"] = 249] = "EVENT_THIRTY_FIVE";
  Stage[Stage["EVENT_FORTY_NINE_PART_ONE"] = 250] = "EVENT_FORTY_NINE_PART_ONE";
  Stage[Stage["EVENT_FIFTY"] = 251] = "EVENT_FIFTY";
  Stage[Stage["EVENT_FIFTY_ONE"] = 252] = "EVENT_FIFTY_ONE";
  Stage[Stage["EVENT_TEN_PART_TWO"] = 253] = "EVENT_TEN_PART_TWO";
  Stage[Stage["EVENT_TEN_PART_THREE"] = 254] = "EVENT_TEN_PART_THREE";
  Stage[Stage["EVENT_TEN_PART_FOUR"] = 255] = "EVENT_TEN_PART_FOUR";
  Stage[Stage["EVENT_TEN_PART_FIVE"] = 256] = "EVENT_TEN_PART_FIVE";
  Stage[Stage["EVENT_TWENTY_PART_TWO"] = 257] = "EVENT_TWENTY_PART_TWO";
  Stage[Stage["EVENT_TWENTY_PART_THREE"] = 258] = "EVENT_TWENTY_PART_THREE";
  Stage[Stage["EVENT_TWENTY_PART_FOUR"] = 259] = "EVENT_TWENTY_PART_FOUR";
  Stage[Stage["EVENT_TWENTY_PART_FIVE"] = 260] = "EVENT_TWENTY_PART_FIVE";
  Stage[Stage["EVENT_THIRTY_PART_TWO"] = 261] = "EVENT_THIRTY_PART_TWO";
  Stage[Stage["EVENT_THIRTY_PART_THREE"] = 262] = "EVENT_THIRTY_PART_THREE";
  Stage[Stage["EVENT_THIRTY_PART_FOUR"] = 263] = "EVENT_THIRTY_PART_FOUR";
  Stage[Stage["EVENT_FORTY_PART_TWO"] = 264] = "EVENT_FORTY_PART_TWO";
  Stage[Stage["EVENT_FORTY_PART_THREE"] = 265] = "EVENT_FORTY_PART_THREE";
  Stage[Stage["EVENT_FORTY_PART_FOUR"] = 266] = "EVENT_FORTY_PART_FOUR";
  Stage[Stage["EVENT_FORTY_PART_FIVE"] = 267] = "EVENT_FORTY_PART_FIVE";
  Stage[Stage["EVENT_FORTY_NINE_PART_TWO"] = 268] = "EVENT_FORTY_NINE_PART_TWO";
  Stage[Stage["EVENT_FORTY_NINE_PART_THREE"] = 269] = "EVENT_FORTY_NINE_PART_THREE";
  Stage[Stage["EVENT_FORTY_NINE_PART_FOUR"] = 270] = "EVENT_FORTY_NINE_PART_FOUR";
  Stage[Stage["EVENT_FORTY_NINE_PART_FIVE"] = 271] = "EVENT_FORTY_NINE_PART_FIVE";
  Stage[Stage["EVENT_FORTY_NINE_PART_SIX"] = 272] = "EVENT_FORTY_NINE_PART_SIX";
  Stage[Stage["EVENT_THIRTY_SIX_PART_TWO"] = 273] = "EVENT_THIRTY_SIX_PART_TWO";
  Stage[Stage["MULTI_MAN_MELEE"] = 285] = "MULTI_MAN_MELEE";
})(exports.Stage || (exports.Stage = {}));

exports.State = void 0;

(function (State) {
  // Animation ID ranges
  State[State["DAMAGE_START"] = 75] = "DAMAGE_START";
  State[State["DAMAGE_END"] = 91] = "DAMAGE_END";
  State[State["CAPTURE_START"] = 223] = "CAPTURE_START";
  State[State["CAPTURE_END"] = 232] = "CAPTURE_END";
  State[State["GUARD_START"] = 178] = "GUARD_START";
  State[State["GUARD_END"] = 182] = "GUARD_END";
  State[State["GROUNDED_CONTROL_START"] = 14] = "GROUNDED_CONTROL_START";
  State[State["GROUNDED_CONTROL_END"] = 24] = "GROUNDED_CONTROL_END";
  State[State["SQUAT_START"] = 39] = "SQUAT_START";
  State[State["SQUAT_END"] = 41] = "SQUAT_END";
  State[State["DOWN_START"] = 183] = "DOWN_START";
  State[State["DOWN_END"] = 198] = "DOWN_END";
  State[State["TECH_START"] = 199] = "TECH_START";
  State[State["TECH_END"] = 204] = "TECH_END";
  State[State["DYING_START"] = 0] = "DYING_START";
  State[State["DYING_END"] = 10] = "DYING_END";
  State[State["CONTROLLED_JUMP_START"] = 24] = "CONTROLLED_JUMP_START";
  State[State["CONTROLLED_JUMP_END"] = 34] = "CONTROLLED_JUMP_END";
  State[State["GROUND_ATTACK_START"] = 44] = "GROUND_ATTACK_START";
  State[State["GROUND_ATTACK_END"] = 64] = "GROUND_ATTACK_END";
  State[State["AERIAL_ATTACK_START"] = 65] = "AERIAL_ATTACK_START";
  State[State["AERIAL_ATTACK_END"] = 74] = "AERIAL_ATTACK_END";
  State[State["ATTACK_FTILT_START"] = 51] = "ATTACK_FTILT_START";
  State[State["ATTACK_FTILT_END"] = 55] = "ATTACK_FTILT_END";
  State[State["ATTACK_FSMASH_START"] = 58] = "ATTACK_FSMASH_START";
  State[State["ATTACK_FSMASH_END"] = 62] = "ATTACK_FSMASH_END"; // Animation ID specific

  State[State["ROLL_FORWARD"] = 233] = "ROLL_FORWARD";
  State[State["ROLL_BACKWARD"] = 234] = "ROLL_BACKWARD";
  State[State["SPOT_DODGE"] = 235] = "SPOT_DODGE";
  State[State["AIR_DODGE"] = 236] = "AIR_DODGE";
  State[State["ACTION_WAIT"] = 14] = "ACTION_WAIT";
  State[State["ACTION_DASH"] = 20] = "ACTION_DASH";
  State[State["ACTION_KNEE_BEND"] = 24] = "ACTION_KNEE_BEND";
  State[State["GUARD_ON"] = 178] = "GUARD_ON";
  State[State["TECH_MISS_UP"] = 183] = "TECH_MISS_UP";
  State[State["JAB_RESET_UP"] = 185] = "JAB_RESET_UP";
  State[State["TECH_MISS_DOWN"] = 191] = "TECH_MISS_DOWN";
  State[State["JAB_RESET_DOWN"] = 193] = "JAB_RESET_DOWN";
  State[State["NEUTRAL_TECH"] = 199] = "NEUTRAL_TECH";
  State[State["FORWARD_TECH"] = 200] = "FORWARD_TECH";
  State[State["BACKWARD_TECH"] = 201] = "BACKWARD_TECH";
  State[State["WALL_TECH"] = 202] = "WALL_TECH";
  State[State["MISSED_WALL_TECH"] = 247] = "MISSED_WALL_TECH";
  State[State["DASH"] = 20] = "DASH";
  State[State["TURN"] = 18] = "TURN";
  State[State["LANDING_FALL_SPECIAL"] = 43] = "LANDING_FALL_SPECIAL";
  State[State["JUMP_FORWARD"] = 25] = "JUMP_FORWARD";
  State[State["JUMP_BACKWARD"] = 26] = "JUMP_BACKWARD";
  State[State["FALL_FORWARD"] = 30] = "FALL_FORWARD";
  State[State["FALL_BACKWARD"] = 31] = "FALL_BACKWARD";
  State[State["GRAB"] = 212] = "GRAB";
  State[State["DASH_GRAB"] = 214] = "DASH_GRAB";
  State[State["GRAB_WAIT"] = 216] = "GRAB_WAIT";
  State[State["PUMMEL"] = 217] = "PUMMEL";
  State[State["CLIFF_CATCH"] = 252] = "CLIFF_CATCH";
  State[State["THROW_UP"] = 221] = "THROW_UP";
  State[State["THROW_FORWARD"] = 219] = "THROW_FORWARD";
  State[State["THROW_DOWN"] = 222] = "THROW_DOWN";
  State[State["THROW_BACK"] = 220] = "THROW_BACK";
  State[State["DAMAGE_FALL"] = 38] = "DAMAGE_FALL";
  State[State["ATTACK_JAB1"] = 44] = "ATTACK_JAB1";
  State[State["ATTACK_JAB2"] = 45] = "ATTACK_JAB2";
  State[State["ATTACK_JAB3"] = 46] = "ATTACK_JAB3";
  State[State["ATTACK_JABM"] = 47] = "ATTACK_JABM";
  State[State["ATTACK_DASH"] = 50] = "ATTACK_DASH";
  State[State["ATTACK_UTILT"] = 56] = "ATTACK_UTILT";
  State[State["ATTACK_DTILT"] = 57] = "ATTACK_DTILT";
  State[State["ATTACK_USMASH"] = 63] = "ATTACK_USMASH";
  State[State["ATTACK_DSMASH"] = 64] = "ATTACK_DSMASH";
  State[State["AERIAL_NAIR"] = 65] = "AERIAL_NAIR";
  State[State["AERIAL_FAIR"] = 66] = "AERIAL_FAIR";
  State[State["AERIAL_BAIR"] = 67] = "AERIAL_BAIR";
  State[State["AERIAL_UAIR"] = 68] = "AERIAL_UAIR";
  State[State["AERIAL_DAIR"] = 69] = "AERIAL_DAIR"; // Weird GnW IDs

  State[State["GNW_JAB1"] = 341] = "GNW_JAB1";
  State[State["GNW_JABM"] = 342] = "GNW_JABM";
  State[State["GNW_DTILT"] = 345] = "GNW_DTILT";
  State[State["GNW_FSMASH"] = 346] = "GNW_FSMASH";
  State[State["GNW_NAIR"] = 347] = "GNW_NAIR";
  State[State["GNW_BAIR"] = 348] = "GNW_BAIR";
  State[State["GNW_UAIR"] = 349] = "GNW_UAIR"; // Peach FSMASH ID
  // FSMASH1 = Golf Club, FSMASH2 = Frying Pan, FSMASH3 = Tennis Racket

  State[State["PEACH_FSMASH1"] = 349] = "PEACH_FSMASH1";
  State[State["PEACH_FSMASH2"] = 350] = "PEACH_FSMASH2";
  State[State["PEACH_FSMASH3"] = 351] = "PEACH_FSMASH3"; // Command Grabs

  State[State["BARREL_WAIT"] = 293] = "BARREL_WAIT";
  State[State["COMMAND_GRAB_RANGE1_START"] = 266] = "COMMAND_GRAB_RANGE1_START";
  State[State["COMMAND_GRAB_RANGE1_END"] = 304] = "COMMAND_GRAB_RANGE1_END";
  State[State["COMMAND_GRAB_RANGE2_START"] = 327] = "COMMAND_GRAB_RANGE2_START";
  State[State["COMMAND_GRAB_RANGE2_END"] = 338] = "COMMAND_GRAB_RANGE2_END";
})(exports.State || (exports.State = {}));

const Timers = {
  PUNISH_RESET_FRAMES: 45,
  RECOVERY_RESET_FRAMES: 45,
  COMBO_STRING_RESET_FRAMES: 45
};
function getSinglesPlayerPermutationsFromSettings(settings) {
  if (!settings || settings.players.length !== 2) {
    // Only return opponent indices for singles
    return [];
  }

  return [{
    playerIndex: settings.players[0].playerIndex,
    opponentIndex: settings.players[1].playerIndex
  }, {
    playerIndex: settings.players[1].playerIndex,
    opponentIndex: settings.players[0].playerIndex
  }];
}
function didLoseStock(frame, prevFrame) {
  if (!frame || !prevFrame) {
    return false;
  }

  return prevFrame.stocksRemaining - frame.stocksRemaining > 0;
}
function isInControl(state) {
  const ground = state >= exports.State.GROUNDED_CONTROL_START && state <= exports.State.GROUNDED_CONTROL_END;
  const squat = state >= exports.State.SQUAT_START && state <= exports.State.SQUAT_END;
  const groundAttack = state > exports.State.GROUND_ATTACK_START && state <= exports.State.GROUND_ATTACK_END;
  const isGrab = state === exports.State.GRAB; // TODO: Add grounded b moves?

  return ground || squat || groundAttack || isGrab;
}
function isTeching(state) {
  return state >= exports.State.TECH_START && state <= exports.State.TECH_END;
}
function isDown(state) {
  return state >= exports.State.DOWN_START && state <= exports.State.DOWN_END;
}
function isDamaged(state) {
  return state >= exports.State.DAMAGE_START && state <= exports.State.DAMAGE_END || state === exports.State.DAMAGE_FALL || state === exports.State.JAB_RESET_UP || state === exports.State.JAB_RESET_DOWN;
}
function isGrabbed(state) {
  return state >= exports.State.CAPTURE_START && state <= exports.State.CAPTURE_END;
} // TODO: Find better implementation of 3 seperate ranges

function isCommandGrabbed(state) {
  return (state >= exports.State.COMMAND_GRAB_RANGE1_START && state <= exports.State.COMMAND_GRAB_RANGE1_END || state >= exports.State.COMMAND_GRAB_RANGE2_START && state <= exports.State.COMMAND_GRAB_RANGE2_END) && state !== exports.State.BARREL_WAIT;
}
function isDead(state) {
  return state >= exports.State.DYING_START && state <= exports.State.DYING_END;
}
function calcDamageTaken(frame, prevFrame) {
  var _frame$percent, _prevFrame$percent;

  const percent = (_frame$percent = frame.percent) != null ? _frame$percent : 0;
  const prevPercent = (_prevFrame$percent = prevFrame.percent) != null ? _prevFrame$percent : 0;
  return percent - prevPercent;
}

const dashDanceAnimations = [exports.State.DASH, exports.State.TURN, exports.State.DASH];
class ActionsComputer {
  constructor() {
    this.playerPermutations = new Array();
    this.state = new Map();
  }

  setup(settings) {
    this.state = new Map();
    this.playerPermutations = getSinglesPlayerPermutationsFromSettings(settings);
    this.playerPermutations.forEach(indices => {
      const playerCounts = {
        playerIndex: indices.playerIndex,
        wavedashCount: 0,
        wavelandCount: 0,
        airDodgeCount: 0,
        dashDanceCount: 0,
        spotDodgeCount: 0,
        ledgegrabCount: 0,
        rollCount: 0,
        lCancelCount: {
          success: 0,
          fail: 0
        },
        attackCount: {
          jab1: 0,
          jab2: 0,
          jab3: 0,
          jabm: 0,
          dash: 0,
          ftilt: 0,
          utilt: 0,
          dtilt: 0,
          fsmash: 0,
          usmash: 0,
          dsmash: 0,
          nair: 0,
          fair: 0,
          bair: 0,
          uair: 0,
          dair: 0
        },
        grabCount: {
          success: 0,
          fail: 0
        },
        throwCount: {
          up: 0,
          forward: 0,
          back: 0,
          down: 0
        },
        groundTechCount: {
          // tech away/in are in reference to the opponents position and not the stage
          away: 0,
          in: 0,
          neutral: 0,
          fail: 0
        },
        wallTechCount: {
          success: 0,
          fail: 0
        }
      };
      const playerState = {
        playerCounts: playerCounts,
        animations: [],
        actionFrameCounters: []
      };
      this.state.set(indices, playerState);
    });
  }

  processFrame(frame) {
    this.playerPermutations.forEach(indices => {
      const state = this.state.get(indices);

      if (state) {
        handleActionCompute(state, indices, frame);
      }
    });
  }

  fetch() {
    return Array.from(this.state.values()).map(val => val.playerCounts);
  }

}

function isMissGroundTech(animation) {
  return animation === exports.State.TECH_MISS_DOWN || animation === exports.State.TECH_MISS_UP;
}

function isRolling(animation) {
  return animation === exports.State.ROLL_BACKWARD || animation === exports.State.ROLL_FORWARD;
}

function isGrabAction(animation) {
  // Includes Grab pull, wait, pummel, and throws
  return animation > exports.State.GRAB && animation <= exports.State.THROW_DOWN && animation !== exports.State.DASH_GRAB;
}

function isGrabbing(animation) {
  return animation === exports.State.GRAB || animation === exports.State.DASH_GRAB;
}

function isAerialAttack(animation) {
  return animation >= exports.State.AERIAL_ATTACK_START && animation <= exports.State.AERIAL_ATTACK_END;
}

function isForwardTilt(animation) {
  return animation >= exports.State.ATTACK_FTILT_START && animation <= exports.State.ATTACK_FTILT_END;
}

function isForwardSmash(animation) {
  return animation >= exports.State.ATTACK_FSMASH_START && animation <= exports.State.ATTACK_FSMASH_END;
}

function handleActionCompute(state, indices, frame) {
  const playerFrame = frame.players[indices.playerIndex].post;
  const opponentFrame = frame.players[indices.opponentIndex].post;

  const incrementCount = (field, condition) => {
    if (!condition) {
      return;
    }

    const current = lodash.get(state.playerCounts, field, 0);
    lodash.set(state.playerCounts, field, current + 1);
  }; // Manage animation state


  const currentAnimation = playerFrame.actionStateId;
  state.animations.push(currentAnimation);
  const currentFrameCounter = playerFrame.actionStateCounter;
  state.actionFrameCounters.push(currentFrameCounter); // Grab last 3 frames

  const last3Frames = state.animations.slice(-3);
  const prevAnimation = last3Frames[last3Frames.length - 2];
  const prevFrameCounter = state.actionFrameCounters[state.actionFrameCounters.length - 2]; // New action if new animation or frame counter goes back down (repeated action)

  const isNewAction = currentAnimation !== prevAnimation || prevFrameCounter > currentFrameCounter;

  if (!isNewAction) {
    return;
  } // Increment counts based on conditions


  const didDashDance = lodash.isEqual(last3Frames, dashDanceAnimations);
  incrementCount("dashDanceCount", didDashDance);
  incrementCount("rollCount", isRolling(currentAnimation));
  incrementCount("spotDodgeCount", currentAnimation === exports.State.SPOT_DODGE);
  incrementCount("airDodgeCount", currentAnimation === exports.State.AIR_DODGE);
  incrementCount("ledgegrabCount", currentAnimation === exports.State.CLIFF_CATCH); // Grabs

  incrementCount("grabCount.success", isGrabbing(prevAnimation) && isGrabAction(currentAnimation));
  incrementCount("grabCount.fail", isGrabbing(prevAnimation) && !isGrabAction(currentAnimation));

  if (currentAnimation === exports.State.DASH_GRAB && prevAnimation === exports.State.ATTACK_DASH) {
    state.playerCounts.attackCount.dash -= 1; // subtract from dash attack if boost grab
  } // Basic attacks


  incrementCount("attackCount.jab1", currentAnimation === exports.State.ATTACK_JAB1);
  incrementCount("attackCount.jab2", currentAnimation === exports.State.ATTACK_JAB2);
  incrementCount("attackCount.jab3", currentAnimation === exports.State.ATTACK_JAB3);
  incrementCount("attackCount.jabm", currentAnimation === exports.State.ATTACK_JABM);
  incrementCount("attackCount.dash", currentAnimation === exports.State.ATTACK_DASH);
  incrementCount("attackCount.ftilt", isForwardTilt(currentAnimation));
  incrementCount("attackCount.utilt", currentAnimation === exports.State.ATTACK_UTILT);
  incrementCount("attackCount.dtilt", currentAnimation === exports.State.ATTACK_DTILT);
  incrementCount("attackCount.fsmash", isForwardSmash(currentAnimation));
  incrementCount("attackCount.usmash", currentAnimation === exports.State.ATTACK_USMASH);
  incrementCount("attackCount.dsmash", currentAnimation === exports.State.ATTACK_DSMASH);
  incrementCount("attackCount.nair", currentAnimation === exports.State.AERIAL_NAIR);
  incrementCount("attackCount.fair", currentAnimation === exports.State.AERIAL_FAIR);
  incrementCount("attackCount.bair", currentAnimation === exports.State.AERIAL_BAIR);
  incrementCount("attackCount.uair", currentAnimation === exports.State.AERIAL_UAIR);
  incrementCount("attackCount.dair", currentAnimation === exports.State.AERIAL_DAIR); // GnW is weird and has unique IDs for some moves

  if (playerFrame.internalCharacterId === 0x18) {
    incrementCount("attackCount.jab1", currentAnimation === exports.State.GNW_JAB1);
    incrementCount("attackCount.jabm", currentAnimation === exports.State.GNW_JABM);
    incrementCount("attackCount.dtilt", currentAnimation === exports.State.GNW_DTILT);
    incrementCount("attackCount.fsmash", currentAnimation === exports.State.GNW_FSMASH);
    incrementCount("attackCount.nair", currentAnimation === exports.State.GNW_NAIR);
    incrementCount("attackCount.bair", currentAnimation === exports.State.GNW_BAIR);
    incrementCount("attackCount.uair", currentAnimation === exports.State.GNW_UAIR);
  } // Peach is also weird and has a unique ID for her fsmash
  // FSMASH1 = Golf Club, FSMASH2 = Frying Pan, FSMASH3 = Tennis Racket


  if (playerFrame.internalCharacterId === 0x09) {
    incrementCount("attackCount.fsmash", currentAnimation === exports.State.PEACH_FSMASH1);
    incrementCount("attackCount.fsmash", currentAnimation === exports.State.PEACH_FSMASH2);
    incrementCount("attackCount.fsmash", currentAnimation === exports.State.PEACH_FSMASH3);
  } // Throws


  incrementCount("throwCount.up", currentAnimation === exports.State.THROW_UP);
  incrementCount("throwCount.forward", currentAnimation === exports.State.THROW_FORWARD);
  incrementCount("throwCount.down", currentAnimation === exports.State.THROW_DOWN);
  incrementCount("throwCount.back", currentAnimation === exports.State.THROW_BACK); // Techs

  const opponentDir = playerFrame.positionX > opponentFrame.positionX ? -1 : 1;
  const facingOpponent = playerFrame.facingDirection === opponentDir;
  incrementCount("groundTechCount.fail", isMissGroundTech(currentAnimation));
  incrementCount("groundTechCount.in", currentAnimation === exports.State.FORWARD_TECH && facingOpponent);
  incrementCount("groundTechCount.in", currentAnimation === exports.State.BACKWARD_TECH && !facingOpponent);
  incrementCount("groundTechCount.neutral", currentAnimation === exports.State.NEUTRAL_TECH);
  incrementCount("groundTechCount.away", currentAnimation === exports.State.BACKWARD_TECH && facingOpponent);
  incrementCount("groundTechCount.away", currentAnimation === exports.State.FORWARD_TECH && !facingOpponent);
  incrementCount("wallTechCount.success", currentAnimation === exports.State.WALL_TECH);
  incrementCount("wallTechCount.fail", currentAnimation === exports.State.MISSED_WALL_TECH);

  if (isAerialAttack(currentAnimation)) {
    incrementCount("lCancelCount.success", playerFrame.lCancelStatus === 1);
    incrementCount("lCancelCount.fail", playerFrame.lCancelStatus === 2);
  } // Handles wavedash detection (and waveland)


  handleActionWavedash(state.playerCounts, state.animations);
}

function handleActionWavedash(counts, animations) {
  const currentAnimation = lodash.last(animations);
  const prevAnimation = animations[animations.length - 2];
  const isSpecialLanding = currentAnimation === exports.State.LANDING_FALL_SPECIAL;
  const isAcceptablePrevious = isWavedashInitiationAnimation(prevAnimation);
  const isPossibleWavedash = isSpecialLanding && isAcceptablePrevious;

  if (!isPossibleWavedash) {
    return;
  } // Here we special landed, it might be a wavedash, let's check
  // We grab the last 8 frames here because that should be enough time to execute a
  // wavedash. This number could be tweaked if we find false negatives


  const recentFrames = animations.slice(-8);
  const recentAnimations = lodash.keyBy(recentFrames, animation => animation);

  if (lodash.size(recentAnimations) === 2 && recentAnimations[exports.State.AIR_DODGE]) {
    // If the only other animation is air dodge, this might be really late to the point
    // where it was actually an air dodge. Air dodge animation is really long
    return;
  }

  if (recentAnimations[exports.State.AIR_DODGE]) {
    // If one of the recent animations was an air dodge, let's remove that from the
    // air dodge counter, we don't want to count air dodges used to wavedash/land
    counts.airDodgeCount -= 1;
  }

  if (recentAnimations[exports.State.ACTION_KNEE_BEND]) {
    // If a jump was started recently, we will consider this a wavedash
    counts.wavedashCount += 1;
  } else {
    // If there was no jump recently, this is a waveland
    counts.wavelandCount += 1;
  }
}

function isWavedashInitiationAnimation(animation) {
  if (animation === exports.State.AIR_DODGE) {
    return true;
  }

  const isAboveMin = animation >= exports.State.CONTROLLED_JUMP_START;
  const isBelowMax = animation <= exports.State.CONTROLLED_JUMP_END;
  return isAboveMin && isBelowMax;
}

var ComboEvent;

(function (ComboEvent) {
  ComboEvent["COMBO_START"] = "COMBO_START";
  ComboEvent["COMBO_EXTEND"] = "COMBO_EXTEND";
  ComboEvent["COMBO_END"] = "COMBO_END";
})(ComboEvent || (ComboEvent = {}));

class ComboComputer extends events.EventEmitter {
  constructor(...args) {
    super(...args);
    this.playerPermutations = new Array();
    this.state = new Map();
    this.combos = new Array();
    this.settings = null;
  }

  setup(settings) {
    // Reset the state
    this.settings = settings;
    this.state = new Map();
    this.combos = [];
    this.playerPermutations = getSinglesPlayerPermutationsFromSettings(settings);
    this.playerPermutations.forEach(indices => {
      const playerState = {
        combo: null,
        move: null,
        resetCounter: 0,
        lastHitAnimation: null,
        event: null
      };
      this.state.set(indices, playerState);
    });
  }

  processFrame(frame, allFrames) {
    this.playerPermutations.forEach(indices => {
      const state = this.state.get(indices);

      if (state) {
        handleComboCompute(allFrames, state, indices, frame, this.combos); // Emit an event for the new combo

        if (state.event !== null) {
          this.emit(state.event, {
            combo: lodash.last(this.combos),
            settings: this.settings
          });
          state.event = null;
        }
      }
    });
  }

  fetch() {
    return this.combos;
  }

}

function handleComboCompute(frames, state, indices, frame, combos) {
  const currentFrameNumber = frame.frame;
  const playerFrame = frame.players[indices.playerIndex].post;
  const opponentFrame = frame.players[indices.opponentIndex].post;
  const prevFrameNumber = currentFrameNumber - 1;
  let prevPlayerFrame = null;
  let prevOpponentFrame = null;

  if (frames[prevFrameNumber]) {
    prevPlayerFrame = frames[prevFrameNumber].players[indices.playerIndex].post;
    prevOpponentFrame = frames[prevFrameNumber].players[indices.opponentIndex].post;
  }

  const oppActionStateId = opponentFrame.actionStateId;
  const opntIsDamaged = isDamaged(oppActionStateId);
  const opntIsGrabbed = isGrabbed(oppActionStateId);
  const opntIsCommandGrabbed = isCommandGrabbed(oppActionStateId);
  const opntDamageTaken = prevOpponentFrame ? calcDamageTaken(opponentFrame, prevOpponentFrame) : 0; // Keep track of whether actionState changes after a hit. Used to compute move count
  // When purely using action state there was a bug where if you did two of the same
  // move really fast (such as ganon's jab), it would count as one move. Added
  // the actionStateCounter at this point which counts the number of frames since
  // an animation started. Should be more robust, for old files it should always be
  // null and null < null = false

  const actionChangedSinceHit = playerFrame.actionStateId !== state.lastHitAnimation;
  const actionCounter = playerFrame.actionStateCounter;
  const prevActionCounter = prevPlayerFrame ? prevPlayerFrame.actionStateCounter : 0;
  const actionFrameCounterReset = actionCounter < prevActionCounter;

  if (actionChangedSinceHit || actionFrameCounterReset) {
    state.lastHitAnimation = null;
  } // If opponent took damage and was put in some kind of stun this frame, either
  // start a combo or count the moves for the existing combo


  if (opntIsDamaged || opntIsGrabbed || opntIsCommandGrabbed) {
    let comboStarted = false;

    if (!state.combo) {
      var _prevOpponentFrame$pe, _opponentFrame$percen;

      state.combo = {
        playerIndex: indices.opponentIndex,
        startFrame: currentFrameNumber,
        endFrame: null,
        startPercent: prevOpponentFrame ? (_prevOpponentFrame$pe = prevOpponentFrame.percent) != null ? _prevOpponentFrame$pe : 0 : 0,
        currentPercent: (_opponentFrame$percen = opponentFrame.percent) != null ? _opponentFrame$percen : 0,
        endPercent: null,
        moves: [],
        didKill: false,
        lastHitBy: indices.playerIndex
      };
      combos.push(state.combo); // Track whether this is a new combo or not

      comboStarted = true;
    }

    if (opntDamageTaken) {
      // If animation of last hit has been cleared that means this is a new move. This
      // prevents counting multiple hits from the same move such as fox's drill
      if (state.lastHitAnimation === null) {
        state.move = {
          playerIndex: indices.playerIndex,
          frame: currentFrameNumber,
          moveId: playerFrame.lastAttackLanded,
          hitCount: 0,
          damage: 0
        };
        state.combo.moves.push(state.move); // Make sure we don't overwrite the START event

        if (!comboStarted) {
          state.event = ComboEvent.COMBO_EXTEND;
        }
      }

      if (state.move) {
        state.move.hitCount += 1;
        state.move.damage += opntDamageTaken;
      } // Store previous frame animation to consider the case of a trade, the previous
      // frame should always be the move that actually connected... I hope


      state.lastHitAnimation = prevPlayerFrame ? prevPlayerFrame.actionStateId : null;
    }

    if (comboStarted) {
      state.event = ComboEvent.COMBO_START;
    }
  }

  if (!state.combo) {
    // The rest of the function handles combo termination logic, so if we don't
    // have a combo started, there is no need to continue
    return;
  }

  const opntIsTeching = isTeching(oppActionStateId);
  const opntIsDowned = isDown(oppActionStateId);
  const opntDidLoseStock = prevOpponentFrame && didLoseStock(opponentFrame, prevOpponentFrame);
  const opntIsDying = isDead(oppActionStateId); // Update percent if opponent didn't lose stock

  if (!opntDidLoseStock) {
    var _opponentFrame$percen2;

    state.combo.currentPercent = (_opponentFrame$percen2 = opponentFrame.percent) != null ? _opponentFrame$percen2 : 0;
  }

  if (opntIsDamaged || opntIsGrabbed || opntIsCommandGrabbed || opntIsTeching || opntIsDowned || opntIsDying) {
    // If opponent got grabbed or damaged, reset the reset counter
    state.resetCounter = 0;
  } else {
    state.resetCounter += 1;
  }

  let shouldTerminate = false; // Termination condition 1 - player kills opponent

  if (opntDidLoseStock) {
    state.combo.didKill = true;
    shouldTerminate = true;
  } // Termination condition 2 - combo resets on time


  if (state.resetCounter > Timers.COMBO_STRING_RESET_FRAMES) {
    shouldTerminate = true;
  } // If combo should terminate, mark the end states and add it to list


  if (shouldTerminate) {
    var _prevOpponentFrame$pe2;

    state.combo.endFrame = playerFrame.frame;
    state.combo.endPercent = prevOpponentFrame ? (_prevOpponentFrame$pe2 = prevOpponentFrame.percent) != null ? _prevOpponentFrame$pe2 : 0 : 0;
    state.event = ComboEvent.COMBO_END;
    state.combo = null;
    state.move = null;
  }
}

class ConversionComputer extends events.EventEmitter {
  constructor() {
    super();
    this.playerPermutations = new Array();
    this.conversions = new Array();
    this.state = new Map();
    this.metadata = void 0;
    this.settings = null;
    this.metadata = {
      lastEndFrameByOppIdx: {}
    };
  }

  setup(settings) {
    // Reset the state
    this.playerPermutations = getSinglesPlayerPermutationsFromSettings(settings);
    this.conversions = [];
    this.state = new Map();
    this.metadata = {
      lastEndFrameByOppIdx: {}
    };
    this.settings = settings;
    this.playerPermutations.forEach(indices => {
      const playerState = {
        conversion: null,
        move: null,
        resetCounter: 0,
        lastHitAnimation: null
      };
      this.state.set(indices, playerState);
    });
  }

  processFrame(frame, allFrames) {
    this.playerPermutations.forEach(indices => {
      const state = this.state.get(indices);

      if (state) {
        const terminated = handleConversionCompute(allFrames, state, indices, frame, this.conversions);

        if (terminated) {
          this.emit("CONVERSION", {
            combo: lodash.last(this.conversions),
            settings: this.settings
          });
        }
      }
    });
  }

  fetch() {
    this._populateConversionTypes();

    return this.conversions;
  }

  _populateConversionTypes() {
    // Post-processing step: set the openingTypes
    const conversionsToHandle = lodash.filter(this.conversions, conversion => {
      return conversion.openingType === "unknown";
    }); // Group new conversions by startTime and sort

    const groupedConversions = lodash.groupBy(conversionsToHandle, "startFrame");
    const sortedConversions = lodash.orderBy(groupedConversions, conversions => lodash.get(conversions, [0, "startFrame"])); // Set the opening types on the conversions we need to handle

    sortedConversions.forEach(conversions => {
      const isTrade = conversions.length >= 2;
      conversions.forEach(conversion => {
        // Set end frame for this conversion
        this.metadata.lastEndFrameByOppIdx[conversion.playerIndex] = conversion.endFrame;

        if (isTrade) {
          // If trade, just short-circuit
          conversion.openingType = "trade";
          return;
        } // If not trade, check the opponent endFrame


        const lastMove = lodash.last(conversion.moves);
        const oppEndFrame = this.metadata.lastEndFrameByOppIdx[lastMove ? lastMove.playerIndex : conversion.playerIndex];
        const isCounterAttack = oppEndFrame && oppEndFrame > conversion.startFrame;
        conversion.openingType = isCounterAttack ? "counter-attack" : "neutral-win";
      });
    });
  }

}

function handleConversionCompute(frames, state, indices, frame, conversions) {
  const currentFrameNumber = frame.frame;
  const playerFrame = frame.players[indices.playerIndex].post;
  const opponentFrame = frame.players[indices.opponentIndex].post;
  const prevFrameNumber = currentFrameNumber - 1;
  let prevPlayerFrame = null;
  let prevOpponentFrame = null;

  if (frames[prevFrameNumber]) {
    prevPlayerFrame = frames[prevFrameNumber].players[indices.playerIndex].post;
    prevOpponentFrame = frames[prevFrameNumber].players[indices.opponentIndex].post;
  }

  const oppActionStateId = opponentFrame.actionStateId;
  const opntIsDamaged = isDamaged(oppActionStateId);
  const opntIsGrabbed = isGrabbed(oppActionStateId);
  const opntIsCommandGrabbed = isCommandGrabbed(oppActionStateId);
  const opntDamageTaken = prevOpponentFrame ? calcDamageTaken(opponentFrame, prevOpponentFrame) : 0; // Keep track of whether actionState changes after a hit. Used to compute move count
  // When purely using action state there was a bug where if you did two of the same
  // move really fast (such as ganon's jab), it would count as one move. Added
  // the actionStateCounter at this point which counts the number of frames since
  // an animation started. Should be more robust, for old files it should always be
  // null and null < null = false

  const actionChangedSinceHit = playerFrame.actionStateId !== state.lastHitAnimation;
  const actionCounter = playerFrame.actionStateCounter;
  const prevActionCounter = prevPlayerFrame ? prevPlayerFrame.actionStateCounter : 0;
  const actionFrameCounterReset = actionCounter < prevActionCounter;

  if (actionChangedSinceHit || actionFrameCounterReset) {
    state.lastHitAnimation = null;
  } // If opponent took damage and was put in some kind of stun this frame, either
  // start a conversion or


  if (opntIsDamaged || opntIsGrabbed || opntIsCommandGrabbed) {
    if (!state.conversion) {
      var _prevOpponentFrame$pe, _opponentFrame$percen;

      state.conversion = {
        playerIndex: indices.opponentIndex,
        lastHitBy: indices.playerIndex,
        startFrame: currentFrameNumber,
        endFrame: null,
        startPercent: prevOpponentFrame ? (_prevOpponentFrame$pe = prevOpponentFrame.percent) != null ? _prevOpponentFrame$pe : 0 : 0,
        currentPercent: (_opponentFrame$percen = opponentFrame.percent) != null ? _opponentFrame$percen : 0,
        endPercent: null,
        moves: [],
        didKill: false,
        openingType: "unknown" // Will be updated later

      };
      conversions.push(state.conversion);
    }

    if (opntDamageTaken) {
      // If animation of last hit has been cleared that means this is a new move. This
      // prevents counting multiple hits from the same move such as fox's drill
      if (state.lastHitAnimation === null) {
        state.move = {
          playerIndex: indices.playerIndex,
          frame: currentFrameNumber,
          moveId: playerFrame.lastAttackLanded,
          hitCount: 0,
          damage: 0
        };
        state.conversion.moves.push(state.move);
      }

      if (state.move) {
        state.move.hitCount += 1;
        state.move.damage += opntDamageTaken;
      } // Store previous frame animation to consider the case of a trade, the previous
      // frame should always be the move that actually connected... I hope


      state.lastHitAnimation = prevPlayerFrame ? prevPlayerFrame.actionStateId : null;
    }
  }

  if (!state.conversion) {
    // The rest of the function handles conversion termination logic, so if we don't
    // have a conversion started, there is no need to continue
    return false;
  }

  const opntInControl = isInControl(oppActionStateId);
  const opntDidLoseStock = prevOpponentFrame && didLoseStock(opponentFrame, prevOpponentFrame); // Update percent if opponent didn't lose stock

  if (!opntDidLoseStock) {
    var _opponentFrame$percen2;

    state.conversion.currentPercent = (_opponentFrame$percen2 = opponentFrame.percent) != null ? _opponentFrame$percen2 : 0;
  }

  if (opntIsDamaged || opntIsGrabbed || opntIsCommandGrabbed) {
    // If opponent got grabbed or damaged, reset the reset counter
    state.resetCounter = 0;
  }

  const shouldStartResetCounter = state.resetCounter === 0 && opntInControl;
  const shouldContinueResetCounter = state.resetCounter > 0;

  if (shouldStartResetCounter || shouldContinueResetCounter) {
    // This will increment the reset timer under the following conditions:
    // 1) if we were punishing opponent but they have now entered an actionable state
    // 2) if counter has already started counting meaning opponent has entered actionable state
    state.resetCounter += 1;
  }

  let shouldTerminate = false; // Termination condition 1 - player kills opponent

  if (opntDidLoseStock) {
    state.conversion.didKill = true;
    shouldTerminate = true;
  } // Termination condition 2 - conversion resets on time


  if (state.resetCounter > Timers.PUNISH_RESET_FRAMES) {
    shouldTerminate = true;
  } // If conversion should terminate, mark the end states and add it to list


  if (shouldTerminate) {
    var _prevOpponentFrame$pe2;

    state.conversion.endFrame = playerFrame.frame;
    state.conversion.endPercent = prevOpponentFrame ? (_prevOpponentFrame$pe2 = prevOpponentFrame.percent) != null ? _prevOpponentFrame$pe2 : 0 : 0;
    state.conversion = null;
    state.move = null;
  }

  return shouldTerminate;
}

exports.Command = void 0;

(function (Command) {
  Command[Command["SPLIT_MESSAGE"] = 16] = "SPLIT_MESSAGE";
  Command[Command["MESSAGE_SIZES"] = 53] = "MESSAGE_SIZES";
  Command[Command["GAME_START"] = 54] = "GAME_START";
  Command[Command["PRE_FRAME_UPDATE"] = 55] = "PRE_FRAME_UPDATE";
  Command[Command["POST_FRAME_UPDATE"] = 56] = "POST_FRAME_UPDATE";
  Command[Command["GAME_END"] = 57] = "GAME_END";
  Command[Command["FRAME_START"] = 58] = "FRAME_START";
  Command[Command["ITEM_UPDATE"] = 59] = "ITEM_UPDATE";
  Command[Command["FRAME_BOOKEND"] = 60] = "FRAME_BOOKEND";
  Command[Command["GECKO_LIST"] = 61] = "GECKO_LIST";
})(exports.Command || (exports.Command = {}));

exports.GameMode = void 0;

(function (GameMode) {
  GameMode[GameMode["VS"] = 2] = "VS";
  GameMode[GameMode["ONLINE"] = 8] = "ONLINE";
  GameMode[GameMode["TARGET_TEST"] = 15] = "TARGET_TEST";
  GameMode[GameMode["HOME_RUN_CONTEST"] = 32] = "HOME_RUN_CONTEST";
})(exports.GameMode || (exports.GameMode = {}));

exports.Language = void 0;

(function (Language) {
  Language[Language["JAPANESE"] = 0] = "JAPANESE";
  Language[Language["ENGLISH"] = 1] = "ENGLISH";
})(exports.Language || (exports.Language = {}));

exports.TimerType = void 0;

(function (TimerType) {
  TimerType[TimerType["NONE"] = 0] = "NONE";
  TimerType[TimerType["DECREASING"] = 2] = "DECREASING";
  TimerType[TimerType["INCREASING"] = 3] = "INCREASING";
})(exports.TimerType || (exports.TimerType = {}));

exports.ItemSpawnType = void 0;

(function (ItemSpawnType) {
  ItemSpawnType[ItemSpawnType["OFF"] = 255] = "OFF";
  ItemSpawnType[ItemSpawnType["VERY_LOW"] = 0] = "VERY_LOW";
  ItemSpawnType[ItemSpawnType["LOW"] = 1] = "LOW";
  ItemSpawnType[ItemSpawnType["MEDIUM"] = 2] = "MEDIUM";
  ItemSpawnType[ItemSpawnType["HIGH"] = 3] = "HIGH";
  ItemSpawnType[ItemSpawnType["VERY_HIGH"] = 4] = "VERY_HIGH";
})(exports.ItemSpawnType || (exports.ItemSpawnType = {}));

exports.EnabledItemType = void 0;

(function (EnabledItemType) {
  EnabledItemType[EnabledItemType["METAL_BOX"] = 1] = "METAL_BOX";
  EnabledItemType[EnabledItemType["CLOAKING_DEVICE"] = 2] = "CLOAKING_DEVICE";
  EnabledItemType[EnabledItemType["POKEBALL"] = 4] = "POKEBALL"; // Bits 4 through 8 of item bitfield 1 are unknown

  EnabledItemType[EnabledItemType["UNKNOWN_ITEM_BIT_4"] = 8] = "UNKNOWN_ITEM_BIT_4";
  EnabledItemType[EnabledItemType["UNKNOWN_ITEM_BIT_5"] = 16] = "UNKNOWN_ITEM_BIT_5";
  EnabledItemType[EnabledItemType["UNKNOWN_ITEM_BIT_6"] = 32] = "UNKNOWN_ITEM_BIT_6";
  EnabledItemType[EnabledItemType["UNKNOWN_ITEM_BIT_7"] = 64] = "UNKNOWN_ITEM_BIT_7";
  EnabledItemType[EnabledItemType["UNKNOWN_ITEM_BIT_8"] = 128] = "UNKNOWN_ITEM_BIT_8";
  EnabledItemType[EnabledItemType["FAN"] = 256] = "FAN";
  EnabledItemType[EnabledItemType["FIRE_FLOWER"] = 512] = "FIRE_FLOWER";
  EnabledItemType[EnabledItemType["SUPER_MUSHROOM"] = 1024] = "SUPER_MUSHROOM";
  EnabledItemType[EnabledItemType["POISON_MUSHROOM"] = 2048] = "POISON_MUSHROOM";
  EnabledItemType[EnabledItemType["HAMMER"] = 4096] = "HAMMER";
  EnabledItemType[EnabledItemType["WARP_STAR"] = 8192] = "WARP_STAR";
  EnabledItemType[EnabledItemType["SCREW_ATTACK"] = 16384] = "SCREW_ATTACK";
  EnabledItemType[EnabledItemType["BUNNY_HOOD"] = 32768] = "BUNNY_HOOD";
  EnabledItemType[EnabledItemType["RAY_GUN"] = 65536] = "RAY_GUN";
  EnabledItemType[EnabledItemType["FREEZIE"] = 131072] = "FREEZIE";
  EnabledItemType[EnabledItemType["FOOD"] = 262144] = "FOOD";
  EnabledItemType[EnabledItemType["MOTION_SENSOR_BOMB"] = 524288] = "MOTION_SENSOR_BOMB";
  EnabledItemType[EnabledItemType["FLIPPER"] = 1048576] = "FLIPPER";
  EnabledItemType[EnabledItemType["SUPER_SCOPE"] = 2097152] = "SUPER_SCOPE";
  EnabledItemType[EnabledItemType["STAR_ROD"] = 4194304] = "STAR_ROD";
  EnabledItemType[EnabledItemType["LIPS_STICK"] = 8388608] = "LIPS_STICK";
  EnabledItemType[EnabledItemType["HEART_CONTAINER"] = 16777216] = "HEART_CONTAINER";
  EnabledItemType[EnabledItemType["MAXIM_TOMATO"] = 33554432] = "MAXIM_TOMATO";
  EnabledItemType[EnabledItemType["STARMAN"] = 67108864] = "STARMAN";
  EnabledItemType[EnabledItemType["HOME_RUN_BAT"] = 134217728] = "HOME_RUN_BAT";
  EnabledItemType[EnabledItemType["BEAM_SWORD"] = 268435456] = "BEAM_SWORD";
  EnabledItemType[EnabledItemType["PARASOL"] = 536870912] = "PARASOL";
  EnabledItemType[EnabledItemType["GREEN_SHELL"] = 1073741824] = "GREEN_SHELL";
  EnabledItemType[EnabledItemType["RED_SHELL"] = 2147483648] = "RED_SHELL";
  EnabledItemType[EnabledItemType["CAPSULE"] = 4294967296] = "CAPSULE";
  EnabledItemType[EnabledItemType["BOX"] = 8589934592] = "BOX";
  EnabledItemType[EnabledItemType["BARREL"] = 17179869184] = "BARREL";
  EnabledItemType[EnabledItemType["EGG"] = 34359738368] = "EGG";
  EnabledItemType[EnabledItemType["PARTY_BALL"] = 68719476736] = "PARTY_BALL";
  EnabledItemType[EnabledItemType["BARREL_CANNON"] = 137438953472] = "BARREL_CANNON";
  EnabledItemType[EnabledItemType["BOMB_OMB"] = 274877906944] = "BOMB_OMB";
  EnabledItemType[EnabledItemType["MR_SATURN"] = 549755813888] = "MR_SATURN";
})(exports.EnabledItemType || (exports.EnabledItemType = {}));

exports.GameEndMethod = void 0;

(function (GameEndMethod) {
  GameEndMethod[GameEndMethod["UNRESOLVED"] = 0] = "UNRESOLVED";
  GameEndMethod[GameEndMethod["RESOLVED"] = 3] = "RESOLVED"; // The following options are only returned in version 2.0.0 onwards

  GameEndMethod[GameEndMethod["TIME"] = 1] = "TIME";
  GameEndMethod[GameEndMethod["GAME"] = 2] = "GAME";
  GameEndMethod[GameEndMethod["NO_CONTEST"] = 7] = "NO_CONTEST";
})(exports.GameEndMethod || (exports.GameEndMethod = {}));

exports.Frames = void 0;

(function (Frames) {
  Frames[Frames["FIRST"] = -123] = "FIRST";
  Frames[Frames["FIRST_PLAYABLE"] = -39] = "FIRST_PLAYABLE";
})(exports.Frames || (exports.Frames = {}));

var JoystickRegion;

(function (JoystickRegion) {
  JoystickRegion[JoystickRegion["DZ"] = 0] = "DZ";
  JoystickRegion[JoystickRegion["NE"] = 1] = "NE";
  JoystickRegion[JoystickRegion["SE"] = 2] = "SE";
  JoystickRegion[JoystickRegion["SW"] = 3] = "SW";
  JoystickRegion[JoystickRegion["NW"] = 4] = "NW";
  JoystickRegion[JoystickRegion["N"] = 5] = "N";
  JoystickRegion[JoystickRegion["E"] = 6] = "E";
  JoystickRegion[JoystickRegion["S"] = 7] = "S";
  JoystickRegion[JoystickRegion["W"] = 8] = "W";
})(JoystickRegion || (JoystickRegion = {}));

class InputComputer {
  constructor() {
    this.state = new Map();
    this.playerPermutations = new Array();
  }

  setup(settings) {
    // Reset the state
    this.state = new Map();
    this.playerPermutations = getSinglesPlayerPermutationsFromSettings(settings);
    this.playerPermutations.forEach(indices => {
      const playerState = {
        playerIndex: indices.playerIndex,
        opponentIndex: indices.opponentIndex,
        inputCount: 0,
        joystickInputCount: 0,
        cstickInputCount: 0,
        buttonInputCount: 0,
        triggerInputCount: 0
      };
      this.state.set(indices, playerState);
    });
  }

  processFrame(frame, allFrames) {
    this.playerPermutations.forEach(indices => {
      const state = this.state.get(indices);

      if (state) {
        handleInputCompute(allFrames, state, indices, frame);
      }
    });
  }

  fetch() {
    return Array.from(this.state.values());
  }

}

function handleInputCompute(frames, state, indices, frame) {
  const playerFrame = frame.players[indices.playerIndex].pre;
  const currentFrameNumber = playerFrame.frame;
  const prevFrameNumber = currentFrameNumber - 1;
  const prevPlayerFrame = frames[prevFrameNumber] ? frames[prevFrameNumber].players[indices.playerIndex].pre : null;

  if (currentFrameNumber < exports.Frames.FIRST_PLAYABLE || !prevPlayerFrame) {
    // Don't count inputs until the game actually starts
    return;
  } // First count the number of buttons that go from 0 to 1
  // Increment action count by amount of button presses


  const invertedPreviousButtons = ~prevPlayerFrame.physicalButtons;
  const currentButtons = playerFrame.physicalButtons;
  const buttonChanges = invertedPreviousButtons & currentButtons & 0xfff;
  const newInputsPressed = countSetBits(buttonChanges);
  state.inputCount += newInputsPressed;
  state.buttonInputCount += newInputsPressed; // Increment action count when sticks change from one region to another.
  // Don't increment when stick returns to deadzone

  const prevAnalogRegion = getJoystickRegion(prevPlayerFrame.joystickX, prevPlayerFrame.joystickY);
  const currentAnalogRegion = getJoystickRegion(playerFrame.joystickX, playerFrame.joystickY);

  if (prevAnalogRegion !== currentAnalogRegion && currentAnalogRegion !== JoystickRegion.DZ) {
    state.inputCount += 1;
    state.joystickInputCount += 1;
  } // Do the same for c-stick


  const prevCstickRegion = getJoystickRegion(prevPlayerFrame.cStickX, prevPlayerFrame.cStickY);
  const currentCstickRegion = getJoystickRegion(playerFrame.cStickX, playerFrame.cStickY);

  if (prevCstickRegion !== currentCstickRegion && currentCstickRegion !== JoystickRegion.DZ) {
    state.inputCount += 1;
    state.cstickInputCount += 1;
  } // Increment action on analog trigger... I'm not sure when. This needs revision
  // Currently will update input count when the button gets pressed past 0.3
  // Changes from hard shield to light shield should probably count as inputs but
  // are not counted here


  if (prevPlayerFrame.physicalLTrigger < 0.3 && playerFrame.physicalLTrigger >= 0.3) {
    state.inputCount += 1;
    state.triggerInputCount += 1;
  }

  if (prevPlayerFrame.physicalRTrigger < 0.3 && playerFrame.physicalRTrigger >= 0.3) {
    state.inputCount += 1;
    state.triggerInputCount += 1;
  }
}

function countSetBits(x) {
  // This function solves the Hamming Weight problem. Effectively it counts the number of
  // bits in the input that are set to 1
  // This implementation is supposedly very efficient when most bits are zero.
  // Found: https://en.wikipedia.org/wiki/Hamming_weight#Efficient_implementation
  let bits = x;
  let count;

  for (count = 0; bits; count += 1) {
    bits &= bits - 1;
  }

  return count;
}

function getJoystickRegion(x, y) {
  let region = JoystickRegion.DZ;

  if (x >= 0.2875 && y >= 0.2875) {
    region = JoystickRegion.NE;
  } else if (x >= 0.2875 && y <= -0.2875) {
    region = JoystickRegion.SE;
  } else if (x <= -0.2875 && y <= -0.2875) {
    region = JoystickRegion.SW;
  } else if (x <= -0.2875 && y >= 0.2875) {
    region = JoystickRegion.NW;
  } else if (y >= 0.2875) {
    region = JoystickRegion.N;
  } else if (x >= 0.2875) {
    region = JoystickRegion.E;
  } else if (y <= -0.2875) {
    region = JoystickRegion.S;
  } else if (x <= -0.2875) {
    region = JoystickRegion.W;
  }

  return region;
}

function generateOverallStats({
  settings,
  inputs,
  conversions,
  playableFrameCount
}) {
  const inputsByPlayer = lodash.keyBy(inputs, "playerIndex");
  const originalConversions = conversions;
  const conversionsByPlayer = lodash.groupBy(conversions, conv => {
    var _conv$moves$;

    return (_conv$moves$ = conv.moves[0]) == null ? void 0 : _conv$moves$.playerIndex;
  });
  const conversionsByPlayerByOpening = lodash.mapValues(conversionsByPlayer, conversions => lodash.groupBy(conversions, "openingType"));
  const gameMinutes = playableFrameCount / 3600;
  const overall = settings.players.map(player => {
    const playerIndex = player.playerIndex;
    const playerInputs = lodash.get(inputsByPlayer, playerIndex) || {};
    const inputCounts = {
      buttons: lodash.get(playerInputs, "buttonInputCount"),
      triggers: lodash.get(playerInputs, "triggerInputCount"),
      cstick: lodash.get(playerInputs, "cstickInputCount"),
      joystick: lodash.get(playerInputs, "joystickInputCount"),
      total: lodash.get(playerInputs, "inputCount")
    }; // const conversions = get(conversionsByPlayer, playerIndex) || [];
    // const successfulConversions = conversions.filter((conversion) => conversion.moves.length > 1);

    let conversionCount = 0;
    let successfulConversionCount = 0;
    const opponentIndices = settings.players.filter(opp => {
      // We want players which aren't ourselves
      if (opp.playerIndex === playerIndex) {
        return false;
      } // Make sure they're not on our team either


      return !settings.isTeams || opp.teamId !== player.teamId;
    }).map(opp => opp.playerIndex);
    let totalDamage = 0;
    let killCount = 0; // These are the conversions that we did on our opponents

    originalConversions // Filter down to conversions of our opponent
    .filter(conversion => conversion.playerIndex !== playerIndex).forEach(conversion => {
      conversionCount++; // We killed the opponent

      if (conversion.didKill && conversion.lastHitBy === playerIndex) {
        killCount += 1;
      }

      if (conversion.moves.length > 1 && conversion.moves[0].playerIndex === playerIndex) {
        successfulConversionCount++;
      }

      conversion.moves.forEach(move => {
        if (move.playerIndex === playerIndex) {
          totalDamage += move.damage;
        }
      });
    });
    return {
      playerIndex: playerIndex,
      inputCounts: inputCounts,
      conversionCount: conversionCount,
      totalDamage: totalDamage,
      killCount: killCount,
      successfulConversions: getRatio(successfulConversionCount, conversionCount),
      inputsPerMinute: getRatio(inputCounts.total, gameMinutes),
      digitalInputsPerMinute: getRatio(inputCounts.buttons, gameMinutes),
      openingsPerKill: getRatio(conversionCount, killCount),
      damagePerOpening: getRatio(totalDamage, conversionCount),
      neutralWinRatio: getOpeningRatio(conversionsByPlayerByOpening, playerIndex, opponentIndices, "neutral-win"),
      counterHitRatio: getOpeningRatio(conversionsByPlayerByOpening, playerIndex, opponentIndices, "counter-attack"),
      beneficialTradeRatio: getBeneficialTradeRatio(conversionsByPlayerByOpening, playerIndex, opponentIndices)
    };
  });
  return overall;
}

function getRatio(count, total) {
  return {
    count: count,
    total: total,
    ratio: total ? count / total : null
  };
}

function getOpeningRatio(conversionsByPlayerByOpening, playerIndex, opponentIndices, type) {
  const openings = lodash.get(conversionsByPlayerByOpening, [playerIndex, type]) || [];
  const opponentOpenings = lodash.flatten(opponentIndices.map(opponentIndex => lodash.get(conversionsByPlayerByOpening, [opponentIndex, type]) || []));
  return getRatio(openings.length, openings.length + opponentOpenings.length);
}

function getBeneficialTradeRatio(conversionsByPlayerByOpening, playerIndex, opponentIndices) {
  const playerTrades = lodash.get(conversionsByPlayerByOpening, [playerIndex, "trade"]) || [];
  const opponentTrades = lodash.flatten(opponentIndices.map(opponentIndex => lodash.get(conversionsByPlayerByOpening, [opponentIndex, "trade"]) || []));
  const benefitsPlayer = []; // Figure out which punishes benefited this player

  const zippedTrades = lodash.zip(playerTrades, opponentTrades);
  zippedTrades.forEach(conversionPair => {
    const playerConversion = lodash.first(conversionPair);
    const opponentConversion = lodash.last(conversionPair);

    if (playerConversion && opponentConversion) {
      const playerDamage = playerConversion.currentPercent - playerConversion.startPercent;
      const opponentDamage = opponentConversion.currentPercent - opponentConversion.startPercent;

      if (playerConversion.didKill && !opponentConversion.didKill) {
        benefitsPlayer.push(playerConversion);
      } else if (playerDamage > opponentDamage) {
        benefitsPlayer.push(playerConversion);
      }
    }
  });
  return getRatio(benefitsPlayer.length, playerTrades.length);
}

const defaultOptions = {
  processOnTheFly: false
};
class Stats {
  constructor(options) {
    this.options = void 0;
    this.lastProcessedFrame = null;
    this.frames = {};
    this.players = [];
    this.allComputers = new Array();
    this.options = Object.assign({}, defaultOptions, options);
  }
  /**
   * Should reset the frames to their default values.
   */


  setup(settings) {
    // Reset the frames since it's a new game
    this.frames = {};
    this.players = settings.players.map(v => v.playerIndex); // Forward the settings on to the individual stat computer

    this.allComputers.forEach(comp => comp.setup(settings));
  }

  register(...computer) {
    this.allComputers.push(...computer);
  }

  process() {
    if (this.players.length === 0) {
      return;
    }

    let i = this.lastProcessedFrame !== null ? this.lastProcessedFrame + 1 : exports.Frames.FIRST;

    while (this.frames[i]) {
      const frame = this.frames[i]; // Don't attempt to compute stats on frames that have not been fully received

      if (!isCompletedFrame(this.players, frame)) {
        return;
      }

      this.allComputers.forEach(comp => comp.processFrame(frame, this.frames));
      this.lastProcessedFrame = i;
      i++;
    }
  }

  addFrame(frame) {
    this.frames[frame.frame] = frame;

    if (this.options.processOnTheFly) {
      this.process();
    }
  }

}

function isCompletedFrame(players, frame) {
  if (!frame) {
    return false;
  } // This function checks whether we have successfully received an entire frame.
  // It is not perfect because it does not wait for follower frames. Fortunately,
  // follower frames are not used for any stat calculations so this doesn't matter
  // for our purposes.


  for (const player of players) {
    const playerPostFrame = lodash.get(frame, ["players", player, "post"]);

    if (!playerPostFrame) {
      return false;
    }
  }

  return true;
}

class StockComputer {
  constructor() {
    this.state = new Map();
    this.playerPermutations = new Array();
    this.stocks = new Array();
  }

  setup(settings) {
    // Reset state
    this.state = new Map();
    this.playerPermutations = getSinglesPlayerPermutationsFromSettings(settings);
    this.stocks = [];
    this.playerPermutations.forEach(indices => {
      const playerState = {
        stock: null
      };
      this.state.set(indices, playerState);
    });
  }

  processFrame(frame, allFrames) {
    this.playerPermutations.forEach(indices => {
      const state = this.state.get(indices);

      if (state) {
        handleStockCompute(allFrames, state, indices, frame, this.stocks);
      }
    });
  }

  fetch() {
    return this.stocks;
  }

}

function handleStockCompute(frames, state, indices, frame, stocks) {
  const playerFrame = frame.players[indices.playerIndex].post;
  const currentFrameNumber = playerFrame.frame;
  const prevFrameNumber = currentFrameNumber - 1;
  const prevPlayerFrame = frames[prevFrameNumber] ? frames[prevFrameNumber].players[indices.playerIndex].post : null; // If there is currently no active stock, wait until the player is no longer spawning.
  // Once the player is no longer spawning, start the stock

  if (!state.stock) {
    const isPlayerDead = isDead(playerFrame.actionStateId);

    if (isPlayerDead) {
      return;
    }

    state.stock = {
      playerIndex: indices.playerIndex,
      startFrame: currentFrameNumber,
      endFrame: null,
      startPercent: 0,
      endPercent: null,
      currentPercent: 0,
      count: playerFrame.stocksRemaining,
      deathAnimation: null
    };
    stocks.push(state.stock);
  } else if (prevPlayerFrame && didLoseStock(playerFrame, prevPlayerFrame)) {
    var _prevPlayerFrame$perc;

    state.stock.endFrame = playerFrame.frame;
    state.stock.endPercent = (_prevPlayerFrame$perc = prevPlayerFrame.percent) != null ? _prevPlayerFrame$perc : 0;
    state.stock.deathAnimation = playerFrame.actionStateId;
    state.stock = null;
  } else {
    var _playerFrame$percent;

    state.stock.currentPercent = (_playerFrame$percent = playerFrame.percent) != null ? _playerFrame$percent : 0;
  }
}

// Based on https://github.com/wilsonzlin/edgesearch/blob/d03816dd4b18d3d2eb6d08cb1ae14f96f046141d/demo/wiki/client/src/util/util.ts
// Ensures value is not null or undefined.
// != does no type validation so we don't need to explcitly check for undefined.
function exists(value) {
  return value != null;
}

const TARGET_ITEM_TYPE_ID = 209;
class TargetBreakComputer {
  constructor() {
    this.targetBreaks = new Array();
    this.isTargetTestGame = false;
  }

  setup(settings) {
    // Reset the state
    this.targetBreaks = [];
    this.isTargetTestGame = settings.gameMode === exports.GameMode.TARGET_TEST;
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

  if (currentFrameNumber === exports.Frames.FIRST) {
    var _frames$Frames$FIRST$, _frames$Frames$FIRST, _frames$Frames$FIRST$2;

    const targets = (_frames$Frames$FIRST$ = (_frames$Frames$FIRST = frames[exports.Frames.FIRST]) == null ? void 0 : (_frames$Frames$FIRST$2 = _frames$Frames$FIRST.items) == null ? void 0 : _frames$Frames$FIRST$2.filter(item => item.typeId === TARGET_ITEM_TYPE_ID)) != null ? _frames$Frames$FIRST$ : [];
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

function frameToGameTimer(frame, options) {
  const {
    timerType,
    startingTimerSeconds
  } = options;

  if (timerType === exports.TimerType.DECREASING) {
    if (!exists(startingTimerSeconds)) {
      return "Unknown";
    }

    const centiseconds = Math.ceil((60 - frame % 60) % 60 * 99 / 59);
    const date = new Date(0, 0, 0, 0, 0, startingTimerSeconds - frame / 60, centiseconds * 10);
    return dateFns.format(date, "mm:ss.SS");
  }

  if (timerType === exports.TimerType.INCREASING) {
    const centiseconds = Math.floor(frame % 60 * 99 / 59);
    const date = new Date(0, 0, 0, 0, 0, frame / 60, centiseconds * 10);
    return dateFns.format(date, "mm:ss.SS");
  }

  return "Infinite";
}

exports.CommunicationType = void 0;

(function (CommunicationType) {
  CommunicationType[CommunicationType["HANDSHAKE"] = 1] = "HANDSHAKE";
  CommunicationType[CommunicationType["REPLAY"] = 2] = "REPLAY";
  CommunicationType[CommunicationType["KEEP_ALIVE"] = 3] = "KEEP_ALIVE";
})(exports.CommunicationType || (exports.CommunicationType = {})); // This class is responsible for handling the communication protocol between the Wii and the
// desktop app


class ConsoleCommunication {
  constructor() {
    this.receiveBuf = Buffer.from([]);
    this.messages = new Array();
  }

  receive(data) {
    this.receiveBuf = Buffer.concat([this.receiveBuf, data]);

    while (this.receiveBuf.length >= 4) {
      // First get the size of the message we are expecting
      const msgSize = this.receiveBuf.readUInt32BE(0);

      if (this.receiveBuf.length < msgSize + 4) {
        // If we haven't received all the data yet, let's wait for more
        return;
      } // Here we have received all the data, so let's decode it


      const ubjsonData = this.receiveBuf.slice(4, msgSize + 4);
      this.messages.push(ubjson.decode(ubjsonData)); // Remove the processed data from receiveBuf

      this.receiveBuf = this.receiveBuf.slice(msgSize + 4);
    }
  }

  getReceiveBuffer() {
    return this.receiveBuf;
  }

  getMessages() {
    const toReturn = this.messages;
    this.messages = [];
    return toReturn;
  }

  genHandshakeOut(cursor, clientToken, isRealtime = false) {
    const clientTokenBuf = Buffer.from([0, 0, 0, 0]);
    clientTokenBuf.writeUInt32BE(clientToken, 0);
    const message = {
      type: exports.CommunicationType.HANDSHAKE,
      payload: {
        cursor: cursor,
        clientToken: Uint8Array.from(clientTokenBuf),
        isRealtime: isRealtime
      }
    };
    const buf = ubjson.encode(message, {
      optimizeArrays: true
    });
    const msg = Buffer.concat([Buffer.from([0, 0, 0, 0]), Buffer.from(buf)]);
    msg.writeUInt32BE(buf.byteLength, 0);
    return msg;
  }

}

exports.ConnectionEvent = void 0;

(function (ConnectionEvent) {
  ConnectionEvent["CONNECT"] = "connect";
  ConnectionEvent["MESSAGE"] = "message";
  ConnectionEvent["HANDSHAKE"] = "handshake";
  ConnectionEvent["STATUS_CHANGE"] = "statusChange";
  ConnectionEvent["DATA"] = "data";
  ConnectionEvent["ERROR"] = "error";
})(exports.ConnectionEvent || (exports.ConnectionEvent = {}));

exports.ConnectionStatus = void 0;

(function (ConnectionStatus) {
  ConnectionStatus[ConnectionStatus["DISCONNECTED"] = 0] = "DISCONNECTED";
  ConnectionStatus[ConnectionStatus["CONNECTING"] = 1] = "CONNECTING";
  ConnectionStatus[ConnectionStatus["CONNECTED"] = 2] = "CONNECTED";
  ConnectionStatus[ConnectionStatus["RECONNECT_WAIT"] = 3] = "RECONNECT_WAIT";
})(exports.ConnectionStatus || (exports.ConnectionStatus = {}));

exports.Ports = void 0;

(function (Ports) {
  Ports[Ports["DEFAULT"] = 51441] = "DEFAULT";
  Ports[Ports["LEGACY"] = 666] = "LEGACY";
  Ports[Ports["RELAY_START"] = 53741] = "RELAY_START";
})(exports.Ports || (exports.Ports = {}));

const NETWORK_MESSAGE = "HELO\0";
const DEFAULT_CONNECTION_TIMEOUT_MS = 20000;
var CommunicationState;

(function (CommunicationState) {
  CommunicationState["INITIAL"] = "initial";
  CommunicationState["LEGACY"] = "legacy";
  CommunicationState["NORMAL"] = "normal";
})(CommunicationState || (CommunicationState = {}));

const defaultConnectionDetails = {
  consoleNick: "unknown",
  gameDataCursor: /*#__PURE__*/Uint8Array.from([0, 0, 0, 0, 0, 0, 0, 0]),
  version: "",
  clientToken: 0
};
const consoleConnectionOptions = {
  autoReconnect: true
};
/**
 * Responsible for maintaining connection to a Slippi relay connection or Wii connection.
 * Events are emitted whenever data is received.
 *
 * Basic usage example:
 *
 * ```javascript
 * const { ConsoleConnection } = require("@slippi/slippi-js");
 *
 * const connection = new ConsoleConnection();
 * connection.connect("localhost", 667); // You should set these values appropriately
 *
 * connection.on("data", (data) => {
 *   // Received data from console
 *   console.log(data);
 * });
 *
 * connection.on("statusChange", (status) => {
 *   console.log(`status changed: ${status}`);
 * });
 * ```
 */

class ConsoleConnection extends events.EventEmitter {
  constructor(options) {
    super();
    this.ipAddress = void 0;
    this.port = void 0;
    this.isRealtime = void 0;
    this.connectionStatus = exports.ConnectionStatus.DISCONNECTED;
    this.connDetails = { ...defaultConnectionDetails
    };
    this.client = null;
    this.connection = null;
    this.options = void 0;
    this.shouldReconnect = false;
    this.ipAddress = "0.0.0.0";
    this.port = exports.Ports.DEFAULT;
    this.isRealtime = false;
    this.options = Object.assign({}, consoleConnectionOptions, options);
  }
  /**
   * @returns The current connection status.
   */


  getStatus() {
    return this.connectionStatus;
  }
  /**
   * @returns The IP address and port of the current connection.
   */


  getSettings() {
    return {
      ipAddress: this.ipAddress,
      port: this.port
    };
  }
  /**
   * @returns The specific details about the connected console.
   */


  getDetails() {
    return { ...this.connDetails
    };
  }
  /**
   * Initiate a connection to the Wii or Slippi relay.
   * @param ip   The IP address of the Wii or Slippi relay.
   * @param port The port to connect to.
   * @param isRealtime Optional. A flag to tell the Wii to send data as quickly as possible
   * @param timeout Optional. The timeout in milliseconds when attempting to connect
   *                to the Wii or relay.
   */


  connect(ip, port, isRealtime = false, timeout = DEFAULT_CONNECTION_TIMEOUT_MS) {
    this.ipAddress = ip;
    this.port = port;
    this.isRealtime = isRealtime;

    this._connectOnPort(ip, port, timeout);
  }

  _connectOnPort(ip, port, timeout) {
    // set up reconnect
    const reconnect = inject__default["default"](() => net__default["default"].connect({
      host: ip,
      port: port,
      timeout: timeout
    })); // Indicate we are connecting

    this._setStatus(exports.ConnectionStatus.CONNECTING); // Prepare console communication obj for talking UBJSON


    const consoleComms = new ConsoleCommunication(); // TODO: reconnect on failed reconnect, not sure how
    // TODO: to do this

    const connection = reconnect({
      initialDelay: 2000,
      maxDelay: 10000,
      strategy: "fibonacci",
      failAfter: Infinity
    }, client => {
      var _this$connDetails$cli;

      this.emit(exports.ConnectionEvent.CONNECT); // We successfully connected so turn on auto-reconnect

      this.shouldReconnect = this.options.autoReconnect;
      this.client = client;
      let commState = CommunicationState.INITIAL;
      client.on("data", data => {
        if (commState === CommunicationState.INITIAL) {
          commState = this._getInitialCommState(data);
          console.log(`Connected to ${ip}:${port} with type: ${commState}`);

          this._setStatus(exports.ConnectionStatus.CONNECTED);

          console.log(data.toString("hex"));
        }

        if (commState === CommunicationState.LEGACY) {
          // If the first message received was not a handshake message, either we
          // connected to an old Nintendont version or a relay instance
          this._handleReplayData(data);

          return;
        }

        try {
          consoleComms.receive(data);
        } catch (err) {
          console.error("Failed to process new data from server...", {
            error: err,
            prevDataBuf: consoleComms.getReceiveBuffer(),
            rcvData: data
          });
          client.destroy();
          this.emit(exports.ConnectionEvent.ERROR, err);
          return;
        }

        const messages = consoleComms.getMessages(); // Process all of the received messages

        try {
          messages.forEach(message => this._processMessage(message));
        } catch (err) {
          // Disconnect client to send another handshake message
          console.error(err);
          client.destroy();
          this.emit(exports.ConnectionEvent.ERROR, err);
        }
      });
      client.on("timeout", () => {
        // const previouslyConnected = this.connectionStatus === ConnectionStatus.CONNECTED;
        console.warn(`Attempted connection to ${ip}:${port} timed out after ${timeout}ms`);
        client.destroy();
      });
      client.on("end", () => {
        console.log("disconnect");

        if (!this.shouldReconnect) {
          client.destroy();
        }
      });
      client.on("close", () => {
        console.log("connection was closed");
      });
      const handshakeMsgOut = consoleComms.genHandshakeOut(this.connDetails.gameDataCursor, (_this$connDetails$cli = this.connDetails.clientToken) != null ? _this$connDetails$cli : 0, this.isRealtime);
      client.write(handshakeMsgOut);
    });

    const setConnectingStatus = () => {
      // Indicate we are connecting
      this._setStatus(this.shouldReconnect ? exports.ConnectionStatus.RECONNECT_WAIT : exports.ConnectionStatus.CONNECTING);
    };

    connection.on("connect", setConnectingStatus);
    connection.on("reconnect", setConnectingStatus);
    connection.on("disconnect", () => {
      if (!this.shouldReconnect) {
        connection.reconnect = false;
        connection.disconnect();

        this._setStatus(exports.ConnectionStatus.DISCONNECTED);
      } // TODO: Figure out how to set RECONNECT_WAIT state here. Currently it will stay on
      // TODO: Connecting... forever

    });
    connection.on("error", err => {
      console.warn(`Connection on port ${port} encountered an error.`, err);

      this._setStatus(exports.ConnectionStatus.DISCONNECTED);

      this.emit(exports.ConnectionEvent.ERROR, `Connection on port ${port} encountered an error.\n${err}`);
    });
    this.connection = connection;
    connection.connect(port);
  }
  /**
   * Terminate the current connection.
   */


  disconnect() {
    // Prevent reconnections and disconnect
    if (this.connection) {
      this.connection.reconnect = false;
      this.connection.disconnect();
      this.connection = null;
    }

    if (this.client) {
      this.client.destroy();
    }
  }

  _getInitialCommState(data) {
    if (data.length < 13) {
      return CommunicationState.LEGACY;
    }

    const openingBytes = Buffer.from([0x7b, 0x69, 0x04, 0x74, 0x79, 0x70, 0x65, 0x55, 0x01]);
    const dataStart = data.slice(4, 13);
    return dataStart.equals(openingBytes) ? CommunicationState.NORMAL : CommunicationState.LEGACY;
  }

  _processMessage(message) {
    this.emit(exports.ConnectionEvent.MESSAGE, message);

    switch (message.type) {
      case exports.CommunicationType.KEEP_ALIVE:
        // console.log("Keep alive message received");
        // TODO: This is the jankiest shit ever but it will allow for relay connections not
        // TODO: to time out as long as the main connection is still receving keep alive messages
        // TODO: Need to figure out a better solution for this. There should be no need to have an
        // TODO: active Wii connection for the relay connection to keep itself alive
        const fakeKeepAlive = Buffer.from(NETWORK_MESSAGE);

        this._handleReplayData(fakeKeepAlive);

        break;

      case exports.CommunicationType.REPLAY:
        const readPos = Uint8Array.from(message.payload.pos);
        const cmp = Buffer.compare(this.connDetails.gameDataCursor, readPos);

        if (!message.payload.forcePos && cmp !== 0) {
          // The readPos is not the one we are waiting on, throw error
          throw new Error(`Position of received data is incorrect. Expected: ${this.connDetails.gameDataCursor.toString()}, Received: ${readPos.toString()}`);
        }

        if (message.payload.forcePos) {
          console.warn("Overflow occured in Nintendont, data has likely been skipped and replay corrupted. " + "Expected, Received:", this.connDetails.gameDataCursor, readPos);
        }

        this.connDetails.gameDataCursor = Uint8Array.from(message.payload.nextPos);
        const data = Uint8Array.from(message.payload.data);

        this._handleReplayData(data);

        break;

      case exports.CommunicationType.HANDSHAKE:
        const {
          nick,
          nintendontVersion
        } = message.payload;

        if (nick) {
          this.connDetails.consoleNick = nick;
        }

        const tokenBuf = Buffer.from(message.payload.clientToken);
        this.connDetails.clientToken = tokenBuf.readUInt32BE(0);

        if (nintendontVersion) {
          this.connDetails.version = nintendontVersion;
        }

        this.connDetails.gameDataCursor = Uint8Array.from(message.payload.pos);
        this.emit(exports.ConnectionEvent.HANDSHAKE, this.connDetails);
        break;
    }
  }

  _handleReplayData(data) {
    this.emit(exports.ConnectionEvent.DATA, data);
  }

  _setStatus(status) {
    // Don't fire the event if the status hasn't actually changed
    if (this.connectionStatus !== status) {
      this.connectionStatus = status;
      this.emit(exports.ConnectionEvent.STATUS_CHANGE, this.connectionStatus);
    }
  }

}

const MAX_PEERS = 32;
exports.DolphinMessageType = void 0;

(function (DolphinMessageType) {
  DolphinMessageType["CONNECT_REPLY"] = "connect_reply";
  DolphinMessageType["GAME_EVENT"] = "game_event";
  DolphinMessageType["START_GAME"] = "start_game";
  DolphinMessageType["END_GAME"] = "end_game";
})(exports.DolphinMessageType || (exports.DolphinMessageType = {}));

class DolphinConnection extends events.EventEmitter {
  constructor() {
    super();
    this.ipAddress = void 0;
    this.port = void 0;
    this.connectionStatus = exports.ConnectionStatus.DISCONNECTED;
    this.gameCursor = 0;
    this.nickname = "unknown";
    this.version = "";
    this.peer = null;
    this.ipAddress = "0.0.0.0";
    this.port = exports.Ports.DEFAULT;
  }
  /**
   * @returns The current connection status.
   */


  getStatus() {
    return this.connectionStatus;
  }
  /**
   * @returns The IP address and port of the current connection.
   */


  getSettings() {
    return {
      ipAddress: this.ipAddress,
      port: this.port
    };
  }

  getDetails() {
    return {
      consoleNick: this.nickname,
      gameDataCursor: this.gameCursor,
      version: this.version
    };
  }

  async connect(ip, port) {
    console.log(`Connecting to: ${ip}:${port}`);
    this.ipAddress = ip;
    this.port = port;
    const enet = await Promise.resolve().then(function () { return /*#__PURE__*/_interopNamespace(require('enet')); }); // Create the enet client

    const client = enet.createClient({
      peers: MAX_PEERS,
      channels: 3,
      down: 0,
      up: 0
    }, err => {
      if (err) {
        console.error(err);
        return;
      }
    });
    this.peer = client.connect({
      address: this.ipAddress,
      port: this.port
    }, 3, 1337, // Data to send, not sure what this is or what this represents
    (err, newPeer) => {
      if (err) {
        console.error(err);
        return;
      }

      newPeer.ping();
      this.emit(exports.ConnectionEvent.CONNECT);

      this._setStatus(exports.ConnectionStatus.CONNECTED);
    });
    this.peer.on("connect", () => {
      // Reset the game cursor to the beginning of the game. Do we need to do this or
      // should it just continue from where it left off?
      this.gameCursor = 0;
      const request = {
        type: "connect_request",
        cursor: this.gameCursor
      };
      const packet = new enet.Packet(JSON.stringify(request), enet.PACKET_FLAG.RELIABLE);
      this.peer.send(0, packet);
    });
    this.peer.on("message", packet => {
      const data = packet.data();

      if (data.length === 0) {
        return;
      }

      const dataString = data.toString("ascii");
      const message = JSON.parse(dataString);
      const {
        dolphin_closed
      } = message;

      if (dolphin_closed) {
        // We got a disconnection request
        this.disconnect();
        return;
      }

      this.emit(exports.ConnectionEvent.MESSAGE, message);

      switch (message.type) {
        case exports.DolphinMessageType.CONNECT_REPLY:
          this.connectionStatus = exports.ConnectionStatus.CONNECTED;
          this.gameCursor = message.cursor;
          this.nickname = message.nick;
          this.version = message.version;
          this.emit(exports.ConnectionEvent.HANDSHAKE, this.getDetails());
          break;

        case exports.DolphinMessageType.GAME_EVENT:
          {
            const {
              payload
            } = message; //TODO: remove after game start and end messages have been in stable Ishii for a bit

            if (!payload) {
              // We got a disconnection request
              this.disconnect();
              return;
            }

            this._updateCursor(message, dataString);

            const gameData = Buffer.from(payload, "base64");

            this._handleReplayData(gameData);

            break;
          }

        case exports.DolphinMessageType.START_GAME:
          {
            this._updateCursor(message, dataString);

            break;
          }

        case exports.DolphinMessageType.END_GAME:
          {
            this._updateCursor(message, dataString);

            break;
          }
      }
    });
    this.peer.on("disconnect", () => {
      this.disconnect();
    });

    this._setStatus(exports.ConnectionStatus.CONNECTING);
  }

  disconnect() {
    if (this.peer) {
      this.peer.disconnect();
      this.peer = null;
    }

    this._setStatus(exports.ConnectionStatus.DISCONNECTED);
  }

  _handleReplayData(data) {
    this.emit(exports.ConnectionEvent.DATA, data);
  }

  _setStatus(status) {
    // Don't fire the event if the status hasn't actually changed
    if (this.connectionStatus !== status) {
      this.connectionStatus = status;
      this.emit(exports.ConnectionEvent.STATUS_CHANGE, this.connectionStatus);
    }
  }

  _updateCursor(message, dataString) {
    const {
      cursor,
      next_cursor
    } = message;

    if (this.gameCursor !== cursor) {
      const err = new Error(`Unexpected game data cursor. Expected: ${this.gameCursor} but got: ${cursor}. Payload: ${dataString}`);
      console.warn(err);
      this.emit(exports.ConnectionEvent.ERROR, err);
    }

    this.gameCursor = next_cursor;
  }

}

function toHalfwidth(str) {
  // Converts a fullwidth character to halfwidth
  const convertChar = charCode => {
    /**
     * Standard full width encodings
     * https://en.wikipedia.org/wiki/Halfwidth_and_Fullwidth_Forms_(Unicode_block)
     */
    if (charCode > 0xff00 && charCode < 0xff5f) {
      return 0x0020 + (charCode - 0xff00);
    } // space:


    if (charCode === 0x3000) {
      return 0x0020;
    }
    /**
     * Exceptions found in Melee/Japanese keyboards
     */
    // single quote: '


    if (charCode === 0x2019) {
      return 0x0027;
    } // double quote: "


    if (charCode === 0x201d) {
      return 0x0022;
    }

    return charCode;
  };

  const ret = lodash.map(str, char => convertChar(char.charCodeAt(0)));
  return String.fromCharCode(...ret);
}

exports.SlpInputSource = void 0;

(function (SlpInputSource) {
  SlpInputSource["BUFFER"] = "buffer";
  SlpInputSource["FILE"] = "file";
})(exports.SlpInputSource || (exports.SlpInputSource = {}));

function getRef(input) {
  switch (input.source) {
    case exports.SlpInputSource.FILE:
      if (!input.filePath) {
        throw new Error("File source requires a file path");
      }

      const fd = fs__default["default"].openSync(input.filePath, "r");
      return {
        source: input.source,
        fileDescriptor: fd
      };

    case exports.SlpInputSource.BUFFER:
      return {
        source: input.source,
        buffer: input.buffer
      };

    default:
      throw new Error("Source type not supported");
  }
}

function readRef(ref, buffer, offset, length, position) {
  switch (ref.source) {
    case exports.SlpInputSource.FILE:
      return fs__default["default"].readSync(ref.fileDescriptor, buffer, offset, length, position);

    case exports.SlpInputSource.BUFFER:
      return ref.buffer.copy(buffer, offset, position, position + length);

    default:
      throw new Error("Source type not supported");
  }
}

function getLenRef(ref) {
  switch (ref.source) {
    case exports.SlpInputSource.FILE:
      const fileStats = fs__default["default"].fstatSync(ref.fileDescriptor);
      return fileStats.size;

    case exports.SlpInputSource.BUFFER:
      return ref.buffer.length;

    default:
      throw new Error("Source type not supported");
  }
}
/**
 * Opens a file at path
 */


function openSlpFile(input) {
  const ref = getRef(input);
  const rawDataPosition = getRawDataPosition(ref);
  const rawDataLength = getRawDataLength(ref, rawDataPosition);
  const metadataPosition = rawDataPosition + rawDataLength + 10; // remove metadata string

  const metadataLength = getMetadataLength(ref, metadataPosition);
  const messageSizes = getMessageSizes(ref, rawDataPosition);
  return {
    ref,
    rawDataPosition,
    rawDataLength,
    metadataPosition,
    metadataLength,
    messageSizes
  };
}
function closeSlpFile(file) {
  switch (file.ref.source) {
    case exports.SlpInputSource.FILE:
      fs__default["default"].closeSync(file.ref.fileDescriptor);
      break;
  }
} // This function gets the position where the raw data starts

function getRawDataPosition(ref) {
  const buffer = new Uint8Array(1);
  readRef(ref, buffer, 0, buffer.length, 0);

  if (buffer[0] === 0x36) {
    return 0;
  }

  if (buffer[0] !== "{".charCodeAt(0)) {
    return 0; // return error?
  }

  return 15;
}

function getRawDataLength(ref, position) {
  const fileSize = getLenRef(ref);

  if (position === 0) {
    return fileSize;
  }

  const buffer = new Uint8Array(4);
  readRef(ref, buffer, 0, buffer.length, position - 4);
  const rawDataLen = buffer[0] << 24 | buffer[1] << 16 | buffer[2] << 8 | buffer[3];

  if (rawDataLen > 0) {
    // If this method manages to read a number, it's probably trustworthy
    return rawDataLen;
  } // If the above does not return a valid data length,
  // return a file size based on file length. This enables
  // some support for severed files


  return fileSize - position;
}

function getMetadataLength(ref, position) {
  const len = getLenRef(ref);
  return len - position - 1;
}

function getMessageSizes(ref, position) {
  const messageSizes = {}; // Support old file format

  if (position === 0) {
    messageSizes[0x36] = 0x140;
    messageSizes[0x37] = 0x6;
    messageSizes[0x38] = 0x46;
    messageSizes[0x39] = 0x1;
    return messageSizes;
  }

  const buffer = new Uint8Array(2);
  readRef(ref, buffer, 0, buffer.length, position);

  if (buffer[0] !== exports.Command.MESSAGE_SIZES) {
    return {};
  }

  const payloadLength = buffer[1];
  messageSizes[0x35] = payloadLength;
  const messageSizesBuffer = new Uint8Array(payloadLength - 1);
  readRef(ref, messageSizesBuffer, 0, messageSizesBuffer.length, position + 2);

  for (let i = 0; i < payloadLength - 1; i += 3) {
    const command = messageSizesBuffer[i]; // Get size of command

    messageSizes[command] = messageSizesBuffer[i + 1] << 8 | messageSizesBuffer[i + 2];
  }

  return messageSizes;
}

function getEnabledItems(view) {
  const offsets = [0x1, 0x100, 0x10000, 0x1000000, 0x100000000];
  const enabledItems = offsets.reduce((acc, byteOffset, index) => {
    const byte = readUint8(view, 0x28 + index);
    return acc + byte * byteOffset;
  }, 0);
  return enabledItems;
}

function getGameInfoBlock(view) {
  const offset = 0x5;
  return {
    gameBitfield1: readUint8(view, 0x0 + offset),
    gameBitfield2: readUint8(view, 0x1 + offset),
    gameBitfield3: readUint8(view, 0x2 + offset),
    gameBitfield4: readUint8(view, 0x3 + offset),
    bombRainEnabled: (readUint8(view, 0x6 + offset) & 0xff) > 0 ? true : false,
    itemSpawnBehavior: readInt8(view, 0xb + offset),
    selfDestructScoreValue: readInt8(view, 0xc + offset),
    //stageId: readUint16(view, 0xe + offset),
    //gameTimer: readUint32(view, 0x10 + offset),
    itemSpawnBitfield1: readUint8(view, 0x23 + offset),
    itemSpawnBitfield2: readUint8(view, 0x24 + offset),
    itemSpawnBitfield3: readUint8(view, 0x25 + offset),
    itemSpawnBitfield4: readUint8(view, 0x26 + offset),
    itemSpawnBitfield5: readUint8(view, 0x27 + offset),
    damageRatio: readFloat(view, 0x30 + offset)
  };
}
/**
 * Iterates through slp events and parses payloads
 */


function iterateEvents(slpFile, callback, startPos = null) {
  const ref = slpFile.ref;
  let readPosition = startPos !== null && startPos > 0 ? startPos : slpFile.rawDataPosition;
  const stopReadingAt = slpFile.rawDataPosition + slpFile.rawDataLength; // Generate read buffers for each

  const commandPayloadBuffers = lodash.mapValues(slpFile.messageSizes, size => new Uint8Array(size + 1));
  let splitMessageBuffer = new Uint8Array(0);
  const commandByteBuffer = new Uint8Array(1);

  while (readPosition < stopReadingAt) {
    var _commandByteBuffer$;

    readRef(ref, commandByteBuffer, 0, 1, readPosition);
    let commandByte = (_commandByteBuffer$ = commandByteBuffer[0]) != null ? _commandByteBuffer$ : 0;
    let buffer = commandPayloadBuffers[commandByte];

    if (buffer === undefined) {
      // If we don't have an entry for this command, return false to indicate failed read
      return readPosition;
    }

    if (buffer.length > stopReadingAt - readPosition) {
      return readPosition;
    }

    const advanceAmount = buffer.length;
    readRef(ref, buffer, 0, buffer.length, readPosition);

    if (commandByte === exports.Command.SPLIT_MESSAGE) {
      var _readUint, _readUint2;

      // Here we have a split message, we will collect data from them until the last
      // message of the list is received
      const view = new DataView(buffer.buffer);
      const size = (_readUint = readUint16(view, 0x201)) != null ? _readUint : 512;
      const isLastMessage = readBool(view, 0x204);
      const internalCommand = (_readUint2 = readUint8(view, 0x203)) != null ? _readUint2 : 0; // If this is the first message, initialize the splitMessageBuffer
      // with the internal command byte because our parseMessage function
      // seems to expect a command byte at the start

      if (splitMessageBuffer.length === 0) {
        splitMessageBuffer = new Uint8Array(1);
        splitMessageBuffer[0] = internalCommand;
      } // Collect new data into splitMessageBuffer


      const appendBuf = buffer.slice(0x1, 0x1 + size);
      const mergedBuf = new Uint8Array(splitMessageBuffer.length + appendBuf.length);
      mergedBuf.set(splitMessageBuffer);
      mergedBuf.set(appendBuf, splitMessageBuffer.length);
      splitMessageBuffer = mergedBuf;

      if (isLastMessage) {
        var _splitMessageBuffer$;

        commandByte = (_splitMessageBuffer$ = splitMessageBuffer[0]) != null ? _splitMessageBuffer$ : 0;
        buffer = splitMessageBuffer;
        splitMessageBuffer = new Uint8Array(0);
      }
    }

    const parsedPayload = parseMessage(commandByte, buffer);
    const shouldStop = callback(commandByte, parsedPayload, buffer);

    if (shouldStop) {
      break;
    }

    readPosition += advanceAmount;
  }

  return readPosition;
}
function parseMessage(command, payload) {
  const view = new DataView(payload.buffer);

  switch (command) {
    case exports.Command.GAME_START:
      const getPlayerObject = playerIndex => {
        // Controller Fix stuff
        const cfOffset = playerIndex * 0x8;
        const dashback = readUint32(view, 0x141 + cfOffset);
        const shieldDrop = readUint32(view, 0x145 + cfOffset);
        let controllerFix = "None";

        if (dashback !== shieldDrop) {
          controllerFix = "Mixed";
        } else if (dashback === 1) {
          controllerFix = "UCF";
        } else if (dashback === 2) {
          controllerFix = "Dween";
        } // Nametag stuff


        const nametagLength = 0x10;
        const nametagOffset = playerIndex * nametagLength;
        const nametagStart = 0x161 + nametagOffset;
        const nametagBuf = payload.slice(nametagStart, nametagStart + nametagLength);
        const nameTagString = iconv__default["default"].decode(nametagBuf, "Shift_JIS").split("\0").shift();
        const nametag = nameTagString ? toHalfwidth(nameTagString) : ""; // Display name

        const displayNameLength = 0x1f;
        const displayNameOffset = playerIndex * displayNameLength;
        const displayNameStart = 0x1a5 + displayNameOffset;
        const displayNameBuf = payload.slice(displayNameStart, displayNameStart + displayNameLength);
        const displayNameString = iconv__default["default"].decode(displayNameBuf, "Shift_JIS").split("\0").shift();
        const displayName = displayNameString ? toHalfwidth(displayNameString) : ""; // Connect code

        const connectCodeLength = 0xa;
        const connectCodeOffset = playerIndex * connectCodeLength;
        const connectCodeStart = 0x221 + connectCodeOffset;
        const connectCodeBuf = payload.slice(connectCodeStart, connectCodeStart + connectCodeLength);
        const connectCodeString = iconv__default["default"].decode(connectCodeBuf, "Shift_JIS").split("\0").shift();
        const connectCode = connectCodeString ? toHalfwidth(connectCodeString) : "";
        const userIdLength = 0x1d;
        const userIdOffset = playerIndex * userIdLength;
        const userIdStart = 0x249 + userIdOffset;
        const userIdBuf = payload.slice(userIdStart, userIdStart + userIdLength);
        const userIdString = iconv__default["default"].decode(userIdBuf, "utf8").split("\0").shift();
        const userId = userIdString != null ? userIdString : "";
        const offset = playerIndex * 0x24;
        return {
          playerIndex,
          port: playerIndex + 1,
          characterId: readUint8(view, 0x65 + offset),
          type: readUint8(view, 0x66 + offset),
          startStocks: readUint8(view, 0x67 + offset),
          characterColor: readUint8(view, 0x68 + offset),
          teamShade: readUint8(view, 0x6c + offset),
          handicap: readUint8(view, 0x6d + offset),
          teamId: readUint8(view, 0x6e + offset),
          staminaMode: Boolean(readUint8(view, 0x6c + playerIndex * 0x24, 0x01)),
          silentCharacter: Boolean(readUint8(view, 0x6c + playerIndex * 0x24, 0x02)),
          lowGravity: Boolean(readUint8(view, 0x6c + playerIndex * 0x24, 0x04)),
          invisible: Boolean(readUint8(view, 0x6c + playerIndex * 0x24, 0x08)),
          blackStockIcon: Boolean(readUint8(view, 0x6c + playerIndex * 0x24, 0x10)),
          metal: Boolean(readUint8(view, 0x6c + playerIndex * 0x24, 0x20)),
          startOnAngelPlatform: Boolean(readUint8(view, 0x6c + playerIndex * 0x24, 0x40)),
          rumbleEnabled: Boolean(readUint8(view, 0x6c + playerIndex * 0x24, 0x80)),
          cpuLevel: readUint8(view, 0x74 + offset),
          offenseRatio: readFloat(view, 0x7d + offset),
          defenseRatio: readFloat(view, 0x81 + offset),
          modelScale: readFloat(view, 0x85 + offset),
          controllerFix,
          nametag,
          displayName,
          connectCode,
          userId
        };
      };

      const matchIdLength = 51;
      const matchIdStart = 0x2be;
      const matchIdBuf = payload.slice(matchIdStart, matchIdStart + matchIdLength);
      const matchIdString = iconv__default["default"].decode(matchIdBuf, "utf8").split("\0").shift();
      const matchId = matchIdString != null ? matchIdString : "";
      return {
        slpVersion: `${readUint8(view, 0x1)}.${readUint8(view, 0x2)}.${readUint8(view, 0x3)}`,
        timerType: readUint8(view, 0x5, 0x03),
        inGameMode: readUint8(view, 0x5, 0xe0),
        friendlyFireEnabled: !!readUint8(view, 0x6, 0x01),
        isTeams: readBool(view, 0xd),
        itemSpawnBehavior: readUint8(view, 0x10),
        stageId: readUint16(view, 0x13),
        startingTimerSeconds: readUint32(view, 0x15),
        enabledItems: getEnabledItems(view),
        players: [0, 1, 2, 3].map(getPlayerObject),
        scene: readUint8(view, 0x1a3),
        gameMode: readUint8(view, 0x1a4),
        language: readUint8(view, 0x2bd),
        gameInfoBlock: getGameInfoBlock(view),
        randomSeed: readUint32(view, 0x13d),
        isPAL: readBool(view, 0x1a1),
        isFrozenPS: readBool(view, 0x1a2),
        matchInfo: {
          matchId,
          gameNumber: readUint32(view, 0x2f1),
          tiebreakerNumber: readUint32(view, 0x2f5)
        }
      };

    case exports.Command.FRAME_START:
      return {
        frame: readInt32(view, 0x1),
        seed: readUint32(view, 0x5),
        sceneFrameCounter: readUint32(view, 0x9)
      };

    case exports.Command.PRE_FRAME_UPDATE:
      return {
        frame: readInt32(view, 0x1),
        playerIndex: readUint8(view, 0x5),
        isFollower: readBool(view, 0x6),
        seed: readUint32(view, 0x7),
        actionStateId: readUint16(view, 0xb),
        positionX: readFloat(view, 0xd),
        positionY: readFloat(view, 0x11),
        facingDirection: readFloat(view, 0x15),
        joystickX: readFloat(view, 0x19),
        joystickY: readFloat(view, 0x1d),
        cStickX: readFloat(view, 0x21),
        cStickY: readFloat(view, 0x25),
        trigger: readFloat(view, 0x29),
        buttons: readUint32(view, 0x2d),
        physicalButtons: readUint16(view, 0x31),
        physicalLTrigger: readFloat(view, 0x33),
        physicalRTrigger: readFloat(view, 0x37),
        rawJoystickX: readInt8(view, 0x3b),
        percent: readFloat(view, 0x3c)
      };

    case exports.Command.POST_FRAME_UPDATE:
      const selfInducedSpeeds = {
        airX: readFloat(view, 0x35),
        y: readFloat(view, 0x39),
        attackX: readFloat(view, 0x3d),
        attackY: readFloat(view, 0x41),
        groundX: readFloat(view, 0x45)
      };
      return {
        frame: readInt32(view, 0x1),
        playerIndex: readUint8(view, 0x5),
        isFollower: readBool(view, 0x6),
        internalCharacterId: readUint8(view, 0x7),
        actionStateId: readUint16(view, 0x8),
        positionX: readFloat(view, 0xa),
        positionY: readFloat(view, 0xe),
        facingDirection: readFloat(view, 0x12),
        percent: readFloat(view, 0x16),
        shieldSize: readFloat(view, 0x1a),
        lastAttackLanded: readUint8(view, 0x1e),
        currentComboCount: readUint8(view, 0x1f),
        lastHitBy: readUint8(view, 0x20),
        stocksRemaining: readUint8(view, 0x21),
        actionStateCounter: readFloat(view, 0x22),
        miscActionState: readFloat(view, 0x2b),
        isAirborne: readBool(view, 0x2f),
        lastGroundId: readUint16(view, 0x30),
        jumpsRemaining: readUint8(view, 0x32),
        lCancelStatus: readUint8(view, 0x33),
        hurtboxCollisionState: readUint8(view, 0x34),
        selfInducedSpeeds: selfInducedSpeeds,
        hitlagRemaining: readFloat(view, 0x49),
        animationIndex: readUint32(view, 0x4d)
      };

    case exports.Command.ITEM_UPDATE:
      return {
        frame: readInt32(view, 0x1),
        typeId: readUint16(view, 0x5),
        state: readUint8(view, 0x7),
        facingDirection: readFloat(view, 0x8),
        velocityX: readFloat(view, 0xc),
        velocityY: readFloat(view, 0x10),
        positionX: readFloat(view, 0x14),
        positionY: readFloat(view, 0x18),
        damageTaken: readUint16(view, 0x1c),
        expirationTimer: readFloat(view, 0x1e),
        spawnId: readUint32(view, 0x22),
        missileType: readUint8(view, 0x26),
        turnipFace: readUint8(view, 0x27),
        chargeShotLaunched: readUint8(view, 0x28),
        chargePower: readUint8(view, 0x29),
        owner: readInt8(view, 0x2a)
      };

    case exports.Command.FRAME_BOOKEND:
      return {
        frame: readInt32(view, 0x1),
        latestFinalizedFrame: readInt32(view, 0x5)
      };

    case exports.Command.GAME_END:
      const placements = [0, 1, 2, 3].map(playerIndex => {
        const position = readInt8(view, 0x3 + playerIndex);
        return {
          playerIndex,
          position
        };
      });
      return {
        gameEndMethod: readUint8(view, 0x1),
        lrasInitiatorIndex: readInt8(view, 0x2),
        placements
      };

    case exports.Command.GECKO_LIST:
      const codes = [];
      let pos = 1;

      while (pos < payload.length) {
        var _readUint3;

        const word1 = (_readUint3 = readUint32(view, pos)) != null ? _readUint3 : 0;
        const codetype = word1 >> 24 & 0xfe;
        const address = (word1 & 0x01ffffff) + 0x80000000;
        let offset = 8; // Default code length, most codes are this length

        if (codetype === 0xc0 || codetype === 0xc2) {
          var _readUint4;

          const lineCount = (_readUint4 = readUint32(view, pos + 4)) != null ? _readUint4 : 0;
          offset = 8 + lineCount * 8;
        } else if (codetype === 0x06) {
          var _readUint5;

          const byteLen = (_readUint5 = readUint32(view, pos + 4)) != null ? _readUint5 : 0;
          offset = 8 + (byteLen + 7 & 0xfffffff8);
        } else if (codetype === 0x08) {
          offset = 16;
        }

        codes.push({
          type: codetype,
          address: address,
          contents: payload.slice(pos, pos + offset)
        });
        pos += offset;
      }

      return {
        contents: payload.slice(1),
        codes: codes
      };

    default:
      return null;
  }
}

function canReadFromView(view, offset, length) {
  const viewLength = view.byteLength;
  return offset + length <= viewLength;
}

function readFloat(view, offset) {
  if (!canReadFromView(view, offset, 4)) {
    return null;
  }

  return view.getFloat32(offset);
}

function readInt32(view, offset) {
  if (!canReadFromView(view, offset, 4)) {
    return null;
  }

  return view.getInt32(offset);
}

function readInt8(view, offset) {
  if (!canReadFromView(view, offset, 1)) {
    return null;
  }

  return view.getInt8(offset);
}

function readUint32(view, offset) {
  if (!canReadFromView(view, offset, 4)) {
    return null;
  }

  return view.getUint32(offset);
}

function readUint16(view, offset) {
  if (!canReadFromView(view, offset, 2)) {
    return null;
  }

  return view.getUint16(offset);
}

function readUint8(view, offset, bitmask = 0xff) {
  if (!canReadFromView(view, offset, 1)) {
    return null;
  }

  return view.getUint8(offset) & bitmask;
}

function readBool(view, offset) {
  if (!canReadFromView(view, offset, 1)) {
    return null;
  }

  return !!view.getUint8(offset);
}

function getMetadata(slpFile) {
  if (slpFile.metadataLength <= 0) {
    // This will happen on a severed incomplete file
    // $FlowFixMe
    return null;
  }

  const buffer = new Uint8Array(slpFile.metadataLength);
  readRef(slpFile.ref, buffer, 0, buffer.length, slpFile.metadataPosition);
  let metadata = null;

  try {
    metadata = ubjson.decode(buffer);
  } catch (ex) {// Do nothing
    // console.log(ex);
  } // $FlowFixMe


  return metadata;
}
function getGameEnd(slpFile) {
  const {
    ref,
    rawDataPosition,
    rawDataLength,
    messageSizes
  } = slpFile;
  const gameEndPayloadSize = messageSizes[exports.Command.GAME_END];

  if (!exists(gameEndPayloadSize) || gameEndPayloadSize <= 0) {
    return null;
  } // Add one to account for command byte


  const gameEndSize = gameEndPayloadSize + 1;
  const gameEndPosition = rawDataPosition + rawDataLength - gameEndSize;
  const buffer = new Uint8Array(gameEndSize);
  readRef(ref, buffer, 0, buffer.length, gameEndPosition);

  if (buffer[0] !== exports.Command.GAME_END) {
    // This isn't even a game end payload
    return null;
  }

  const gameEndMessage = parseMessage(exports.Command.GAME_END, buffer);

  if (!gameEndMessage) {
    return null;
  }

  return gameEndMessage;
}
function extractFinalPostFrameUpdates(slpFile) {
  const {
    ref,
    rawDataPosition,
    rawDataLength,
    messageSizes
  } = slpFile; // The following should exist on all replay versions

  const postFramePayloadSize = messageSizes[exports.Command.POST_FRAME_UPDATE];
  const gameEndPayloadSize = messageSizes[exports.Command.GAME_END];
  const frameBookendPayloadSize = messageSizes[exports.Command.FRAME_BOOKEND]; // Technically this should not be possible

  if (!exists(postFramePayloadSize)) {
    return [];
  }

  const gameEndSize = gameEndPayloadSize ? gameEndPayloadSize + 1 : 0;
  const postFrameSize = postFramePayloadSize + 1;
  const frameBookendSize = frameBookendPayloadSize ? frameBookendPayloadSize + 1 : 0;
  let frameNum = null;
  let postFramePosition = rawDataPosition + rawDataLength - gameEndSize - frameBookendSize - postFrameSize;
  const postFrameUpdates = [];

  do {
    const buffer = new Uint8Array(postFrameSize);
    readRef(ref, buffer, 0, buffer.length, postFramePosition);

    if (buffer[0] !== exports.Command.POST_FRAME_UPDATE) {
      break;
    }

    const postFrameMessage = parseMessage(exports.Command.POST_FRAME_UPDATE, buffer);

    if (!postFrameMessage) {
      break;
    }

    if (frameNum === null) {
      frameNum = postFrameMessage.frame;
    } else if (frameNum !== postFrameMessage.frame) {
      // If post frame message is found but the frame doesn't match, it's not part of the final frame
      break;
    }

    postFrameUpdates.unshift(postFrameMessage);
    postFramePosition -= postFrameSize;
  } while (postFramePosition >= rawDataPosition);

  return postFrameUpdates;
}

exports.SlpStreamMode = void 0;

(function (SlpStreamMode) {
  SlpStreamMode["AUTO"] = "AUTO";
  SlpStreamMode["MANUAL"] = "MANUAL";
})(exports.SlpStreamMode || (exports.SlpStreamMode = {}));

const defaultSettings$1 = {
  suppressErrors: false,
  mode: exports.SlpStreamMode.AUTO
};
exports.SlpStreamEvent = void 0;

(function (SlpStreamEvent) {
  SlpStreamEvent["RAW"] = "slp-raw";
  SlpStreamEvent["COMMAND"] = "slp-command";
})(exports.SlpStreamEvent || (exports.SlpStreamEvent = {}));
/**
 * SlpStream is a writable stream of Slippi data. It passes the data being written in
 * and emits an event based on what kind of Slippi messages were processed.
 *
 * SlpStream emits two events: "slp-raw" and "slp-command". The "slp-raw" event emits the raw buffer
 * bytes whenever it processes each command. You can manually parse this or write it to a
 * file. The "slp-command" event returns the parsed payload which you can access the attributes.
 *
 * @class SlpStream
 * @extends {Writable}
 */


class SlpStream extends stream.Writable {
  // True only if in manual mode and the game has completed

  /**
   *Creates an instance of SlpStream.
   * @param {Partial<SlpStreamSettings>} [slpOptions]
   * @param {WritableOptions} [opts]
   * @memberof SlpStream
   */
  constructor(slpOptions, opts) {
    super(opts);
    this.gameEnded = false;
    this.settings = void 0;
    this.payloadSizes = null;
    this.previousBuffer = Buffer.from([]);
    this.settings = Object.assign({}, defaultSettings$1, slpOptions);
  }

  restart() {
    this.gameEnded = false;
    this.payloadSizes = null;
  } // eslint-disable-next-line @typescript-eslint/no-explicit-any


  _write(newData, encoding, callback) {
    if (encoding !== "buffer") {
      throw new Error(`Unsupported stream encoding. Expected 'buffer' got '${encoding}'.`);
    } // Join the current data with the old data


    const data = Uint8Array.from(Buffer.concat([this.previousBuffer, newData])); // Clear previous data

    this.previousBuffer = Buffer.from([]);
    const dataView = new DataView(data.buffer); // Iterate through the data

    let index = 0;

    while (index < data.length) {
      // We want to filter out the network messages
      if (Buffer.from(data.slice(index, index + 5)).toString() === NETWORK_MESSAGE) {
        index += 5;
        continue;
      } // Make sure we have enough data to read a full payload


      const command = dataView.getUint8(index);
      let payloadSize = 0;

      if (this.payloadSizes) {
        var _this$payloadSizes$ge;

        payloadSize = (_this$payloadSizes$ge = this.payloadSizes.get(command)) != null ? _this$payloadSizes$ge : 0;
      }

      const remainingLen = data.length - index;

      if (remainingLen < payloadSize + 1) {
        // If remaining length is not long enough for full payload, save the remaining
        // data until we receive more data. The data has been split up.
        this.previousBuffer = data.slice(index);
        break;
      } // Only process if the game is still going


      if (this.settings.mode === exports.SlpStreamMode.MANUAL && this.gameEnded) {
        break;
      } // Increment by one for the command byte


      index += 1;
      const payloadPtr = data.slice(index);
      const payloadDataView = new DataView(data.buffer, index);
      let payloadLen = 0;

      try {
        payloadLen = this._processCommand(command, payloadPtr, payloadDataView);
      } catch (err) {
        // Only throw the error if we're not suppressing the errors
        if (!this.settings.suppressErrors) {
          throw err;
        }

        payloadLen = 0;
      }

      index += payloadLen;
    }

    callback();
  }

  _writeCommand(command, entirePayload, payloadSize) {
    const payloadBuf = entirePayload.slice(0, payloadSize);
    const bufToWrite = Buffer.concat([Buffer.from([command]), payloadBuf]); // Forward the raw buffer onwards

    this.emit(exports.SlpStreamEvent.RAW, {
      command: command,
      payload: bufToWrite
    });
    return new Uint8Array(bufToWrite);
  }

  _processCommand(command, entirePayload, dataView) {
    // Handle the message size command
    if (command === exports.Command.MESSAGE_SIZES) {
      const payloadSize = dataView.getUint8(0); // Set the payload sizes

      this.payloadSizes = processReceiveCommands(dataView); // Emit the raw command event

      this._writeCommand(command, entirePayload, payloadSize);

      this.emit(exports.SlpStreamEvent.COMMAND, {
        command: command,
        payload: this.payloadSizes
      });
      return payloadSize;
    }

    let payloadSize = 0;

    if (this.payloadSizes) {
      var _this$payloadSizes$ge2;

      payloadSize = (_this$payloadSizes$ge2 = this.payloadSizes.get(command)) != null ? _this$payloadSizes$ge2 : 0;
    } // Fetch the payload and parse it


    let payload;
    let parsedPayload = null;

    if (payloadSize > 0) {
      payload = this._writeCommand(command, entirePayload, payloadSize);
      parsedPayload = parseMessage(command, payload);
    }

    if (!parsedPayload) {
      return payloadSize;
    }

    switch (command) {
      case exports.Command.GAME_END:
        // Stop parsing data until we manually restart the stream
        if (this.settings.mode === exports.SlpStreamMode.MANUAL) {
          this.gameEnded = true;
        }

        break;
    }

    this.emit(exports.SlpStreamEvent.COMMAND, {
      command: command,
      payload: parsedPayload
    });
    return payloadSize;
  }

}

const processReceiveCommands = dataView => {
  const payloadSizes = new Map();
  const payloadLen = dataView.getUint8(0);

  for (let i = 1; i < payloadLen; i += 3) {
    const commandByte = dataView.getUint8(i);
    const payloadSize = dataView.getUint16(i + 1);
    payloadSizes.set(commandByte, payloadSize);
  }

  return payloadSizes;
};

const DEFAULT_NICKNAME = "unknown";
/**
 * SlpFile is a class that wraps a Writable stream. It handles the writing of the binary
 * header and footer, and also handles the overwriting of the raw data length.
 *
 * @class SlpFile
 * @extends {Writable}
 */

class SlpFile extends stream.Writable {
  /**
   * Creates an instance of SlpFile.
   * @param {string} filePath The file location to write to.
   * @param {WritableOptions} [opts] Options for writing.
   * @memberof SlpFile
   */
  constructor(filePath, slpStream, opts) {
    super(opts);
    this.filePath = void 0;
    this.metadata = void 0;
    this.fileStream = null;
    this.rawDataLength = 0;
    this.slpStream = void 0;
    this.usesExternalStream = false;
    this.filePath = filePath;
    this.metadata = {
      consoleNickname: DEFAULT_NICKNAME,
      startTime: new Date(),
      lastFrame: -124,
      players: {}
    };
    this.usesExternalStream = Boolean(slpStream); // Create a new SlpStream if one wasn't already provided
    // This SLP stream represents a single game not multiple, so use manual mode

    this.slpStream = slpStream ? slpStream : new SlpStream({
      mode: exports.SlpStreamMode.MANUAL
    });

    this._setupListeners();

    this._initializeNewGame(this.filePath);
  }
  /**
   * Get the current file path being written to.
   *
   * @returns {string} The location of the current file path
   * @memberof SlpFile
   */


  path() {
    return this.filePath;
  }
  /**
   * Sets the metadata of the Slippi file, such as consoleNickname, lastFrame, and players.
   * @param metadata The metadata to be written
   */


  setMetadata(metadata) {
    this.metadata = Object.assign({}, this.metadata, metadata);
  }

  _write(chunk, encoding, callback) {
    if (encoding !== "buffer") {
      throw new Error(`Unsupported stream encoding. Expected 'buffer' got '${encoding}'.`);
    } // Write it to the file


    if (this.fileStream) {
      this.fileStream.write(chunk);
    } // Parse the data manually if it's an internal stream


    if (!this.usesExternalStream) {
      this.slpStream.write(chunk);
    } // Keep track of the bytes we've written


    this.rawDataLength += chunk.length;
    callback();
  }
  /**
   * Here we define what to do on each command. We need to populate the metadata field
   * so we keep track of the latest frame, as well as the number of frames each character has
   * been used.
   *
   * @param data The parsed data from a SlpStream
   */


  _onCommand(data) {
    const {
      command,
      payload
    } = data;

    switch (command) {
      case exports.Command.GAME_START:
        const {
          players
        } = payload;
        lodash.forEach(players, player => {
          if (player.type === 3) {
            return;
          }

          this.metadata.players[player.playerIndex] = {
            characterUsage: {},
            names: {
              netplay: player.displayName,
              code: player.connectCode
            }
          };
        });
        break;

      case exports.Command.POST_FRAME_UPDATE:
        // Here we need to update some metadata fields
        const {
          frame,
          playerIndex,
          isFollower,
          internalCharacterId
        } = payload;

        if (isFollower) {
          // No need to do this for follower
          break;
        } // Update frame index


        this.metadata.lastFrame = frame; // Update character usage

        const prevPlayer = this.metadata.players[playerIndex];
        const characterUsage = prevPlayer.characterUsage;
        const curCharFrames = characterUsage[internalCharacterId] || 0;
        const player = { ...prevPlayer,
          characterUsage: { ...characterUsage,
            [internalCharacterId]: curCharFrames + 1
          }
        };
        this.metadata.players[playerIndex] = player;
        break;
    }
  }

  _setupListeners() {
    const streamListener = data => {
      this._onCommand(data);
    };

    this.slpStream.on(exports.SlpStreamEvent.COMMAND, streamListener);
    this.on("finish", () => {
      // Update file with bytes written
      const fd = fs__default["default"].openSync(this.filePath, "r+");
      fs__default["default"].writeSync(fd, createUInt32Buffer(this.rawDataLength), 0, 4, 11);
      fs__default["default"].closeSync(fd); // Unsubscribe from the stream

      this.slpStream.removeListener(exports.SlpStreamEvent.COMMAND, streamListener); // Terminate the internal stream

      if (!this.usesExternalStream) {
        this.slpStream.end();
      }
    });
  }

  _initializeNewGame(filePath) {
    this.fileStream = fs__default["default"].createWriteStream(filePath, {
      encoding: "binary"
    });
    const header = Buffer.concat([Buffer.from("{U"), Buffer.from([3]), Buffer.from("raw[$U#l"), Buffer.from([0, 0, 0, 0])]);
    this.fileStream.write(header);
  }

  _final(callback) {
    let footer = Buffer.concat([Buffer.from("U"), Buffer.from([8]), Buffer.from("metadata{")]); // Write game start time

    const startTimeStr = this.metadata.startTime.toISOString();
    footer = Buffer.concat([footer, Buffer.from("U"), Buffer.from([7]), Buffer.from("startAtSU"), Buffer.from([startTimeStr.length]), Buffer.from(startTimeStr)]); // Write last frame index
    // TODO: Get last frame

    const lastFrame = this.metadata.lastFrame;
    footer = Buffer.concat([footer, Buffer.from("U"), Buffer.from([9]), Buffer.from("lastFramel"), createInt32Buffer(lastFrame)]); // write the Console Nickname

    const consoleNick = this.metadata.consoleNickname || DEFAULT_NICKNAME;
    footer = Buffer.concat([footer, Buffer.from("U"), Buffer.from([11]), Buffer.from("consoleNickSU"), Buffer.from([consoleNick.length]), Buffer.from(consoleNick)]); // Start writting player specific data

    footer = Buffer.concat([footer, Buffer.from("U"), Buffer.from([7]), Buffer.from("players{")]);
    const players = this.metadata.players;
    lodash.forEach(players, (player, index) => {
      // Start player obj with index being the player index
      footer = Buffer.concat([footer, Buffer.from("U"), Buffer.from([index.length]), Buffer.from(`${index}{`)]); // Start characters key for this player

      footer = Buffer.concat([footer, Buffer.from("U"), Buffer.from([10]), Buffer.from("characters{")]); // Write character usage

      lodash.forEach(player.characterUsage, (usage, internalId) => {
        // Write this character
        footer = Buffer.concat([footer, Buffer.from("U"), Buffer.from([internalId.length]), Buffer.from(`${internalId}l`), createUInt32Buffer(usage)]);
      }); // Close characters

      footer = Buffer.concat([footer, Buffer.from("}")]); // Start names key for this player

      footer = Buffer.concat([footer, Buffer.from("U"), Buffer.from([5]), Buffer.from("names{")]); // Write display name

      footer = Buffer.concat([footer, Buffer.from("U"), Buffer.from([7]), Buffer.from("netplaySU"), Buffer.from([player.names.netplay.length]), Buffer.from(`${player.names.netplay}`)]); // Write connect code

      footer = Buffer.concat([footer, Buffer.from("U"), Buffer.from([4]), Buffer.from("codeSU"), Buffer.from([player.names.code.length]), Buffer.from(`${player.names.code}`)]); // Close names and player

      footer = Buffer.concat([footer, Buffer.from("}}")]);
    }); // Close players

    footer = Buffer.concat([footer, Buffer.from("}")]); // Write played on

    footer = Buffer.concat([footer, Buffer.from("U"), Buffer.from([8]), Buffer.from("playedOnSU"), Buffer.from([7]), Buffer.from("network")]); // Close metadata and file

    footer = Buffer.concat([footer, Buffer.from("}}")]); // End the stream

    if (this.fileStream) {
      this.fileStream.write(footer, callback);
    }
  }

}

const createInt32Buffer = number => {
  const buf = Buffer.alloc(4);
  buf.writeInt32BE(number, 0);
  return buf;
};

const createUInt32Buffer = number => {
  const buf = Buffer.alloc(4);
  buf.writeUInt32BE(number, 0);
  return buf;
};

/**
 * The default function to use for generating new SLP files.
 */

function getNewFilePath(folder, date) {
  return path__default["default"].join(folder, `Game_${dateFns.format(date, "yyyyMMdd")}T${dateFns.format(date, "HHmmss")}.slp`);
}

const defaultSettings = {
  outputFiles: true,
  folderPath: ".",
  consoleNickname: "unknown",
  newFilename: getNewFilePath
};
exports.SlpFileWriterEvent = void 0;

(function (SlpFileWriterEvent) {
  SlpFileWriterEvent["NEW_FILE"] = "new-file";
  SlpFileWriterEvent["FILE_COMPLETE"] = "file-complete";
})(exports.SlpFileWriterEvent || (exports.SlpFileWriterEvent = {}));
/**
 * SlpFileWriter lets us not only emit events as an SlpStream but also
 * writes the data that is being passed in to an SLP file. Use this if
 * you want to process Slippi data in real time but also want to be able
 * to write out the data to an SLP file.
 *
 * @export
 * @class SlpFileWriter
 * @extends {SlpStream}
 */


class SlpFileWriter extends SlpStream {
  /**
   * Creates an instance of SlpFileWriter.
   */
  constructor(options, opts) {
    super(options, opts);
    this.currentFile = null;
    this.options = void 0;
    this.options = Object.assign({}, defaultSettings, options);

    this._setupListeners();
  }

  _writePayload(payload) {
    // Write data to the current file
    if (this.currentFile) {
      this.currentFile.write(payload);
    }
  }

  _setupListeners() {
    this.on(exports.SlpStreamEvent.RAW, data => {
      const {
        command,
        payload
      } = data;

      switch (command) {
        case exports.Command.MESSAGE_SIZES:
          // Create the new game first before writing the payload
          this._handleNewGame();

          this._writePayload(payload);

          break;

        case exports.Command.GAME_END:
          // Write payload first before ending the game
          this._writePayload(payload);

          this._handleEndGame();

          break;

        default:
          this._writePayload(payload);

          break;
      }
    });
  }
  /**
   * Return the name of the SLP file currently being written or null if
   * no file is being written to currently.
   *
   * @returns {(string | null)}
   * @memberof SlpFileWriter
   */


  getCurrentFilename() {
    if (this.currentFile !== null) {
      return path__default["default"].resolve(this.currentFile.path());
    }

    return null;
  }
  /**
   * Ends the current file being written to.
   *
   * @returns {(string | null)}
   * @memberof SlpFileWriter
   */


  endCurrentFile() {
    this._handleEndGame();
  }
  /**
   * Updates the settings to be the desired ones passed in.
   *
   * @param {Partial<SlpFileWriterOptions>} settings
   * @memberof SlpFileWriter
   */


  updateSettings(settings) {
    this.options = Object.assign({}, this.options, settings);
  }

  _handleNewGame() {
    // Only create a new file if we're outputting files
    if (this.options.outputFiles) {
      const filePath = this.options.newFilename(this.options.folderPath, new Date());
      this.currentFile = new SlpFile(filePath, this); // console.log(`Creating new file at: ${filePath}`);

      this.emit(exports.SlpFileWriterEvent.NEW_FILE, filePath);
    }
  }

  _handleEndGame() {
    // End the stream
    if (this.currentFile) {
      // Set the console nickname
      this.currentFile.setMetadata({
        consoleNickname: this.options.consoleNickname
      });
      this.currentFile.end(); // console.log(`Finished writing file: ${this.currentFile.path()}`);

      this.emit(exports.SlpFileWriterEvent.FILE_COMPLETE, this.currentFile.path()); // Clear current file

      this.currentFile = null;
    }
  }

}

class RollbackCounter {
  constructor() {
    this.rollbackFrames = {};
    this.rollbackFrameCount = 0;
    this.rollbackPlayerIdx = null;
    this.lastFrameWasRollback = false;
    this.currentRollbackLength = 0;
    this.rollbackLengths = [];
  }

  checkIfRollbackFrame(currentFrame, playerIdx) {
    if (this.rollbackPlayerIdx === null) {
      // we only want to follow a single player to avoid double counting. So we use whoever is on first.
      this.rollbackPlayerIdx = playerIdx;
    } else if (this.rollbackPlayerIdx !== playerIdx) {
      return;
    }

    if (currentFrame && currentFrame.players) {
      // frame already exists for currentFrameNumber so we must be rolling back
      // Note: We detect during PreFrameUpdate, but new versions have a
      // FrameStart command that has already initialized the frame, so we must
      // check for player data too.
      if (this.rollbackFrames[currentFrame.frame]) {
        this.rollbackFrames[currentFrame.frame].push(currentFrame);
      } else {
        this.rollbackFrames[currentFrame.frame] = [currentFrame];
      }

      this.rollbackFrameCount++;
      this.currentRollbackLength++;
      this.lastFrameWasRollback = true;
    } else if (this.lastFrameWasRollback) {
      this.rollbackLengths.push(this.currentRollbackLength);
      this.currentRollbackLength = 0;
      this.lastFrameWasRollback = false;
    }

    return this.lastFrameWasRollback;
  }

  getFrames() {
    return this.rollbackFrames;
  }

  getCount() {
    return this.rollbackFrameCount;
  }

  getLengths() {
    return this.rollbackLengths;
  }

}

const ITEM_SETTINGS_BIT_COUNT = 40;
const MAX_ROLLBACK_FRAMES = 7;
exports.SlpParserEvent = void 0;

(function (SlpParserEvent) {
  SlpParserEvent["SETTINGS"] = "settings";
  SlpParserEvent["END"] = "end";
  SlpParserEvent["FRAME"] = "frame";
  SlpParserEvent["FINALIZED_FRAME"] = "finalized-frame";
  SlpParserEvent["ROLLBACK_FRAME"] = "rollback-frame";
})(exports.SlpParserEvent || (exports.SlpParserEvent = {})); // If strict mode is on, we will do strict validation checking
// which could throw errors on invalid data.
// Default to false though since probably only real time applications
// would care about valid data.


const defaultSlpParserOptions = {
  strict: false
};
class SlpParser extends events.EventEmitter {
  constructor(options) {
    super();
    this.frames = {};
    this.rollbackCounter = new RollbackCounter();
    this.settings = null;
    this.gameEnd = null;
    this.latestFrameIndex = null;
    this.settingsComplete = false;
    this.lastFinalizedFrame = exports.Frames.FIRST - 1;
    this.options = void 0;
    this.geckoList = null;
    this.options = Object.assign({}, defaultSlpParserOptions, options);
  } // eslint-disable-next-line @typescript-eslint/no-explicit-any


  handleCommand(command, payload) {
    switch (command) {
      case exports.Command.GAME_START:
        this._handleGameStart(payload);

        break;

      case exports.Command.FRAME_START:
        this._handleFrameStart(payload);

        break;

      case exports.Command.POST_FRAME_UPDATE:
        // We need to handle the post frame update first since that
        // will finalize the settings object, before we fire the frame update
        this._handlePostFrameUpdate(payload);

        this._handleFrameUpdate(command, payload);

        break;

      case exports.Command.PRE_FRAME_UPDATE:
        this._handleFrameUpdate(command, payload);

        break;

      case exports.Command.ITEM_UPDATE:
        this._handleItemUpdate(payload);

        break;

      case exports.Command.FRAME_BOOKEND:
        this._handleFrameBookend(payload);

        break;

      case exports.Command.GAME_END:
        this._handleGameEnd(payload);

        break;

      case exports.Command.GECKO_LIST:
        this._handleGeckoList(payload);

        break;
    }
  }
  /**
   * Resets the parser state to their default values.
   */


  reset() {
    this.frames = {};
    this.settings = null;
    this.gameEnd = null;
    this.latestFrameIndex = null;
    this.settingsComplete = false;
    this.lastFinalizedFrame = exports.Frames.FIRST - 1;
  }

  getLatestFrameNumber() {
    var _this$latestFrameInde;

    return (_this$latestFrameInde = this.latestFrameIndex) != null ? _this$latestFrameInde : exports.Frames.FIRST - 1;
  }

  getPlayableFrameCount() {
    if (this.latestFrameIndex === null) {
      return 0;
    }

    return this.latestFrameIndex < exports.Frames.FIRST_PLAYABLE ? 0 : this.latestFrameIndex - exports.Frames.FIRST_PLAYABLE;
  }

  getLatestFrame() {
    // return this.playerFrames[this.latestFrameIndex];
    // TODO: Modify this to check if we actually have all the latest frame data and return that
    // TODO: If we do. For now I'm just going to take a shortcut
    const allFrames = this.getFrames();
    const frameIndex = this.latestFrameIndex !== null ? this.latestFrameIndex : exports.Frames.FIRST;
    const indexToUse = this.gameEnd ? frameIndex : frameIndex - 1;
    return lodash.get(allFrames, indexToUse) || null;
  }

  getSettings() {
    return this.settingsComplete ? this.settings : null;
  }

  getItems() {
    var _this$settings, _this$settings2;

    if (((_this$settings = this.settings) == null ? void 0 : _this$settings.itemSpawnBehavior) === exports.ItemSpawnType.OFF) {
      return null;
    }

    const itemBitfield = (_this$settings2 = this.settings) == null ? void 0 : _this$settings2.enabledItems;

    if (!exists(itemBitfield)) {
      return null;
    }

    const enabledItems = []; // Ideally we would be able to do this with bitshifting instead, but javascript
    // truncates numbers after 32 bits when doing bitwise operations

    for (let i = 0; i < ITEM_SETTINGS_BIT_COUNT; i++) {
      if (Math.floor(itemBitfield / 2 ** i) & 1) {
        enabledItems.push(2 ** i);
      }
    }

    return enabledItems;
  }

  getGameEnd() {
    return this.gameEnd;
  }

  getFrames() {
    return this.frames;
  }

  getRollbackFrames() {
    return {
      frames: this.rollbackCounter.getFrames(),
      count: this.rollbackCounter.getCount(),
      lengths: this.rollbackCounter.getLengths()
    };
  }

  getFrame(num) {
    return this.frames[num] || null;
  }

  getGeckoList() {
    return this.geckoList;
  }

  _handleGeckoList(payload) {
    this.geckoList = payload;
  }

  _handleGameEnd(payload) {
    // Finalize remaining frames if necessary
    if (this.latestFrameIndex !== null && this.latestFrameIndex !== this.lastFinalizedFrame) {
      this._finalizeFrames(this.latestFrameIndex);
    }

    payload = payload;
    this.gameEnd = payload;
    this.emit(exports.SlpParserEvent.END, this.gameEnd);
  }

  _handleGameStart(payload) {
    this.settings = payload;
    const players = payload.players;
    this.settings.players = players.filter(player => player.type !== 3); // Check to see if the file was created after the sheik fix so we know
    // we don't have to process the first frame of the game for the full settings

    if (payload.slpVersion && semver__default["default"].gte(payload.slpVersion, "1.6.0")) {
      this._completeSettings();
    }
  }

  _handleFrameStart(payload) {
    const currentFrameNumber = payload.frame;
    lodash.set(this.frames, [currentFrameNumber, "start"], payload);
  }

  _handlePostFrameUpdate(payload) {
    if (this.settingsComplete) {
      return;
    } // Finish calculating settings


    if (payload.frame <= exports.Frames.FIRST) {
      const playerIndex = payload.playerIndex;
      const playersByIndex = lodash.keyBy(this.settings.players, "playerIndex");

      switch (payload.internalCharacterId) {
        case 0x7:
          playersByIndex[playerIndex].characterId = 0x13; // Sheik

          break;

        case 0x13:
          playersByIndex[playerIndex].characterId = 0x12; // Zelda

          break;
      }
    }

    if (payload.frame > exports.Frames.FIRST) {
      this._completeSettings();
    }
  }

  _handleFrameUpdate(command, payload) {
    payload = payload;
    const location = command === exports.Command.PRE_FRAME_UPDATE ? "pre" : "post";
    const field = payload.isFollower ? "followers" : "players";
    const currentFrameNumber = payload.frame;
    this.latestFrameIndex = currentFrameNumber;

    if (location === "pre" && !payload.isFollower) {
      const currentFrame = this.frames[currentFrameNumber];
      const wasRolledback = this.rollbackCounter.checkIfRollbackFrame(currentFrame, payload.playerIndex);

      if (wasRolledback) {
        // frame is about to be overwritten
        this.emit(exports.SlpParserEvent.ROLLBACK_FRAME, currentFrame);
      }
    }

    lodash.set(this.frames, [currentFrameNumber, field, payload.playerIndex, location], payload);
    lodash.set(this.frames, [currentFrameNumber, "frame"], currentFrameNumber); // If file is from before frame bookending, add frame to stats computer here. Does a little
    // more processing than necessary, but it works

    const settings = this.getSettings();

    if (settings && (!settings.slpVersion || semver__default["default"].lte(settings.slpVersion, "2.2.0"))) {
      this.emit(exports.SlpParserEvent.FRAME, this.frames[currentFrameNumber]); // Finalize the previous frame since no bookending exists

      this._finalizeFrames(currentFrameNumber - 1);
    } else {
      lodash.set(this.frames, [currentFrameNumber, "isTransferComplete"], false);
    }
  }

  _handleItemUpdate(payload) {
    var _this$frames$currentF, _this$frames$currentF2;

    const currentFrameNumber = payload.frame;
    const items = (_this$frames$currentF = (_this$frames$currentF2 = this.frames[currentFrameNumber]) == null ? void 0 : _this$frames$currentF2.items) != null ? _this$frames$currentF : [];
    items.push(payload); // Set items with newest

    lodash.set(this.frames, [currentFrameNumber, "items"], items);
  }

  _handleFrameBookend(payload) {
    const latestFinalizedFrame = payload.latestFinalizedFrame;
    const currentFrameNumber = payload.frame;
    lodash.set(this.frames, [currentFrameNumber, "isTransferComplete"], true); // Fire off a normal frame event

    this.emit(exports.SlpParserEvent.FRAME, this.frames[currentFrameNumber]); // Finalize frames if necessary

    const validLatestFrame = this.settings.gameMode === exports.GameMode.ONLINE;

    if (validLatestFrame && latestFinalizedFrame >= exports.Frames.FIRST) {
      // Ensure valid latestFinalizedFrame
      if (this.options.strict && latestFinalizedFrame < currentFrameNumber - MAX_ROLLBACK_FRAMES) {
        throw new Error(`latestFinalizedFrame should be within ${MAX_ROLLBACK_FRAMES} frames of ${currentFrameNumber}`);
      }

      this._finalizeFrames(latestFinalizedFrame);
    } else {
      // Since we don't have a valid finalized frame, just finalize the frame based on MAX_ROLLBACK_FRAMES
      this._finalizeFrames(currentFrameNumber - MAX_ROLLBACK_FRAMES);
    }
  }
  /**
   * Fires off the FINALIZED_FRAME event for frames up until a certain number
   * @param num The frame to finalize until
   */


  _finalizeFrames(num) {
    while (this.lastFinalizedFrame < num) {
      const frameToFinalize = this.lastFinalizedFrame + 1;
      const frame = this.getFrame(frameToFinalize); // Check that we have all the pre and post frame data for all players if we're in strict mode

      if (this.options.strict) {
        for (const player of this.settings.players) {
          const playerFrameInfo = frame.players[player.playerIndex]; // Allow player frame info to be empty in non 1v1 games since
          // players which have been defeated will have no frame info.

          if (this.settings.players.length > 2 && !playerFrameInfo) {
            continue;
          }

          const {
            pre,
            post
          } = playerFrameInfo;

          if (!pre || !post) {
            const preOrPost = pre ? "pre" : "post";
            throw new Error(`Could not finalize frame ${frameToFinalize} of ${num}: missing ${preOrPost}-frame update for player ${player.playerIndex}`);
          }
        }
      } // Our frame is complete so finalize the frame


      this.emit(exports.SlpParserEvent.FINALIZED_FRAME, frame);
      this.lastFinalizedFrame = frameToFinalize;
    }
  }

  _completeSettings() {
    if (!this.settingsComplete) {
      this.settingsComplete = true;
      this.emit(exports.SlpParserEvent.SETTINGS, this.settings);
    }
  }

}

function getWinners(gameEnd, settings, finalPostFrameUpdates) {
  var _players$find$teamId, _players$find2;

  const {
    placements,
    gameEndMethod,
    lrasInitiatorIndex
  } = gameEnd;
  const {
    players,
    isTeams
  } = settings;

  if (gameEndMethod === exports.GameEndMethod.NO_CONTEST || gameEndMethod === exports.GameEndMethod.UNRESOLVED) {
    // The winner is the person who didn't LRAS
    if (exists(lrasInitiatorIndex) && players.length === 2) {
      var _players$find;

      const winnerIndex = (_players$find = players.find(({
        playerIndex
      }) => playerIndex !== lrasInitiatorIndex)) == null ? void 0 : _players$find.playerIndex;

      if (exists(winnerIndex)) {
        return [{
          playerIndex: winnerIndex,
          position: 0
        }];
      }
    }

    return [];
  }

  if (gameEndMethod === exports.GameEndMethod.TIME && players.length === 2) {
    const nonFollowerUpdates = finalPostFrameUpdates.filter(pfu => !pfu.isFollower);

    if (nonFollowerUpdates.length !== players.length) {
      return [];
    }

    const p1 = nonFollowerUpdates[0];
    const p2 = nonFollowerUpdates[1];

    if (p1.stocksRemaining > p2.stocksRemaining) {
      return [{
        playerIndex: p1.playerIndex,
        position: 0
      }];
    } else if (p2.stocksRemaining > p1.stocksRemaining) {
      return [{
        playerIndex: p2.playerIndex,
        position: 0
      }];
    }

    const p1Health = Math.trunc(p1.percent);
    const p2Health = Math.trunc(p2.percent);

    if (p1Health < p2Health) {
      return [{
        playerIndex: p1.playerIndex,
        position: 0
      }];
    } else if (p2Health < p1Health) {
      return [{
        playerIndex: p2.playerIndex,
        position: 0
      }];
    } // If stocks and percents were tied, no winner


    return [];
  }

  const firstPosition = placements.find(placement => placement.position === 0);

  if (!firstPosition) {
    return [];
  }

  const winningTeam = (_players$find$teamId = (_players$find2 = players.find(({
    playerIndex
  }) => playerIndex === firstPosition.playerIndex)) == null ? void 0 : _players$find2.teamId) != null ? _players$find$teamId : null;

  if (isTeams && exists(winningTeam)) {
    return placements.filter(placement => {
      var _players$find$teamId2, _players$find3;

      const teamId = (_players$find$teamId2 = (_players$find3 = players.find(({
        playerIndex
      }) => playerIndex === placement.playerIndex)) == null ? void 0 : _players$find3.teamId) != null ? _players$find$teamId2 : null;
      return teamId === winningTeam;
    });
  }

  return [firstPosition];
}

const SANDBAG_INTERNAL_ID = 32;
const FEET_CONVERSION_FACTOR = 0.952462;
const METERS_CONVERSION_FACTOR = 1.04167;
function positionToHomeRunDistance(distance, units = "feet") {
  let score = 0;

  switch (units) {
    case "feet":
      score = 10 * Math.floor(distance - 70 * FEET_CONVERSION_FACTOR); // convert to float32

      score = Math.fround(score);
      score = Math.floor(score / 30.4788 * 10) / 10;
      break;

    case "meters":
      score = 10 * Math.floor(distance - 70 * METERS_CONVERSION_FACTOR); // convert to float32

      score = Math.fround(score);
      score = Math.floor(score / 100 * 10) / 10;
      break;

    default:
      throw new Error(`Unsupported units: ${units}`);
  } // round to 1 decimal


  score = Math.round(score * 10) / 10;
  return Math.max(0, score);
}
function extractDistanceInfoFromFrame(settings, lastFrame) {
  var _sandbagLastFrame$pos;

  const sandbagLastFrame = Object.values(lastFrame.players).filter(exists).find(playerFrame => playerFrame.post.internalCharacterId === SANDBAG_INTERNAL_ID);

  if (!sandbagLastFrame) {
    return null;
  } // Only return the distance in meters if it's a Japanese replay.
  // Technically we should check if the replay is PAL but we don't yet support
  // stadium replays in PAL.


  const units = settings.language === exports.Language.JAPANESE ? "meters" : "feet";
  const distance = positionToHomeRunDistance((_sandbagLastFrame$pos = sandbagLastFrame.post.positionX) != null ? _sandbagLastFrame$pos : 0, units);
  return {
    distance,
    units
  };
}

/**
 * Slippi Game class that wraps a file
 */

class SlippiGame {
  constructor(input, opts) {
    this.input = void 0;
    this.metadata = null;
    this.finalStats = null;
    this.parser = void 0;
    this.readPosition = null;
    this.actionsComputer = new ActionsComputer();
    this.conversionComputer = new ConversionComputer();
    this.comboComputer = new ComboComputer();
    this.stockComputer = new StockComputer();
    this.inputComputer = new InputComputer();
    this.targetBreakComputer = new TargetBreakComputer();
    this.statsComputer = void 0;

    if (typeof input === "string") {
      this.input = {
        source: exports.SlpInputSource.FILE,
        filePath: input
      };
    } else if (input instanceof Buffer) {
      this.input = {
        source: exports.SlpInputSource.BUFFER,
        buffer: input
      };
    } else if (input instanceof ArrayBuffer) {
      this.input = {
        source: exports.SlpInputSource.BUFFER,
        buffer: Buffer.from(input)
      };
    } else {
      throw new Error("Cannot create SlippiGame with input of that type");
    } // Set up stats calculation


    this.statsComputer = new Stats(opts);
    this.statsComputer.register(this.actionsComputer, this.comboComputer, this.conversionComputer, this.inputComputer, this.stockComputer, this.targetBreakComputer);
    this.parser = new SlpParser();
    this.parser.on(exports.SlpParserEvent.SETTINGS, settings => {
      this.statsComputer.setup(settings);
    }); // Use finalized frames for stats computation

    this.parser.on(exports.SlpParserEvent.FINALIZED_FRAME, frame => {
      this.statsComputer.addFrame(frame);
    });
  }

  _process(shouldStop = () => false, file) {
    if (this.parser.getGameEnd() !== null) {
      return;
    }

    const slpfile = file != null ? file : openSlpFile(this.input); // Generate settings from iterating through file

    this.readPosition = iterateEvents(slpfile, (command, payload) => {
      if (!payload) {
        // If payload is falsy, keep iterating. The parser probably just doesn't know
        // about this command yet
        return false;
      }

      this.parser.handleCommand(command, payload);
      return shouldStop(command, payload);
    }, this.readPosition);

    if (!file) {
      closeSlpFile(slpfile);
    }
  }
  /**
   * Gets the game settings, these are the settings that describe the starting state of
   * the game such as characters, stage, etc.
   */


  getSettings() {
    // Settings is only complete after post-frame update
    this._process(() => this.parser.getSettings() !== null);

    return this.parser.getSettings();
  }

  getItems() {
    this._process();

    return this.parser.getItems();
  }

  getLatestFrame() {
    this._process();

    return this.parser.getLatestFrame();
  }

  getGameEnd(options = {}) {
    if (options != null && options.skipProcessing) {
      // Read game end block directly
      const slpfile = openSlpFile(this.input);
      const gameEnd = getGameEnd(slpfile);
      closeSlpFile(slpfile);
      return gameEnd;
    }

    this._process();

    return this.parser.getGameEnd();
  }

  getFrames() {
    this._process();

    return this.parser.getFrames();
  }

  getRollbackFrames() {
    this._process();

    return this.parser.getRollbackFrames();
  }

  getGeckoList() {
    this._process(() => this.parser.getGeckoList() !== null);

    return this.parser.getGeckoList();
  }

  getStats() {
    if (this.finalStats) {
      return this.finalStats;
    }

    this._process();

    const settings = this.parser.getSettings();

    if (!settings) {
      return null;
    } // Finish processing if we're not up to date


    this.statsComputer.process();
    const inputs = this.inputComputer.fetch();
    const stocks = this.stockComputer.fetch();
    const conversions = this.conversionComputer.fetch();
    const playableFrameCount = this.parser.getPlayableFrameCount();
    const overall = generateOverallStats({
      settings,
      inputs,
      conversions,
      playableFrameCount
    });
    const gameEnd = this.parser.getGameEnd();
    const gameComplete = gameEnd !== null;
    const stats = {
      lastFrame: this.parser.getLatestFrameNumber(),
      playableFrameCount,
      stocks: stocks,
      conversions: conversions,
      combos: this.comboComputer.fetch(),
      actionCounts: this.actionsComputer.fetch(),
      overall: overall,
      gameComplete
    };

    if (gameComplete) {
      // If the game is complete, store a cached version of stats because it should not
      // change anymore. Ideally the statsCompuer.process and fetch functions would simply do no
      // work in this case instead but currently the conversions fetch function,
      // generateOverallStats, and maybe more are doing work on every call.
      this.finalStats = stats;
    }

    return stats;
  }

  getStadiumStats() {
    this._process();

    const settings = this.parser.getSettings();

    if (!settings) {
      return null;
    }

    const latestFrame = this.parser.getLatestFrame();
    const players = latestFrame == null ? void 0 : latestFrame.players;

    if (!players) {
      return null;
    }

    this.statsComputer.process();

    switch (settings.gameMode) {
      case exports.GameMode.TARGET_TEST:
        return {
          type: "target-test",
          targetBreaks: this.targetBreakComputer.fetch()
        };

      case exports.GameMode.HOME_RUN_CONTEST:
        const distanceInfo = extractDistanceInfoFromFrame(settings, latestFrame);

        if (!distanceInfo) {
          return null;
        }

        return {
          type: "home-run-contest",
          distance: distanceInfo.distance,
          units: distanceInfo.units
        };

      default:
        return null;
    }
  }

  getMetadata() {
    if (this.metadata) {
      return this.metadata;
    }

    const slpfile = openSlpFile(this.input);
    this.metadata = getMetadata(slpfile);
    closeSlpFile(slpfile);
    return this.metadata;
  }

  getFilePath() {
    var _this$input$filePath;

    if (this.input.source !== exports.SlpInputSource.FILE) {
      return null;
    }

    return (_this$input$filePath = this.input.filePath) != null ? _this$input$filePath : null;
  }

  getWinners() {
    // Read game end block directly
    const slpfile = openSlpFile(this.input);
    const gameEnd = getGameEnd(slpfile);

    this._process(() => this.parser.getSettings() !== null, slpfile);

    const settings = this.parser.getSettings();

    if (!gameEnd || !settings) {
      // Technically using the final post frame updates, it should be possible to compute winners for
      // replays without a gameEnd message. But I'll leave this here anyway
      closeSlpFile(slpfile);
      return [];
    } // If we went to time, let's fetch the post frame updates to compute the winner


    let finalPostFrameUpdates = [];

    if (gameEnd.gameEndMethod === exports.GameEndMethod.TIME) {
      finalPostFrameUpdates = extractFinalPostFrameUpdates(slpfile);
    }

    closeSlpFile(slpfile);
    return getWinners(gameEnd, settings, finalPostFrameUpdates);
  }

}

exports.ActionsComputer = ActionsComputer;
exports.ComboComputer = ComboComputer;
exports.ConsoleCommunication = ConsoleCommunication;
exports.ConsoleConnection = ConsoleConnection;
exports.ConversionComputer = ConversionComputer;
exports.DolphinConnection = DolphinConnection;
exports.InputComputer = InputComputer;
exports.MAX_ROLLBACK_FRAMES = MAX_ROLLBACK_FRAMES;
exports.NETWORK_MESSAGE = NETWORK_MESSAGE;
exports.SlippiGame = SlippiGame;
exports.SlpFile = SlpFile;
exports.SlpFileWriter = SlpFileWriter;
exports.SlpParser = SlpParser;
exports.SlpStream = SlpStream;
exports.Stats = Stats;
exports.StockComputer = StockComputer;
exports.TargetBreakComputer = TargetBreakComputer;
exports.Timers = Timers;
exports.animations = animationUtils;
exports.calcDamageTaken = calcDamageTaken;
exports.characters = characterUtils;
exports.closeSlpFile = closeSlpFile;
exports.didLoseStock = didLoseStock;
exports.extractFinalPostFrameUpdates = extractFinalPostFrameUpdates;
exports.frameToGameTimer = frameToGameTimer;
exports.generateOverallStats = generateOverallStats;
exports.getGameEnd = getGameEnd;
exports.getMetadata = getMetadata;
exports.getSinglesPlayerPermutationsFromSettings = getSinglesPlayerPermutationsFromSettings;
exports.isCommandGrabbed = isCommandGrabbed;
exports.isDamaged = isDamaged;
exports.isDead = isDead;
exports.isDown = isDown;
exports.isGrabbed = isGrabbed;
exports.isInControl = isInControl;
exports.isTeching = isTeching;
exports.iterateEvents = iterateEvents;
exports.moves = moveUtils;
exports.openSlpFile = openSlpFile;
exports.parseMessage = parseMessage;
exports.stages = stageUtils;
//# sourceMappingURL=slippi-js.cjs.development.js.map

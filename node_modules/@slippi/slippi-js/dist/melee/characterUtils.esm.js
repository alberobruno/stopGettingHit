import characters from './characters.esm.js';

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

export { UnknownCharacter, getAllCharacters, getCharacterColorName, getCharacterInfo, getCharacterName, getCharacterShortName };
//# sourceMappingURL=characterUtils.esm.js.map

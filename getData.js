//Run command in terminal:
//node script.js

const { SlippiGame } = require('@slippi/slippi-js');
const fs = require('fs');

let rawData = {};

const game = new SlippiGame('test.slp');

// Get game settings – stage, characters, etc
const settings = game.getSettings();
rawData['settings'] = settings;

// Get metadata - start time, platform played on, etc
const metadata = game.getMetadata();
rawData['metadata'] = metadata;

// Get computed stats - openings / kill, conversions, etc
const stats = game.getStats();
rawData['stats'] = stats;

// Get frames – animation state, inputs, etc
// This is used to compute your own stats or get more frame-specific info (advanced)
const frames = game.getFrames();
// console.log(frames[0].players); // Print frame when timer starts counting down
rawData['frames'] = frames;

fs.writeFile('rawData.txt', JSON.stringify(rawData), () =>
  console.log('Data saved')
);

// console.log(settings.players[0].displayName);
// console.log(settings.players[1].displayName);
// console.log(settings);
// console.log(rawData.frames[0]);

const players = {
  playersIndex: {
    playerId: 123456,
    playerDisplay: 'Robnu',
    hitDuring: {
      currentFrame: {
        hitOutOf: 'x',
        hitBy: 'y',
      },
    },
  },
};

// console.log(settings.players[0]);

const hitStates = new Set([25, 32, '32', '0032']);

for (let player in rawData.settings.players) {
  rawData.settings.players[player]['hitDuring'] = {};
  for (let frame in frames) {
    // if (
    //   hitStates.has(frames[frame].players[player].pre.actionStateId) &&
    //   frame > 0
    // ) {
    //   console.log('dashAttacked');
    //   rawData.settings.players[player]['hitDuring'][frame] = 'dashAttacked';
    // }
    if (frame < 100)
      console.log('state: ', frames[frame].players[player].pre.actionStateId);
  }
}
console.log(rawData.settings.players);

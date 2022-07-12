//Run command in terminal:
//node script.js
const { SlippiGame } = require('@slippi/slippi-js');
const fs = require('fs');

let rawData = [];

const game = new SlippiGame('test.slp');

// Get game settings – stage, characters, etc
const settings = game.getSettings();
// console.log(settings);
// rawData.push(settings);

// Get metadata - start time, platform played on, etc
const metadata = game.getMetadata();
// console.log(metadata);
// rawData.push(metadata);

// Get computed stats - openings / kill, conversions, etc
const stats = game.getStats();
console.log(stats);
// rawData.push(stats);

// Get frames – animation state, inputs, etc
// This is used to compute your own stats or get more frame-specific info (advanced)
const frames = game.getFrames();
// console.log(frames[0].players); // Print frame when timer starts counting down
// rawData.push(frames[0].players);

// fs.appendFile('output.txt', frames[0].players);

// console.log('File created');
// console.log(rawData);

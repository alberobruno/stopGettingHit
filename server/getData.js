//Run command in terminal:
//npm run getData
const { SlippiGame } = require("@slippi/slippi-js");
const { moves } = require("@slippi/slippi-js");
const path = require("path");
const fs = require("fs");

let rawData = {};

const uploadDir = path.resolve(__dirname, "./uploads/");
const outputDir = path.resolve(__dirname, "./uploadsOutput/");
const uploadedGames = fs.readdirSync(uploadDir);

console.log("Uploaded Games: ", uploadedGames);

// Currently looks at only game one in uploads dir
// const firstGame = uploadedGames[0];
for (let uploadedGame of uploadedGames) {
  const game = new SlippiGame(path.resolve(uploadDir, uploadedGame));

  // Get game settings – stage, characters, etc
  const settings = game.getSettings();
  rawData["settings"] = settings;

  // Get metadata - start time, platform played on, etc
  const metadata = game.getMetadata();
  rawData["metadata"] = metadata;

  // Get computed stats - openings / kill, conversions, etc
  const stats = game.getStats();
  rawData["stats"] = stats;

  // Get frames – animation state, inputs, etc
  // This is used to compute your own stats or get more frame-specific info (advanced)
  // const frames = game.getFrames();
  // rawData["frames"] = frames;
  //Application breaks if we include this line, JSON becomes too big
  // console.log(frames[0].players); // Print frame when timer starts counting down

  fs.writeFile(
    path.resolve(outputDir, uploadedGame.slice(0, -3) + "txt"),
    JSON.stringify(rawData),
    () => console.log(uploadedGame, " data saved")
  );
}

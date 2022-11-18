//----------Initial Setup----------
const db = require("./models");
const controller = {};
const path = require("path");
const fs = require("fs");

//----------Read Matches----------
controller.getMatches = async (req, res, next) => {
  try {
    console.log("Trying to get matches!");
    const query = "SELECT * FROM matches";
    const result = await db.query(query);
    res.locals.matchData = result.rows;
    next();
  } catch (err) {
    next({
      log: `controller.getMatches: ${err}`,
      status: 400,
      message: err,
    });
  }
};

//----------Create Matches----------
controller.addMatches = async (req, res, next) => {
  try {
    //DOES NOT WORK IF rawData INCLUDES FRAMES (TOO MUCH DATA)
    //This should be parsed a match JSON (i.e. rawData.txt)
    const outputDir = path.resolve(__dirname, "./uploadsOutput/");
    console.log(outputDir);
    const uploadedGames = fs.readdirSync(outputDir);
    console.log(uploadedGames);

    // const newMatch = req.body.settings.players;
    const newMatch = fs
      .readFileSync(path.resolve(outputDir, uploadedGames[0]))
      .toString();
    // console.log("Brand New Games: ", brandNewMatches);
    // console.log("New Match: ", newMatch);
    const query = `INSERT INTO matches (player1, player2, data)
    VALUES ('${newMatch[0].displayName}', '${
      newMatch[1].displayName
    }', '${JSON.stringify(req.body)}');`;
    const result = await db.query(query);
    next();
  } catch (err) {
    next({
      log: `controller.getMatches: ${err}`,
      status: 400,
      message: err,
    });
  }
};

//----------Update Matches----------
controller.updateMatches = async (req, res, next) => {
  try {
    //Expecting put request to update/"id"
    //Expecting object with property to update
    const id = req.params.id;
    const col = req.body[0];
    const value = req.body[1];

    let query = `UPDATE matches SET ${col}='${value}' WHERE id='${id}';`;
    let result = await db.query(query);
    next();
  } catch (err) {
    next({
      log: `controller.getMatches: ${err}`,
      status: 400,
      message: err,
    });
  }
};

//----------Delete Matches----------
controller.deleteMatches = async (req, res, next) => {
  try {
    //Expecting put request to delete/"id"
    const id = req.params.id;

    //let query = `DELETE FROM matches WHERE id='${id}';`;
    let query = "DELETE FROM matches WHERE id=$1";
    let result = await db.query(query, [id]);
    next();
  } catch (err) {
    next({
      log: `controller.getMatches: ${err}`,
      status: 400,
      message: err,
    });
  }
};

// //----------Get Db Data----------
// controller.getDbData = async (req, res, next) => {
//   try {
//     console.log('Getting database data!');

//     next();
//   } catch (err) {
//     next({
//       log: `controller.getDbData: ${err}`,
//       status: 400,
//       message: err,
//     });
//   }
// };

//----------Export----------
module.exports = controller;

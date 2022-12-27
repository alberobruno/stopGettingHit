//----------Initial Setup----------
const db = require('./models');
const controller = {};
const path = require('path');
const fs = require('fs');
const clearFolders = require('./clearFolders');
const createGitkeep = require('./createGitkeep');

//----------Read Matches----------

//----------Redis Testing Second----------

controller.getMatches = async (req, res, next) => {
  try {
    clearFolders.del();
    // createGitkeep.add();
    console.log('Trying to get matches...');
    const query = 'SELECT * FROM matches';
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
    //LAGS IF rawData INCLUDES FRAMES (TOO MUCH DATA)
    const outputDir = path.resolve(__dirname, './uploadsOutput/');
    const uploadedGames = fs.readdirSync(outputDir);

    const newMatch = JSON.parse(
      fs.readFileSync(path.resolve(outputDir, uploadedGames[0])).toString()
    );
    const player1 = newMatch.settings.players[0].displayName;
    const player2 = newMatch.settings.players[1].displayName;
    const query = `INSERT INTO matches (player1, player2, data)
    VALUES ('${player1}', '${player2}', '${JSON.stringify(newMatch)}');`;
    const result = await db.query(query);
    // createGitkeep.add();
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

    let query = 'DELETE FROM matches WHERE id=$1';
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

//----------Clear Uploads Folder----------
const emptyFolder = async (folderPath) => {
  try {
    // Find all files in the folder
    const files = await fsPromises.readdir(folderPath);
    for (const file of files) {
      await fsPromises.unlink(path.resolve(folderPath, file));
      console.log(`${folderPath}/${file} has been removed successfully`);
    }
  } catch (err) {
    console.log(err);
  }
};

//----------Export----------
module.exports = controller;

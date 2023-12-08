//----------Initial Setup----------
const db = require("./models");
const controller = {};
const path = require("path");
const fs = require("fs");
const clearFolders = require("./clearFolders");
const createGitkeep = require("./createGitkeep");
const redisClient = require("./redisClient");

//----------Read Matches----------
controller.getMatches = async (req, res, next) => {
  try {
    clearFolders.del();
    console.log("Trying to get matches...");
    //----------Redis
    // First, log a message before retrieving keys from Redis
    console.log("Retrieving keys from Redis...");
    redisClient.keys("match:*", async (err, keys) => {
      if (err) {
        console.error(`Redis error: ${err}`);
        next(err);
        return;
      }

      console.log(`Found ${keys.length} keys in Redis.`); // Log the number of keys found

      // Create a promise for each key and resolve it when data is fetched
      const fetchPromises = keys.map((key) => {
        return new Promise((resolve, reject) => {
          redisClient.get(key, (err, value) => {
            if (err) {
              console.error(`Error retrieving Redis data for key ${key}: ${err}`);
              reject(err);
            } else {
              console.log(`Redis data for key ${key}: ${value}`);
              resolve(value);
            }
          });
        });
      });

      // Wait for all promises to resolve
      try {
        console.log("Fetching data for each key from Redis...");
        await Promise.all(fetchPromises);
        console.log("Completed fetching data from Redis.");
      } catch (redisErr) {
        console.error(`Error fetching data from Redis: ${redisErr}`);
        next(redisErr);
        return;
      }
    });

    //----------Postgres
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
    //LAGS IF rawData INCLUDES FRAMES (TOO MUCH DATA)
    const outputDir = path.resolve(__dirname, "./uploadsOutput/");
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
    //Redis Keys
    const matchKey = `match:${player1}:${player2}:${Date.now()}`;
    const matchData = JSON.stringify(newMatch);

    // Add to Redis
    console.log("About to save match to Redis");
    redisClient.set(matchKey, matchData, (err, reply) => {
      if (err) {
        console.error(`Error saving match to Redis: ${err}`);
      } else {
        console.log(`Match data saved to Redis with key ${matchKey}: ${reply}`);
      }
    });
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

//----------Delete Matches----------
controller.redis = async (req, res, next) => {
  try {
    redisClient.set("key", "value", redis.print);
    redisClient.get("key", (err, reply) => {
      res.send("Redis Key value: " + reply);
    });
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

//----------Initial Setup----------
import * as db from './models';
import path from 'path';
import fs from 'fs';
import clearFolders from './clearFolders';
// import createGitkeep from './createGitkeep';
// import redisClient from './redisClient';

const controller = {
  //----------Read Matches----------
  getMatches: async (req, res, next) => {
    try {
      /*
      //----------Redis
      // First, log a message before retrieving keys from Redis
      console.log('Retrieving keys from Redis...');
      try {
        const keys = await redisClient.keys('match:*');
        console.log(`Found ${keys.length} keys in Redis.`); // Log the number of keys found

        //   // Create a promise for each key and resolve it when data is fetched
        const fetchPromises = keys.map(async (key) => {
          try {
            const value = await redisClient.get(key);
            console.log(`Redis data for key ${key}: ${value}`);
          } catch (err) {
            console.error(`Error retrieving Redis data for key ${key}: ${err}`);
          }
        });

        //   // Wait for all promises to resolve
        try {
          console.log('Fetching data for each key from Redis...');
          await Promise.all(fetchPromises);
          console.log('Completed fetching data from Redis.');
        } catch (redisErr) {
          console.error(`Error fetching data from Redis: ${redisErr}`);
          next(redisErr);
          return;
        }
      } catch (err) {
        console.error('Redis Get Matches error ', err);
        next(err);
        return;
      }
*/

      //----------Postgres
      clearFolders();
      console.log('Trying to get matches...');
      const query = 'SELECT * FROM matches';
      const result = await db.query(query);
      console.log('Result: ', result.rows[0]);
      res.locals.matchData = result.rows;
      next();
    } catch (err) {
      next({
        log: `controller.getMatches: ${err}`,
        status: 400,
        message: err,
      });
    }
  },

  //----------Create Matches----------
  addMatches: async (req, res, next) => {
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
      await db.query(query);
      // createGitkeep.add();
      //Redis Keys
      // const matchKey = `match:${player1}:${player2}:${Date.now()}`;
      // const matchData = JSON.stringify(newMatch);

      // Add to Redis
      // console.log('About to save match to Redis');
      // redisClient.set(matchKey, matchData, (err, reply) => {
      //   if (err) {
      //     console.error(`Error saving match to Redis: ${err}`);
      //   } else {
      //     console.log(`Match data saved to Redis with key ${matchKey}: ${reply}`);
      //   }
      // });
      next();
    } catch (err) {
      next({
        log: `controller.getMatches: ${err}`,
        status: 400,
        message: err,
      });
    }
  },

  //----------Update Matches----------
  updateMatches: async (req, res, next) => {
    try {
      //Expecting put request to update/"id"
      //Expecting object with property to update
      const id = req.params.id;
      const col = req.body[0];
      const value = req.body[1];

      const query = `UPDATE matches SET ${col}='${value}' WHERE id='${id}';`;
      await db.query(query);
      next();
    } catch (err) {
      next({
        log: `controller.getMatches: ${err}`,
        status: 400,
        message: err,
      });
    }
  },

  //----------Delete Matches----------
  deleteMatches: async (req, res, next) => {
    try {
      //Expecting put request to delete/"id"
      const id = req.params.id;

      const query = 'DELETE FROM matches WHERE id=$1';
      await db.query(query, [id]);
      next();
    } catch (err) {
      next({
        log: `controller.getMatches: ${err}`,
        status: 400,
        message: err,
      });
    }
  },

  //----------Redis----------
  // redis: async (req, res, next) => {
  //   try {
  //     redisClient.set('key', 'value', redis.print);
  //     redisClient.get('key', (err, reply) => {
  //       res.send('Redis Key value: ' + reply);
  //     });
  //     next();
  //   } catch (err) {
  //     next({
  //       log: `controller.getMatches: ${err}`,
  //       status: 400,
  //       message: err,
  //     });
  //   }
  // },
};

//----------Clear Uploads Folder----------
// const emptyFolder = async (folderPath) => {
//   try {
//     // Find all files in the folder
//     const files = await fsPromises.readdir(folderPath);
//     for (const file of files) {
//       await fsPromises.unlink(path.resolve(folderPath, file));
//       console.log(`${folderPath}/${file} has been removed successfully`);
//     }
//   } catch (err) {
//     console.log(err);
//   }
// };

//----------Export----------
export default controller;

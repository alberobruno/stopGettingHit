//----------Initial Setup----------
const path = require("path");
const fs = require("fs");
const fsPromises = require("fs").promises;

//----------Clear Uploads Folder----------
const del = async () => {
  try {
    // Find all files in the folder
    console.log("Clearing previous files...");
    const paths = [
      path.resolve(__dirname, "./uploads/"),
      path.resolve(__dirname, "./uploadsOutput/"),
    ];
    for (let filePath of paths) {
      const files = await fsPromises.readdir(filePath);
      for (const file of files) {
        // console.log("Getting here");
        //INSTEAD OF FILTERING FOR GITKEEP -> JUST RECREATE THEM AFTER DELETING ALL FILES
        // if (file !== ".gitkeep") {
        await fsPromises.unlink(path.resolve(filePath, file));
        console.log(`${filePath}/${file} has been removed successfully`);
        // }
      }
    }
  } catch (err) {
    console.log(err);
  }
};

//----------Export----------
module.exports = { del };

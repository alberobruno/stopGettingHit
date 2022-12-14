//----------Initial Setup----------
const path = require("path");
const fs = require("fs");
const fsPromises = require("fs").promises;

//----------Creates Gitkeep files after file cleanup----------
const add = async () => {
  try {
    // Find all files in the folder
    const paths = [
      path.resolve(__dirname, "./uploads/"),
      path.resolve(__dirname, "./uploadsOutput/"),
    ];
    //Create .gitkeep files
    const test = paths[0] + "/.gitkeep";
    console.log("Test: ", test);
    fs.writeFile(test, "", function (err) {
      if (err) return console.log(err);
      console.log("Generating .gitkeep...");
    });
  } catch (err) {
    console.log(err);
  }
};

//----------Export----------
module.exports = { add };

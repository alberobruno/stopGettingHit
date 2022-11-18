//----------File Upload Setup----------
const path = require("path");
const http = require("http");
const formidable = require("formidable");
const fs = require("fs");
const fsPromises = require("fs").promises;
// const series = require("async");
// import { series } from "async";
const { execSync } = require("child_process");

//----------File Upload----------
http
  .createServer(function (req, res) {
    //Create an instance of the form object
    let form = new formidable.IncomingForm();

    //Process the file upload in Node
    form.parse(req, function (error, fields, file) {
      console.log("File: ", file);
      let filepath = file.myFile.filepath;
      let outputpath = path.resolve(__dirname, "./uploadsOutput/");
      let newpath = path.resolve(__dirname, "./uploads/");
      console.log("Clearing previous files...");
      emptyFolder(newpath);
      emptyFolder(outputpath);
      newpath += "/" + file.myFile.originalFilename;

      //Copy the uploaded file to a custom folder
      fs.rename(filepath, newpath, function () {
        console.log("NodeJS File Upload Success!");
        res.writeHead(302, {
          Location: "http://localhost:8080/",
        });
        res.end();
      });
      //Run data parser
      execSync("npm run getData");
    });
  })
  .listen(9001, () => {
    console.log(`Server listening on port: ${9001}...`);
  });

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

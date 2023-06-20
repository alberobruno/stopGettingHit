//----------Initial Setup----------
const controller = {};
const path = require('path');
const fs = require('fs');
const formidable = require('formidable');
const { execSync } = require('child_process');
const clearFolders = require('./clearFolders');

//----------File Upload----------
controller.add = async (req, res, next) => {
  try {
    //Create an instance of the form object
    let form = new formidable.IncomingForm();

    //Process the file upload in Node
    form.parse(req, function (error, fields, file) {
      if (error) {
        return next({
          log: `uploadSLP.add: ${error}`,
          status: 500,
          message: { err: 'An error occurred while parsing the form.' },
        });
      }
      let filepath = file.myFile.filepath;
      let outputpath = path.resolve(__dirname, './uploadsOutput/');
      let newpath = path.resolve(__dirname, './uploads/');
      clearFolders.del();
      newpath += '/' + file.myFile.originalFilename;

      //Copy the uploaded file to a custom folder
      fs.rename(filepath, newpath, function () {
        console.log('File Upload Success!');
        //Run data parser
        execSync('npm run getData');
        next();
      });
    });
  } catch (err) {
    next({
      log: `uploadSLP.add: ${err}`,
      status: 400,
      message: err,
    });
  }
};

//----------Clear Uploads Folder----------
// const clearFolder = async (folderPath) => {
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
module.exports = controller;

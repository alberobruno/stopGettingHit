//----------Initial Setup----------
import path from 'path';
import fs from 'fs';
import formidable from 'formidable';
import { execSync } from 'child_process';
import clearFolders from './clearFolders';

interface Controller {
  add?: (req, res, next) => void;
}

const controller: Controller = {};
//----------File Upload----------
controller.add = async (req, res, next) => {
  try {
    //Create an instance of the form object
    const form = new formidable.IncomingForm();

    //Process the file upload in Node
    form.parse(req, function (error, fields, file) {
      if (error) {
        return next({
          log: `uploadSLP.add: ${error}`,
          status: 500,
          message: { err: 'An error occurred while parsing the form.' },
        });
      }
      const filepath = file.myFiles.filepath;
      const outputpath = path.resolve(__dirname, './uploadsOutput/');
      console.log('Output path: ', outputpath);
      let newpath = path.resolve(__dirname, './uploads/');
      clearFolders();
      newpath += '/' + file.myFiles.originalFilename;

      //Copy the uploaded file to a custom folder
      fs.rename(filepath, newpath, function () {
        console.log('File Upload Success!');
        //Run data parser
        execSync('npm run getData.ts');
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
export default controller;

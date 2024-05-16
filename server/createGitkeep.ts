//----------Initial Setup----------
import path from 'path';
import fs from 'fs';

//----------Creates Gitkeep files after file cleanup----------
const add = async () => {
  try {
    // Find all files in the folder
    const paths = [
      path.resolve(__dirname, './uploads/'),
      path.resolve(__dirname, './uploadsOutput/'),
    ];
    //Create .gitkeep files
    const test = paths[0] + '/.gitkeep';
    console.log('Test: ', test);
    fs.writeFile(test, '', function (err) {
      if (err) {
        console.error(err);
        return;
      }
      console.log('Generating .gitkeep...');
    });
  } catch (err) {
    console.log(err);
  }
};

//----------Export----------
export default add;

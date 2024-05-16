//----------Initial Setup----------
import path from 'path';
import { promises as fsPromises } from 'fs';

//----------Clear Uploads Folder----------
const clearFolders = async () => {
  try {
    // Find all files in the folder
    console.log('Clearing previous files...');
    const paths = [
      path.resolve(__dirname, './uploads/'),
      path.resolve(__dirname, './uploadsOutput/'),
    ];
    for (const filePath of paths) {
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

//----------Default Export----------
export default clearFolders;

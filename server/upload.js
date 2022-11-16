//----------File Upload Setup----------
const http = require("http");
const formidable = require("formidable");
const fs = require("fs");

//----------File Upload----------
http
  .createServer(function (req, res) {
    //Create an instance of the form object
    let form = new formidable.IncomingForm();

    //Process the file upload in Node
    form.parse(req, function (error, fields, file) {
      let filepath = file.fileupload.filepath;
      let newpath =
        "C:/Users/alber/Downloads/Coding/stopGettingHit/upload-example/";
      newpath += file.fileupload.originalFilename;

      //Copy the uploaded file to a custom folder
      fs.rename(filepath, newpath, function () {
        //Send a NodeJS file upload confirmation message
        res.write("NodeJS File Upload Success!");
        res.end();
      });
    });
  })
  .listen(9001, () => {
    console.log(`Server listening on port: ${9001}...`);
  });

// http
//   .createServer(function (req, res) {
//     res.writeHead(200, { "Content-Type": "text/html" });
//     res.write("Node JS File Uploader Checkpoint");
//   })
//   .listen(9001, () => {
//     console.log(`Server listening on port: ${9001}...`);
//   });

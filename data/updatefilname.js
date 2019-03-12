/*
    This simple script prepends 00 to all pages 1-9 in the Philly Hoods reports, 
    since the original extraction script didn't do this (I'll fix it later).

    Example: 2601page1.jpg --> 2601page001.jpg

    This was needed in order to effeciently process jps to pdf using ImageMagick.
*/

const fs = require("fs");

const files = fs.readdir("./outputs/images", (error, files) => {
  try {
    for (let i = 0; i < files.length; i++) {
      // If the file name is 13 characters long, then it has to be pages 1-9.
      if (files[i].length === 13 && files[i].includes("page")) {
        const endOfFile = files[i].match(/(\d).jpg/);
        const pageNumber = endOfFile[1];

        const splitFile = files[i].split("page");
        const reportId = splitFile[0];

        const newFile = `${reportId}page00${pageNumber}.jpg`;

        fs.rename(`./outputs/images/${files[i]}`, `./outputs/images/${newFile}`, err => {
          if (err) console.log(err);
        });

        // console.log(endOfFile[1]);
        // console.log(splitFile);
        // console.log(newFile);
      }
    }
  } catch (error) {
    console.log(error);
  }

  if (error) console.log(error);
});

/*
    This simple script prepends 00 to all pages 1-9 and 0 to all pages 10-99 in the Philly Hoods reports, 
    since the original extraction script didn't do this (I'll fix it later).

    Example: 2601page1.jpg --> 2601page001.jpg
    Example: 2601page10.jpg --> 2601page010.jpg

    This was needed in order to effeciently process jps to pdf using ImageMagick. I made my own mess :)
*/

const fs = require("fs");

fs.readdir("./outputs/images", (error, files) => {
  try {
    for (let i = 0; i < files.length; i++) {
      if (files[i].includes("page")) {
        const splitFile = files[i].split("page");
        const reportId = splitFile[0];
        const splitExtension = splitFile[1].split(".");
        const pageNumber = splitExtension[0];

        // If the page number is 1 character, then it has to be pages 1-9.
        if (pageNumber.length === 1) {
          const newFile = `${reportId}page00${pageNumber}.jpg`;
          
          fs.rename(`./outputs/images/${files[i]}`, `./outputs/images/${newFile}`, err => {
            if (err) console.log(err);
          });
        }

        // If the file name is 2 characters long, then it has to be pages 10-99.
        if (pageNumber.length === 2) {
          const newFile = `${reportId}page0${pageNumber}.jpg`;
          
          fs.rename(`./outputs/images/${files[i]}`, `./outputs/images/${newFile}`, err => {
            if (err) console.log(err);
          });
        }

      }
    }
  } catch (error) {
    console.log(error);
  }

  if (error) console.log(error);
});

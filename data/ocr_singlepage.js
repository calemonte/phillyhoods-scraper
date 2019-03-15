const shell = require("shelljs");
const fs = require("fs");

fs.readdir("./outputs/images", (error, files) => {
  try {
    // Loop over our files and extract the unique ids.
    for (let i = 0; i < files.length; i++) {
      if (files[i].includes("page")) {
        const splitFile = files[i].split("page");
        const reportId = splitFile[0];
        const pageNumSplit = splitFile[1].split(".");
        const pageNum = pageNumSplit[0];

        if (shell.which("convert")) {
          shell.exec(
            `convert -density 300 ./outputs/images/${reportId}page${pageNum}.jpg -depth 8 -strip -background white -bordercolor White -border 10x10 -alpha off ./outputs/ocr-pdf/${reportId}page${pageNum}ocr.tiff`
          );

          console.log(`${reportId}page${pageNum}.jpg converted to TIFF\n`);

          if (shell.which("tesseract")) {
            shell.exec(
              `tesseract ./outputs/ocr-pdf/${reportId}page${pageNum}ocr.tiff ./outputs/ocr/${reportId}_OCR/${reportId}page${pageNum}`
            );

            console.log(
              `${reportId}page${pageNum}ocr.tiff succesfully OCR'd. This is item ${i} of ${
                files.length
              }\n`
            );
          }

          // Delete the tiff after it's been OCR'd
          shell.rm(`./outputs/ocr-pdf/${reportId}page${pageNum}ocr.tiff`);
        }
      }
    }
  } catch (error) {
    console.log(
      "Something went wrong with the conversion and OCR process: " + error
    );
  }

  console.log("File Read Error: " + error);
});

const shell = require("shelljs");
const fs = require("fs");

fs.readdir("./outputs/images", (error, files) => {
  try {
    let reports = [];

    // Loop over our files and extract the unique ids.
    for (let i = 0; i < files.length; i++) {
      if (files[i].includes("page")) {
        const splitFile = files[i].split("page");
        const reportID = splitFile[0];

        if (!reports.includes(reportID)) {
          reports.push(reportID);
        }
      }
    }

    console.log("Done mapping directory!");

    // Loop over our array of unique ids and convert jpgs into tiffs for processing by tesseract.
    for (let j = 0; j < reports.length; j++) {

      if (shell.which("convert")) {
        shell.exec(
          `convert -density 300 ./outputs/images/${
            reports[j]
          }page*.jpg -depth 8 -strip -background white -bordercolor White -border 10x10 -alpha off ./outputs/ocr/${
            reports[j]
          }ocr.tiff`
        );
      }
      console.log(`TIFFitized ${reports[j]}`);

      // Perform ocr on the newly minted tiff file.
      if (shell.which("tesseract")) {
        shell.exec(`tesseract ./outputs/ocr/${reports[j]}ocr.tiff ./outputs/ocr/${reports[j]}`);
      }
      console.log(`OCR'd ${reports[j]}`);
      
    }
  } catch (error) {
    console.log("Something went wrong with the conversion and OCR process: " + error);
  }

  console.log("File Read Error: " + error);
});

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

    // Loop over our array of unique ids and convert jpgs into pdfs for each.
    for (let j = 0; j < reports.length; j++) {
      if (shell.which("convert")) {
        shell.exec(`convert ./outputs/images/${reports[j]}page*.jpg ./outputs/pdf/${reports[j]}.pdf`);
      }
      console.log(`PDFitized ${reports[j]}!`);
    }

  } catch (error) {
    console.log("Something went wrong with PDFitization: " + error);
  }

  console.log("File Read Error: " + error);
});

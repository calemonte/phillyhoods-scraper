"use strict";

const csv = require("csv-parser");
const fs = require("fs");

fs.createReadStream("./outputs/testOmekaOutput_withURLs.csv")
  .pipe(csv())
  .on("data", row => {
    // const regex = /https:\/\/upenn.box.com\/s\/.{1,32}/;
    // const found = row.match(regex);
    // console.log(found);
    const path = row.PATH;
    let temp = path.split("/s/");
    let tempJoin = temp.join("/shared/static/");
    tempJoin += ".pdf";
    console.log(tempJoin);

  })
  .on("end", () => {
    console.log("CSV file successfully processed");
  });

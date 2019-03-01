"use strict";

const puppeteer = require("puppeteer");
const http = require("http");
const fs = require("fs");

let scrape = async () => {
  const dataObj = [
    "http://sceti.library.upenn.edu/pages/biblio-record.cfm?so_id=4785",
    "http://sceti.library.upenn.edu/pages/biblio-record.cfm?so_id=4368",
    "http://sceti.library.upenn.edu/pages/biblio-record.cfm?so_id=2741",
    "http://sceti.library.upenn.edu/pages/biblio-record.cfm?so_id=4334"
  ];
  let newDataObj = {};

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  console.log("Extracting bibliographic data...");
  for (let i = 0; i < dataObj.length; i++) {
    const url = dataObj[i];
    await page.goto(url);
    // Evaluate each page and extract relevant bibliographic data.
    const bibData = await page.evaluate(() => {
      const content = document.querySelectorAll("td.DC_content");

      // Loop through the bibliographic record and pluck out the pertinent information.
      let data = {};
      for (let i = 0; i < content.length; i++) {
        const text = content[i].previousSibling.innerText.trim();

        if (text === "Title Statement") {
          const title = content[i].innerText;
          data.title = title;
        } else if (text === "Corporate Name" || text === "Coporate Name") {
          const creator = content[i].innerText;
          data.creator = creator;
        } else if (text === "Call Number") {
          const callNumber = content[i].innerText;
          data.callNumber = callNumber;
        } else if (text === "Uniform Resource Identifier for record") {
          const uriRecord = content[i].innerText;
          data.uriRecord = uriRecord;
        } else if (text === "Uniform Resource Identifier for facsimile") {
          const uriFacsimile = content[i].innerText;
          data.uriFacsimile = uriFacsimile;
        }

        // Deduce the year if it's contained in the Call Number, otherwise just set it to "Unknown".
        if (data.callNumber && data.callNumber.slice(-4).includes('19')) {
            data.year = data.callNumber.slice(-4);
        } else {
            data.year = "Unknown";
        }

      }

      //   let title = content[0].innerText.trim();
      //   let creator = content[1].innerText.trim();
      //   let callNumber = content[2].innerText.trim();
      //   let uriRecord = content[3].innerText.trim();
      //   let uriFacsimile = content[4].innerText.trim();

      //   let data = {
      //     title,
      //     creator,
      //     callNumber,
      //     uriRecord,
      //     uriFacsimile
      //   };
      return data;
    });

    // Add our bibliographic data to each object containing our report data.
    newDataObj[i] = bibData;
  }
  console.log("Extracting bibliographic data done!");

  // End our browser session.
  browser.close();

  // Return our report data object (Not currently being used in callback).
  return newDataObj;
};

scrape().then(value => {
  console.log(value); // Success!
});

"use strict";

const puppeteer = require("puppeteer");
const http = require("http");
const fs = require("fs");
const reports = require("./outputs/hoodsDataWithRegions.json");

const URL = "https://franklin.library.upenn.edu/catalog/";

let scrape = async () => {
  try {
    let testRecords = [];

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // For every report that we have, visit Franklin and search for a record.
    for (let i = 0; i < 2; i++) {
      if (reports[i].bibliographicData.callNumber) {
        await page.goto(URL);
        await page.waitForSelector("#q");

        const searchBar = await page.$("#q");
        await searchBar.focus();
        await searchBar.type(reports[i].bibliographicData.callNumber);

        // Focus on he search bar and input the call number for the report.
        // await page.focus('#q);
        // await page.keyboard.type('#q', reports[i].bibliographicData.callNumber);
        // await page.keyboard.press(String.fromCharCode(13)); // Press the enter key to submit the form.

        await page.evaluate(() => {
          document.querySelector("#search").click();
        });

        // TESTING STUFF
        await page.screenshot({ path: "test.png" });
        console.log("made it here");

        // Wait for the next page to fully load, then click on the first record.
        await page.waitForSelector(
          "#documents > div > div.documentHeader.row > h3 > a"
        );
        await page.click("#documents > div > div.documentHeader.row > h3 > a");
        await page.waitForSelector("#document");

        const record = document.querySelector("#document");
        testRecords.push(record);

        // const franklinRecord = await page.evaluate(() => {
        //     let data = {};

        //     const record = document.querySelector('#document');
        //     const title = record.querySelector('h1').innerText;
        //     data.title = title;

        //     // Grab all of the field data.
        //     const dd = record.querySelectorAll('dd');
        //     for (let j = 0; j < dd.length; j++) {
        //         let className = dd[j].className.split('-');
        //         const property = className[1];

        //         let text = dd[j].innerText;
        //         const field = {
        //             property: property,
        //             text: text
        //         }

        //         data.field[j] = field;
        //     }

        //     return data;
        // });

        // // With the Franklin record collected, add it to the existing report object.
        // testRecords.push(franklinRecord);
      }
    }

    // End our browser session.
    browser.close();

    // Return our updated reports data.
    return testRecords;
  } catch (e) {
    console.log("This is our error: " + e);
  }
};

scrape().then(data => console.log(data));

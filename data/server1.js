'use strict';

const puppeteer = require('puppeteer');
const http = require('http');
const fs = require('fs');

const URL = 'http://sceti.library.upenn.edu/Philaneighborhoods/browse.cfm#';

let scrape = async () => {
    let dataObj = [];

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(URL);

    // Parse the main browse page and exract all unique IDs for each report (contained in the onclick attributes)
    const ids = await page.evaluate(() => {
        let elements = Array.from(document.querySelectorAll('.hioff > a')); // Select all links
        let valueArray = elements.map(element => {
            const id = element.getAttribute('onclick').match(/\d{4}/); // Get the ids of each report
            return id;
        });

        return valueArray; // Return our array of links pointing to the full content.
    });

    // Generate an array of objects with all of the top-level links to our content (main page, table of contents, bibliographic info, and the image start).
    console.log('Parsing ids and creating links..');
    let links = [];
    for (let i = 0; i < ids.length; i++) {
        let id = `${ids[i]}`; // Parse integers?
        let main = `http://sceti.library.upenn.edu/pages/index.cfm?so_id=${ids[i]}`;
        let toc = `http://sceti.library.upenn.edu/pages/popup_jump.cfm?so_id=${ids[i]}&pageposition=1`;
        let bibInfo = `http://sceti.library.upenn.edu/pages/biblio-record.cfm?so_id=${ids[i]}`;
        let imageStart = `http://sceti.library.upenn.edu/pages/index.cfm?so_id=${ids[i]}&PagePosition=1&level=1`;
        
        links.push({
            id,
            main,
            toc,
            bibInfo,
            imageStart,
        });
    }
    console.log('Parsing ids and creating links done!');

    // Print these out to a file for safe keeping.
    // fs.writeFile('./outputs/all-links.json', JSON.stringify(links, null, 2), (err) => {
    //     console.log(err);
    // });

    // NEXT STEPS: 
    // Navigate to each of the Table of Contents and extract the page numbers and headings, then write to a file appropriately title folder;
    console.log('Extracting table of contents...');
    let extractedTocData = [];

    for (let i = 0; i < links.length; i++) {
        const url = links[i].toc;
        await page.goto(url);
        // Loop over the sections and create a list of all of the toc headings and their page numbers.
        const tocs = await page.evaluate(() => {
            let sections = document.querySelector('body > table > tbody > tr:nth-child(1) > td:nth-child(2) > select');

            let data = [];
            for (let i = 0; i < sections.length; i++) {
                let pageTitle = sections[i].innerText.trim();
                let pageNumber = parseInt(sections[i].getAttribute('value'));
                const thisToc = {
                    pageNumber,
                    pageTitle,
                }
                data.push(thisToc);
            }
            return data;
        }); 

        dataObj.push({
            report: links[i],
            tocs,
        });
    }
    console.log('Extracting table of contents done!');

    // Write our TOC to a JSON file.
    // fs.writeFile('./outputs/toc-data2.json', JSON.stringify(dataObj, null, 2), (err) => {
    //     console.log(err);
    // });

    // Navigate to each of the bibliographic info pages and extract all of the relevant metadata, then write to a file appropriately title folder;
    console.log('Extracting bibliographic data...');
    for (let i = 0; i < dataObj.length; i++) {
        const url = dataObj[i].report.bibInfo;
        await page.goto(url);
        // Evaluate each page and extract relevant bibliographic data.
        const bibData = await page.evaluate(() => {
            let content = document.querySelectorAll('td.DC_content');

            let title = content[0].innerText.trim();
            let creator = content[1].innerText.trim();
            let callNumber = content[2].innerText.trim();
            let uriRecord = content[3].innerText.trim();
            let uriFacsimile = content[4].innerText.trim();

            let data = {
                title,
                creator,
                callNumber,
                uriRecord,
                uriFacsimile
            }
            return data;
        }); 

        // Add our bibliographic data to each object containing our report data.
        dataObj[i].bibliographicData = bibData;
    }
    console.log('Extracting bibliographic data done!');

    console.log('Writing all of our data to a file...');
    fs.writeFile('./outputs/phillyHoodsData.json', JSON.stringify(dataObj, null, 2), (err) => {
        console.log(err);
    });
    console.log('Writing all of our data to a file done!');

    // Navigate to each image page based on the number of pages and save jpegs to places.
    // For each individual report...
    console.log("Extracting page images for all reports...");
    for (let i = 0; i < dataObj.length; i++) {

        // Determine the number of pages to extract...
        const numPages = dataObj[i].tocs[dataObj[i].tocs.length - 1].pageNumber;
        let thisPage = 1;

        // Visit each page...
        while (thisPage <= numPages) {

            let regex = /PagePosition=\d/;
            let startUrl = dataObj[i].report.imageStart;
            let thisPageUrl = startUrl.replace(regex, `PagePosition=${thisPage}`);

            // console.log(thisPageUrl);
            await page.goto(thisPageUrl);

            // Extract the image path for full res file.
            const fullImagePath = await page.evaluate(() => {
                let imgSrc = document.querySelector('body > table:nth-child(2) > tbody > tr > td > form > input.zoomcursor').getAttribute('src');
                return imgSrc;
            });

            // Create a file, request via http, pipe data into file.
            const file = await fs.createWriteStream(`./outputs/images/${dataObj[i].report.id}page${thisPage}.jpg`);
            await http.get(fullImagePath, (response) => { 
                response.pipe(file);
            });

            console.log(`${dataObj[i].report.id} page${thisPage} downloaded.`);

            thisPage++;
        }
        
    }
    
    console.log("All page image reports have been downloaded!");
    // End our browser session.
    browser.close();

    // Return our report data object (Not currently being used in callback).
    return dataObj;
};

scrape().then((value) => {
    console.log("Success! Everything has been scraped :)"); // Success!
});
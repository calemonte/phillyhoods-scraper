'use strict';

const puppeteer = require('puppeteer');
const http = require('http');
const fs = require('fs');

const URL = 'http://sceti.library.upenn.edu/Philaneighborhoods/browse.cfm#';

let scrape = async () => {
    let dataObj = [];

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // await page.goto(URL);

    const ids = [4781, 5931, 2608, 5985, 5923, 4783, 4093, 2591, 2720, 4373, 4374, 4375, 4376, 6340, 5926, 5932, 4074, 5934, 4131, 4088, 5986, 6147, 4327, 6301, 5937, 5922, 5928, 2614, 5929, 4331, 4332, 4378, 5938, 4785, 4283, 4368, 5945, 2741, 4334];

    // Parse the main browse page and exract all unique IDs for each report (contained in the onclick attributes)
    // const ids = await page.evaluate(() => {
    //     let elements = Array.from(document.querySelectorAll('.hioff > a')); // Select all links
    //     let valueArray = elements.map(element => {
    //         const id = element.getAttribute('onclick').match(/\d{4}/); // Get the ids of each report
    //         return id;
    //     });

    //     return valueArray; // Return our array of links pointing to the full content.
    // });

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
                } else if (text === "Personal Name") {
                    const contributor = content[i].innerText;
                    data.contributor = contributor;
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
                if (data.callNumber && data.callNumber.slice(-4).includes("19")) {
                data.year = data.callNumber.slice(-4);
                } else if (data.title && data.title.slice(-4).includes("19")) {
                    data.year = data.title.slice(-4);
                } else {
                    data.year = "Unknown";
                }
            }

            return data;
        }); 

        // Add our bibliographic data to each object containing our report data.
        dataObj[i].bibliographicData = bibData;
    }
    console.log('Extracting bibliographic data done!');

    console.log('Writing all of our data to a file...');
    fs.writeFile('./outputs/phillyHoodsDataSecondPage_Mar1.json', JSON.stringify(dataObj, null, 2), (err) => {
        console.log(err);
    });
    console.log('Writing all of our data to a file done!');

    Navigate to each image page based on the number of pages and save jpegs to places.
    For each individual report...
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
                const img = document.querySelector('body > table:nth-child(2) > tbody > tr > td > form > input.zoomcursor');

                const imgSrc = (!img) ? 'http://upload.wikimedia.org/wikipedia/commons/8/86/Blank_page_3.jpg' : img.getAttribute('src');
                return imgSrc;
          
            })
            .catch(err => console.log(err));
            // console.log(fullImagePath);

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
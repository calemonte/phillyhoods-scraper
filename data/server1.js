const puppeteer = require('puppeteer');
const fs = require('fs');

const URL = 'http://sceti.library.upenn.edu/Philaneighborhoods/browse.cfm#';

let scrape = async () => {
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
    let links = [];
    for (i = 0; i < ids.length; i++) {
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

    // Print these out to a file for safe keeping.
    // fs.writeFile('./outputs/all-links.json', JSON.stringify(links, null, 2), (err) => {
    //     console.log(err);
    // });

    // NEXT STEPS: 
    // Navigate to each of the Table of Contents and extract the page numbers and headings, then write to a file appropriately title folder;
    // let testToc = [ links[0].toc, links[1].toc ];
    let extractedTocData = [];

    for (let i = 0; i < links.length; i++) {
        const url = links[i].toc;
        await page.goto(url);
        // Loop over the sections and create a list of all of the toc headings and their page numbers.
        const tocs = await page.evaluate(() => {
            let sections = document.querySelector('body > table > tbody > tr:nth-child(1) > td:nth-child(2) > select');

            data = [];
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

        extractedTocData.push({
            id: links[i],
            tocs,
        });
    }

    fs.writeFile('./outputs/toc-data.json', JSON.stringify(extractedTocData, null, 2), (err) => {
        console.log(err);
    });

    // Navigate to each of the bibliographic info pages and extract all of the relevant metadata, then write to a file appropriately title folder;
    // Navigate to each image page based on the number of pages and save jpegs to places.

    // End our browser session.
    browser.close();

    // Return whatever needs returning.
    return extractedTocData;
};

scrape().then((value) => {
    console.log(value); // Success!
});
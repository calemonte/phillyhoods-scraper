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
        let id = `${ids[i]}`;
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
    fs.writeFile('./outputs/all-links.json', JSON.stringify(links, null, 2), (err) => {
        console.log(err);
    });

    // NEXT STEPS: 
    // Navigate to each of the Table of Contents and extract the page numbers and headings, then write to a file appropriately title folder;
    // Navigate to each of the bibliographic info pages and extract all of the relevant metadata, then write to a file appropriately title folder;
    // Navigate to each image page based on the number of pages and save jpegs to places.


    // Go to all of the urls in our newly created array and extract the titles.
    // let test = [ result[0], result[1] ];

    // let extractedTitles = [];
    // for (let i = 0; i < test.length; i++) {
    //     const url = test[i];
    //     await page.goto(url);
    //     const title = await page.evaluate(() => {
    //         let title = document.querySelector('head > title').innerText;
    //         let tocHref = document.querySelector('body > table.main > tbody > tr.menu > td > table > tbody > tr > td:nth-child(4) > a').getAttribute('href'); // Grab the link to the ToC
    //         return {
    //             title,
    //             tocHref,

    //         };
    //     }); 
    //     extractedTitles.push(title);
    // }

    // End our browser session.
    browser.close();

    // Return whatever needs returning.
    return links;
};

scrape().then((value) => {
    console.log(value); // Success!
});
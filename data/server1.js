const puppeteer = require('puppeteer');
const fs = require('fs');

const URL = 'http://sceti.library.upenn.edu/Philaneighborhoods/browse.cfm#';

let scrape = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(URL);

    // Parse the main browse page and exract all clickable links (contained in the onclick attributes)
    const result = await page.evaluate(() => {
        let elements = Array.from(document.querySelectorAll('.hioff > a')); // Select all links
        let links = elements.map(element => {
            const urlSuffix = element.getAttribute('onclick').match(/\/pages\/index.cfm\?so_id=\d{4}/);
            const urlPrefix = 'http://sceti.library.upenn.edu';
            const urlFinal = urlPrefix + urlSuffix;
            return urlFinal;
        });

        return links; // Return our array of links pointing to the full content.
    });

    // Go to all of the urls in our newly created array and extract the titles.
    let extractedTitles = [];
    for (let i = 0; i < result.length; i++) {
        const url = test[i];
        await page.goto(url);
        const title = await page.evaluate(() => {
            let title = document.querySelector('head > title').innerText;
            return title;
        }); 
        extractedTitles.push(title);
    }

    browser.close();
    return extractedTitles;
};

scrape().then((value) => {
    console.log(value); // Success!
});
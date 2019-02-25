const puppeteer = require('puppeteer');
const http = require('http');
const fs = require('fs');

let scrape = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    fs.readFileSync('./outputs/phillyHoodsData.json');

    const links = [
      // This is where you can add a small batch of reports
    ];

    // For each individual report...
    console.log("Extracting page images for all reports...");
    for (let i = 0; i < links.length; i++) {

        // Determine the number of pages to extract...
        const numPages = links[i].tocs[links[i].tocs.length - 1].pageNumber;
        let thisPage = 1;

        // Visit each page...
        while (thisPage <= numPages) {

            let regex = /PagePosition=\d/;
            let startUrl = links[i].report.imageStart;
            let thisPageUrl = startUrl.replace(regex, `PagePosition=${thisPage}`);

            // console.log(thisPageUrl);
            await page.goto(thisPageUrl);

            // Extract the image path for full res file.
            const fullImagePath = await page.evaluate(() => {
                let imgSrc = document.querySelector('body > table:nth-child(2) > tbody > tr > td > form > input.zoomcursor').getAttribute('src');
                return imgSrc;
            });
            // console.log(fullImagePath);

            // Create a file, request via http, pipe data into file.
            const file = await fs.createWriteStream(`./outputs/images/${links[i].report.id}page${thisPage}.jpg`);
            await http.get(fullImagePath, (response) => { 
                response.pipe(file);
            });

            console.log(`${links[i].report.id} page${thisPage} downloaded.`);

            thisPage++;
        }
        
    }

    console.log("All page image reports have been downloaded!");
    browser.close();
    return "result"; // Return the data
};

scrape().then((value) => {
    console.log(value); // Success!
});
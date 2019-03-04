'use strict';

const puppeteer = require('puppeteer');
const http = require('http');
const fs = require('fs');
const reportData = require('./outputs/phillyHoodsData_Final.json');

const URL = 'http://sceti.library.upenn.edu/Philaneighborhoods/neighborhoods.cfm#';

let scrape = async () => {

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(URL);

    // Parse the map pages and extract neighborhoods information.
    const hoods = await page.evaluate(() => {
        let hoodObj = [];

        // Select all hood nodes and turn them into an array.
        const hoodNodes = Array.from(document.querySelectorAll('.hoods')); 
    
        // Loop over the node arrays...
        for (let i = 0; i < hoodNodes.length; i++) {

            // Find the region name for each node.
            const text = hoodNodes[i].textContent.split('\n');

            // Loop over and find us the region names.
            let tempTitle, region;
            for (let j = 0; j < text.length; j++) {
                if (text[j].includes('map')) {
                    tempTitle = text[j].split("(");
                    region = tempTitle[0].trim();
                    break;
                }
            }
            
            // Grab the region ids (this is then used later for the select dropdown).
            const regionId = hoodNodes[i].getAttribute('id');

            // Lastly, grab all of the reports that are associated with this particular region.
            const links = hoodNodes[i].querySelectorAll('a');
            let reports = [];
            for (let k = 0; k < links.length; k++) {
                if (links[k].getAttribute('href').includes('http://sceti.library.upenn.edu/')) {
                    let id = links[k].getAttribute('href').match(/\d{4}/);
                    reports.push(id[0]);
                }
            }

            hoodObj.push({
                region,
                regionId,
                neighborhoods: [], // We'll add our neigborhoods in the next bit of code.
                reports,
            });

        }

        return hoodObj;
    });

    //  Loop over the sections and create a list of all of the toc headings and their page numbers.
    await page.goto(URL);
    const neigborhoodNodes = await page.evaluate(() => { 

        // Now, grab the dropdown select menu and add individual neighborhoods to each of the neighborhood objects that we've created.
        const selectNodes = Array.from(document.querySelector('select'));
        let data = [];
        for (let t = 0; t < selectNodes.length; t++) {
            const id = selectNodes[t].getAttribute('value');
            const name = selectNodes[t].innerText.trim();
            data.push({ id, name });
        }
        return data;
    });

    // Map over the child option nodes contained in the select node and add each neighborhood to their corresponding region.
    neigborhoodNodes.map(element => {

        for (let v = 0; v < hoods.length; v++) {
            if (element.id === hoods[v].regionId) {
                hoods[v].neighborhoods.push(element.name);
            }
        }

    });
    
    // End our browser session.
    browser.close();

    // Return our region + neighborhood data.
    return hoods;
};


scrape().then((hoods) => {

    // With all of our extracted neighborhood data, map over the report data and assign a region where there is one.
    reportData.map(thisReport => {

        for (let w = 0; w < hoods.length; w++) {
            if (hoods[w].reports.length) {
              for (let z = 0; z < hoods[w].reports.length; z++) {
                    if (hoods[w].reports[z] === thisReport.report.id) {
                        thisReport.bibliographicData.region = hoods[w].region;
                    }
                }
            }
        }
        
    }); 
    
    console.log(reportData);
});
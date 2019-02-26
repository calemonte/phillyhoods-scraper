const puppeteer = require('puppeteer');
const http = require('http');
const fs = require('fs');

let scrape = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    fs.readFileSync('./outputs/phillyHoodsData.json');

    const links = [
      // This is where you can add a small batch of reports
      {
        "report": {
          "id": "4781",
          "main": "http://sceti.library.upenn.edu/pages/index.cfm?so_id=4781",
          "toc": "http://sceti.library.upenn.edu/pages/popup_jump.cfm?so_id=4781&pageposition=1",
          "bibInfo": "http://sceti.library.upenn.edu/pages/biblio-record.cfm?so_id=4781",
          "imageStart": "http://sceti.library.upenn.edu/pages/index.cfm?so_id=4781&PagePosition=1&level=1"
        },
        "tocs": [
          {
            "pageNumber": 1,
            "pageTitle": "select a section"
          },
          {
            "pageNumber": 1,
            "pageTitle": "Original Cover"
          },
          {
            "pageNumber": 3,
            "pageTitle": "Title Page"
          },
          {
            "pageNumber": 5,
            "pageTitle": "Table of Contents"
          },
          {
            "pageNumber": 6,
            "pageTitle": "Maps"
          },
          {
            "pageNumber": 7,
            "pageTitle": "Charts"
          },
          {
            "pageNumber": 8,
            "pageTitle": "A Guide to the Publication"
          },
          {
            "pageNumber": 11,
            "pageTitle": "Chapter 1: Introduction"
          },
          {
            "pageNumber": 13,
            "pageTitle": "Map: North Philadelphia: Location and Planning Analysis Sections"
          },
          {
            "pageNumber": 17,
            "pageTitle": "Map: Major Features"
          },
          {
            "pageNumber": 19,
            "pageTitle": "Map: North Philadelphia Neighborhoods"
          },
          {
            "pageNumber": 20,
            "pageTitle": "Hispanic and Black Populations, 1980"
          },
          {
            "pageNumber": 25,
            "pageTitle": "Chapter 2: District Wide Recommendations"
          },
          {
            "pageNumber": 27,
            "pageTitle": "Map: New Subsidized Housing, 1980-1985"
          },
          {
            "pageNumber": 34,
            "pageTitle": "Map: Long-Term Residential Vacancy, 1984"
          },
          {
            "pageNumber": 38,
            "pageTitle": "Map: Owner-Occupied Housing, 1980"
          },
          {
            "pageNumber": 47,
            "pageTitle": "Map: Cp,,ercoa; and Industrial Development Areas"
          },
          {
            "pageNumber": 49,
            "pageTitle": "Map: Persons Below Poverty"
          },
          {
            "pageNumber": 51,
            "pageTitle": "Map: Female-Headed Households with Children Under 18, 1980"
          },
          {
            "pageNumber": 53,
            "pageTitle": "Map: Unemployment"
          },
          {
            "pageNumber": 69,
            "pageTitle": "Map: Public Health Centers and Hospitals"
          },
          {
            "pageNumber": 73,
            "pageTitle": "Map: Recreation Facilities"
          },
          {
            "pageNumber": 75,
            "pageTitle": "Map: Transportation Facilities"
          },
          {
            "pageNumber": 81,
            "pageTitle": "Map: Schools and Libraries"
          },
          {
            "pageNumber": 91,
            "pageTitle": "Map: Police and Fire Dept. Facilities"
          },
          {
            "pageNumber": 93,
            "pageTitle": "Chapter 3: Community Plans"
          },
          {
            "pageNumber": 95,
            "pageTitle": "Map: North Philadelphia Physical Development Concept"
          },
          {
            "pageNumber": 97,
            "pageTitle": "Map: North Philadelphia District Center - Existing Conditions"
          },
          {
            "pageNumber": 99,
            "pageTitle": "Map: North Philadelphia District Center - Recommendations"
          },
          {
            "pageNumber": 102,
            "pageTitle": "Map: Fairhill/West Kensington/St. Edward's - Existing Conditions"
          },
          {
            "pageNumber": 103,
            "pageTitle": "Map: Fairhill/West Kensington/St. Edward's - Recommendations"
          },
          {
            "pageNumber": 106,
            "pageTitle": "Map: St. Hugh - Existing Conditions"
          },
          {
            "pageNumber": 107,
            "pageTitle": "Map: St. Hugh - Recommendations"
          },
          {
            "pageNumber": 110,
            "pageTitle": "Map: Tioga/Nicetown/Hunting Park - Existing Conditions"
          },
          {
            "pageNumber": 111,
            "pageTitle": "Map: Tioga/Nicetown/Hunting Park - Recommendations"
          },
          {
            "pageNumber": 113,
            "pageTitle": "Map: North Central Community"
          },
          {
            "pageNumber": 115,
            "pageTitle": "Map: Broad and Susquehanna Development Area - Existing Conditions"
          },
          {
            "pageNumber": 116,
            "pageTitle": "Map: Broad and Susquehanna Development Area - Recommendations"
          },
          {
            "pageNumber": 118,
            "pageTitle": "Map: Cecil B. Moore Avenue Development Area - Existing Conditions"
          },
          {
            "pageNumber": 119,
            "pageTitle": "Map: Cecil B. Moore Avenue Development Area - Recommendations"
          },
          {
            "pageNumber": 123,
            "pageTitle": "Map: East of Broad Development Area - Existing Conditions"
          },
          {
            "pageNumber": 124,
            "pageTitle": "Map: East of Broad Development Area - Recommendations"
          },
          {
            "pageNumber": 127,
            "pageTitle": "Map: Strawberry Mansion - Existing Conditions"
          },
          {
            "pageNumber": 128,
            "pageTitle": "Map: Strawberry Mansion - Recommendations"
          },
          {
            "pageNumber": 131,
            "pageTitle": "Map: Allegheny West - Existing Conditions"
          },
          {
            "pageNumber": 132,
            "pageTitle": "Map: Allegheny West - Recommendations"
          },
          {
            "pageNumber": 134,
            "pageTitle": "Map: Francisville/Spring Garden/Fairmount - Existing Conditions"
          },
          {
            "pageNumber": 135,
            "pageTitle": "Map: Francisville/Spring Garden/Fairmount - Recommendations"
          },
          {
            "pageNumber": 138,
            "pageTitle": "Map: Poplar/Northern Liberties/Olde Kensington/Kensington South/Ludlow - Existing Conditions"
          },
          {
            "pageNumber": 139,
            "pageTitle": "Map: Poplar/Northern Liberties/Olde Kensington/Kensington South/Ludlow - Recommendations"
          },
          {
            "pageNumber": 143,
            "pageTitle": "Chapter 4: The Challenge"
          }
        ],
        "bibliographicData": {
          "title": "North Philadelphia Plan [1987]",
          "creator": "Philadelphia City Planning Commission",
          "callNumber": "HT 177 P5 P5332 1987",
          "uriRecord": "http://hdl.library.upenn.edu/1017.4/4781-record",
          "uriFacsimile": "http://hdl.library.upenn.edu/1017.4/4781"
        }
      },
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
                const img = document.querySelector('body > table:nth-child(2) > tbody > tr > td > form > input.zoomcursor');

                const imgSrc = (!img) ? 'http://upload.wikimedia.org/wikipedia/commons/8/86/Blank_page_3.jpg' : img.getAttribute('src');
                return imgSrc;
          
            })
            .catch(err => console.log(err));
            // console.log(fullImagePath);

            // Create a file, request via http, pipe data into file.
            const file = await fs.createWriteStream(`./test/${links[i].report.id}page${thisPage}.jpg`);
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
})
.catch(err => console.log(err));
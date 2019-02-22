const rp = require('request-promise');
const $ = require('cheerio');
const puppeteer = require('puppeteer');
const fs = require('fs');

const URL = 'http://sceti.library.upenn.edu/Philaneighborhoods/browse.cfm#';

let extractedURLs = [];

// Main process
puppeteer
  .launch()
  .then(function(browser) {
    return browser.newPage();
  })
  .then(function(page) {
    return page.goto(URL).then(function() {
      return page.content();
    });
  })
  .then(function(html) {
    // Grab our paths from the onClick event embedded in the rendered HTML.
    const paths = $('.hioff > a[onclick^="javascript:window.open"]', html);

    // Create the urls to access the content contained in the pop-up window.
    for (let i = 0; i < paths.length; i++) {
        const str = paths[i].attribs.onclick;
        const urlSuffix = str.match(/\/pages\/index.cfm\?so_id=\d{4}/); // Pick out the URL suffix. 
        const urlPrefix = 'http://sceti.library.upenn.edu';
        const urlFinal = urlPrefix + urlSuffix;

        extractedURLs.push(urlFinal);

        // Export our URLs to a text file.
        fs.appendFile('./outputs/links.txt', `${urlFinal}\n`, (err) => {
            console.log(err);
        });

    }

    browser.close();

  })
  .catch(function(err) {
    console.log(err);
  });
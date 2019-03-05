const puppeteer = require("puppeteer");
const URL = 'http://sceti.library.upenn.edu/Philaneighborhoods/search.cfm';
const LIBRARY_HOMEPAGE = 'http://www.library.upenn.edu';
const date = new Date().getMilliseconds();

// (async () => {
//   try {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();

//     await page.goto(URL);

//     await page.click('#keywordDistrict > form > table > tbody > tr:nth-child(3) > td:nth-child(2) > select > option:nth-child(4)');
//     await page.type('input[type="text"]', "belmont");
//     await page.click('input[name="Submit"]');

//     await page.waitForNavigation();
//     await page.screenshot({ path: `searchResults${date}.png` });

//     await browser.close();
//   } catch (error) {
//     console.log(error);
//   }
// })();

(async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(URL);

    await page.type('#msquery', "belmont");
    await page.click('#mtsearch > div:nth-child(3) > input');

    await page.waitForNavigation();
    await page.screenshot({ path: `libraryHomepageSearchResults${date}.png` });

    await browser.close();
  } catch (error) {
    console.log(error);
  }
})();

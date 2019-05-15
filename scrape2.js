// const puppeteer = require('puppeteer');
// const $ = require('cheerio');
// const url = 'https://www.reddit.com';
//
//
// (async () => {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   const url = 'https://www.reddit.com';
//   await page.goto(url);
//   //await page.screenshot({path: 'example.png'});
//
//   const titles = await page.evaluate(() =>
//     Array.from(document.querySelectorAll('h2'))
//     .map(title => title.innerText)
//   )
//
//   console.log(titles);
//
//   await browser.close();
// })();

const puppeteer = require('puppeteer');
const $ = require('cheerio');
const url = 'https://www.reddit.com';

puppeteer
  .launch()
  .then(function(browser) {
    return browser.newPage();
  })
  .then(function(page) {
    return page.goto(url).then(function() {
      return page.content();
    });
  })
  .then(function(html) {
    $('h2', html).each(function() {
      console.log($(this).text());
    });
  })
  .then(function(browser){
    return browser.close();
  })
  .catch(function(err) {
    //handle error
  })
  ;

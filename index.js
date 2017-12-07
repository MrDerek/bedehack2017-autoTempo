const puppeteer = require('puppeteer');
const settings = require('./settings');

async function run() {
  const browser = await puppeteer.launch({
    headless: false
  });
  
  const page = await browser.newPage();
  await page.setViewport({width: 1024, height: 768});
  await page.goto('https://bedegaming.atlassian.net/plugins/servlet/ac/is.origo.jira.tempo-plugin/tempo-my-work#!/timesheet/', {waitUntil: 'networkidle'});


  await page.waitFor(5000);
  browser.close();
}
run();
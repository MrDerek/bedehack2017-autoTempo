const puppeteer = require('puppeteer');
const settings = require('./settings');
const width = 1920;
const height = 1080;

async function run() {
  const browser = await puppeteer.launch({
    headless: false,
    args: [`--window-size=${width},${height}`]
  });
  
  const page = await browser.newPage();
  await page.setViewport({width, height});
  await page.goto('https://bedegaming.atlassian.net/plugins/servlet/ac/is.origo.jira.tempo-plugin/tempo-my-work#!/timesheet/', {waitUntil: 'networkidle'});

  await page.click('.login-link');
  await page.waitForSelector('#username');
  await page.type('#username', settings.email);
  await page.click('#login-submit');
  await page.waitFor(3000);
  await page.type('#password', settings.password);
  await page.waitFor(3000);
  await page.click('#login-submit');
  await page.waitFor(10000);
  await page.click('[name="logWorkButton"]');
  await page.waitFor(3000);
  browser.close();
}
run();
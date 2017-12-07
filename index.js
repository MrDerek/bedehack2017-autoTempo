const puppeteer = require('puppeteer');
const settings = require('./settings');

async function run() {
  const browser = await puppeteer.launch({
    headless: false
  });
  
  const page = await browser.newPage();
  await page.setViewport({width: 1024, height: 768});
  await page.goto('https://bedegaming.atlassian.net/plugins/servlet/ac/is.origo.jira.tempo-plugin/tempo-my-work#!/timesheet/', {waitUntil: 'networkidle'});

  await page.click('.login-link');
  await page.waitForSelector('#username');
  await page.type('#username', settings.email);
  await page.click('#login-submit');
  await page.type('#password', settings.password);
  await page.click('#login-submit');
}
run();
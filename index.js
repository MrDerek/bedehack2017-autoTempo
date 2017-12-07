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
  await page.waitFor(15000);
 
 const frames = page.frames()[1];
 let day = new Date().getDate();

 while (day) {
  if (new Date().getDay < 6) {
    await page.waitFor(5000);
    const logWorkButton = await frames.$('[name=logWorkButton]');
    await page.waitFor(1000);
    logWorkButton.click();
    await page.waitFor(2000);

    const searchIssue = await frames.$('#issuePickerInput');
    searchIssue.click();

    await page.waitFor(2000);
    const assigned = await frames.$('#assigned');
    assigned.click();

    await page.waitFor(15000);
    const firstTicket = await frames.$('.kPwaDr');
    firstTicket.click();

    await page.waitFor(5000);
    const started = await frames.$('#started');
    await page.waitFor(1000);
    started.focus();
    await page.waitFor(1000);

    for (var i = new Date().getDate(); i > day; i--) {
      await page.keyboard.press('ArrowLeft');
    }

    await page.waitFor(1000);
    await page.keyboard.press('Enter');

    await page.waitFor(1000);
    const workedInput = await frames.$('#timeSpentSeconds');
    await page.waitFor(1000);
    workedInput.focus();
    await page.keyboard.type('8');

    await page.waitFor(2000);
    const logWorkSubmitButton = await frames.$('#worklogForm .tuiButton--primary');
    logWorkSubmitButton.click();
  }

   day--;
 }

  await page.waitFor(5000);
  browser.close();
}
run();
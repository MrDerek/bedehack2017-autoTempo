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
  const date = new Date();
  let day = date.getDate();

  while (day) {
    if (date.getDay() > 0 && date.getDay() < 6) {

      let dayTotal;
      await frames.evaluate(day => {
        const date = new Date();
        return document.querySelector(`[name=footerCell_${date.getFullYear()}-${date.getMonth() + 1}-${(day < 10) ? `0${day}` : day}]`).innerHTML;
      }, day).then(res => {
        dayTotal = res;
      });

      if (dayTotal === '0') {
        const logWorkButton = await frames.$('[name=logWorkButton]');
        await page.waitFor(1000);
        logWorkButton.click();
        
        await frames.waitForSelector('#issuePickerInput');
        const searchIssue = await frames.$('#issuePickerInput');
        searchIssue.click();

        await frames.waitForSelector('#assigned');
        const assigned = await frames.$('#assigned');
        assigned.click();

        await frames.waitForSelector('.kPwaDr');
        const firstTicket = await frames.$('.kPwaDr');
        firstTicket.click();

        await frames.waitForSelector('#started');
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

        await frames.waitForSelector('#worklogForm .tuiButton--primary');
        const logWorkSubmitButton = await frames.$('#worklogForm .tuiButton--primary');
        logWorkSubmitButton.click();
      }
    }

    date.setDate(date.getDate() - 1);
    await page.waitFor(5000);
    day--;
  }

  await page.waitFor(5000);
  browser.close();
}

run();

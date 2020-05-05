const chrome = require("chrome-aws-lambda");
const puppeteer = require("puppeteer-core");

const URL_REGEXP = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;

module.exports = async function (req, res) {
  const { query = {} } = require("url").parse(req.url, true);
  let { url, width = 1280, height = 800 } = query;

  if (!url) {
    res.statusCode = 400;
    res.end("Missing query parameter: 'url'");
    return;
  }

  if (!url.startsWith("http")) {
    url = "https://" + url; // add protocol if missing
  }

  if (!url.match(URL_REGEXP)) {
    res.statusCode = 400;
    res.end("Invalid url: " + url);
    return;
  }

  if (!(width >= 360 && width <= 1920)) {
    res.statusCode = 400;
    res.end(`Invalid width: ${width}. Please provide a width between 360 and 1920`);
    return;
  }

  if (!(height >= 360 && height <= 1920)) {
    res.statusCode = 400;
    res.end(`Invalid height: ${height}. Please provide a height between 360 and 1920`);
    return;
  }

  const file = await getScreenshot(url, +width, +height);

  res.statusCode = 200;
  res.setHeader("Content-Type", `image/png`);
  res.end(file);
};

async function getScreenshot(url, width, height) {
  const browser = await puppeteer.launch({
    args: chrome.args,
    executablePath: await chrome.executablePath,
    headless: chrome.headless
  });

  const page = await browser.newPage();
  await page.setViewport({
    width,
    height,
    deviceScaleFactor: 1
  });
  await page.goto(url);
  const file = await page.screenshot({ type: "png" });
  await browser.close();
  return file;
}

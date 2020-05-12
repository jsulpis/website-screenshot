import getHtml from "./getHtml";

import chrome from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";

export default async function getScreenshot(url: string, width: number, height: number) {
  const browser = await puppeteer.launch({
    args: chrome.args,
    executablePath: await chrome.executablePath,
    headless: chrome.headless
  });

  const page1 = await browser.newPage();
  await page1.setViewport({
    width,
    height,
    deviceScaleFactor: 1
  });
  await page1.goto(url);
  const screenshotBase64 = await page1.screenshot({ encoding: "base64" });

  const page2 = await browser.newPage();
  // await page2.setViewport({ width: 2048, height: 1170 });
  await page2.setContent(getHtml(screenshotBase64));
  await page2.setViewport({
    width: width + 20,
    height: height + 20,
    deviceScaleFactor: 1
  });
  const file = await page2.screenshot({ type: "png", omitBackground: true });

  await browser.close();

  return file;
  // return screenshotBase64;
}

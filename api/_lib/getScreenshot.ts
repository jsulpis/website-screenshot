import getHtml from "./getHtml";

import chrome from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";

const shadowSize = {
  small: 12,
  medium: 25,
  large: 50
};

/**
 * Take a screenshot of a website and add graphic elements to it
 *
 * @param url url of the website to capture
 * @param width width of the screenshot
 * @param height height of the screenshot
 */
export default async function getScreenshot(
  url: string,
  width: number,
  height: number,
  shadow: "none" | "small" | "medium" | "large"
): Promise<string> {
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
  let outputBase64: string;

  if (!!shadow && shadow !== "none") {
    const page2 = await browser.newPage();
    await page2.setContent(getHtml(screenshotBase64, shadow));
    await page2.setViewport({
      width: width + shadowSize[shadow],
      height: height + shadowSize[shadow],
      deviceScaleFactor: 1
    });
    outputBase64 = await page2.screenshot({ encoding: "base64", omitBackground: true });
  } else {
    outputBase64 = screenshotBase64;
  }

  await browser.close();

  return outputBase64;
}

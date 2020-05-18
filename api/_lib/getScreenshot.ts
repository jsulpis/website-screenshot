import getHtml from "./getHtml";

import chrome from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";

const shadowSize = {
  none: 0,
  small: 25,
  medium: 40,
  large: 70
};
export type ShadowOption = "none" | "small" | "medium" | "large";
export type WindowOption = "none" | "mac-os";
export const OUTPUT_IMAGE_HEIGHT = 500;
export const WINDOW_TOP_BAR_HEIGHT = 24;

/**
 * Take a screenshot of a website and add style to it
 *
 * @param url url of the website to capture
 * @param width width of the screenshot
 * @param height height of the screenshot
 */
export default async function getScreenshot(
  url: string,
  width: number,
  height: number,
  shadow: ShadowOption,
  radius: number,
  window: WindowOption
): Promise<string> {
  const browser = await puppeteer.launch({
    args: chrome.args,
    executablePath: await chrome.executablePath,
    headless: chrome.headless
  });

  const websiteScreenshotBase64 = await takeFirstScreenshot(browser, width, height, url, window);
  const outputBase64 = await takeSecondScreenshot(
    browser,
    websiteScreenshotBase64,
    shadow,
    radius,
    width,
    height,
    window
  );

  await browser.close();

  return outputBase64;
}

/**
 * Take a screenshot of the website at the requested resolution
 */
async function takeFirstScreenshot(
  browser: puppeteer.Browser,
  width: number,
  height: number,
  url: string,
  window: WindowOption
) {
  const page1 = await browser.newPage();

  // Viewport size
  let firstScreenshotHeight = height;
  if (window && window !== "none") {
    const topBarHeight = Math.ceil((height * WINDOW_TOP_BAR_HEIGHT) / OUTPUT_IMAGE_HEIGHT);
    firstScreenshotHeight = height - topBarHeight;
  }

  await page1.setViewport({
    width,
    height: firstScreenshotHeight,
    deviceScaleFactor: 1
  });

  // Content
  await page1.goto(url);

  // Screenshot
  return await page1.screenshot({ encoding: "base64" });
}

/**
 * Take a second screenshot to apply scale and add styling: shadow, window top bar...
 */
async function takeSecondScreenshot(
  browser: puppeteer.Browser,
  websiteScreenshotBase64: string,
  shadow: ShadowOption,
  radius: number,
  width: number,
  height: number,
  window: WindowOption
) {
  const page2 = await browser.newPage();

  // Viewport size
  const aspectRatio = width / height;
  const secondScreenshotHeight = OUTPUT_IMAGE_HEIGHT + shadowSize[shadow];
  const secondScreenshotWidth = Math.floor(secondScreenshotHeight * aspectRatio);
  await page2.setViewport({
    width: secondScreenshotWidth,
    height: secondScreenshotHeight,
    deviceScaleFactor: 1
  });

  // Content
  const html = getHtml(websiteScreenshotBase64, shadow, radius, window);
  await page2.setContent(html);

  // Screenshot
  return await page2.screenshot({ encoding: "base64", omitBackground: true });
}

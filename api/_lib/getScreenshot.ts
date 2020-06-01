import getHtml from "./getHtml";

import chrome from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";

export const SHADOW_SIZES = {
  none: 0,
  small: 25,
  medium: 40,
  large: 70
};
export type ShadowOption = "none" | "small" | "medium" | "large";
export type WindowOption = "none" | "mac-os";

export const WINDOW_TOP_BAR_HEIGHT = 28;

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
  window: WindowOption,
  outputHeight: number
): Promise<string> {
  const browser = await puppeteer.launch({
    args: chrome.args,
    executablePath: await chrome.executablePath,
    headless: chrome.headless
  });

  // Height of the div containing the image in the second screenshot. Use here to compute the height of the top bar proportionally
  const secondScreenshotContainerHeight = outputHeight - SHADOW_SIZES[shadow];
  let firstScreenshotHeight = height;
  if (window && window !== "none") {
    const topBarHeight = Math.ceil((height * WINDOW_TOP_BAR_HEIGHT) / secondScreenshotContainerHeight);
    firstScreenshotHeight = height - topBarHeight;
  }
  const websiteScreenshotBase64 = await takeFirstScreenshot(url, width, firstScreenshotHeight, browser);

  const aspectRatio = width / height;
  const outputBase64 = await takeSecondScreenshot(
    browser,
    websiteScreenshotBase64,
    shadow,
    radius,
    aspectRatio,
    window,
    secondScreenshotContainerHeight,
    outputHeight
  );

  await browser.close();

  return outputBase64;
}

/**
 * Take a screenshot of the website at the requested resolution
 */
async function takeFirstScreenshot(url: string, width: number, height: number, browser: puppeteer.Browser) {
  const page1 = await browser.newPage();

  await page1.setViewport({
    width,
    height: height,
    deviceScaleFactor: 1
  });

  await page1.goto(url);

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
  aspectRatio: number,
  window: WindowOption,
  secondScreenshotContainerHeight: number,
  outputHeight: number
) {
  const page2 = await browser.newPage();

  // Viewport size
  await page2.setViewport({
    width: Math.floor(outputHeight * aspectRatio),
    height: outputHeight,
    deviceScaleFactor: 1
  });

  // Content
  const html = getHtml(websiteScreenshotBase64, secondScreenshotContainerHeight, shadow, radius, window);
  await page2.setContent(html);

  // Screenshot
  return await page2.screenshot({ encoding: "base64", omitBackground: true });
}

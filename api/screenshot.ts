import { IncomingMessage, ServerResponse } from "http";
import getScreenshot from "./_lib/getScreenshot";

const URL_REGEXP = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
const DEFAULT_WIDTH = 1280;
const DEFAULT_HEIGHT = 800;
const DEFAULT_SHADOW = "none";
const DEFAULT_RADIUS = 0;
const DEFAULT_WINDOW = "none";
const MIN_VIEWPORT_WIDTH = 360;
const MAX_VIEWPORT_WIDTH = 1920;
const MIN_VIEWPORT_HEIGHT = 360;
const MAX_VIEWPORT_HEIGHT = 1920;

module.exports = async function (req: IncomingMessage, res: ServerResponse) {
  const { query = {} } = require("url").parse(req.url, true);
  let {
    url,
    width = DEFAULT_WIDTH,
    height = DEFAULT_HEIGHT,
    shadow = DEFAULT_SHADOW,
    radius = DEFAULT_RADIUS,
    window = DEFAULT_WINDOW,
    outputHeight
  } = query;

  outputHeight = outputHeight || height;

  const { statusCode, errorMessage } = checkArguments(url, width, height, shadow, radius, window, outputHeight);
  if (!!errorMessage) {
    res.statusCode = statusCode;
    res.end(errorMessage);
    return;
  }

  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000"); // Allow to use deployed APIs during local development
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  const screenshot = await getScreenshot(url, +width, +height, shadow, +radius, window, +outputHeight);

  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end(screenshot);
};

function checkArguments(
  url: string,
  width: number,
  height: number,
  shadow: string,
  radius: number,
  window: string,
  outputHeight: number
): { statusCode: number; errorMessage?: string } {
  if (!url) {
    return {
      statusCode: 400,
      errorMessage: `Missing query parameter: ${url}`
    };
  }

  if (!url.match(URL_REGEXP)) {
    return {
      statusCode: 400,
      errorMessage: `Invalid url: ${url}`
    };
  }

  if (!(width >= MIN_VIEWPORT_WIDTH && width <= MAX_VIEWPORT_WIDTH)) {
    return {
      statusCode: 400,
      errorMessage: `Invalid width: ${width}. Please provide a width between 360 and 1920`
    };
  }

  if (height < MIN_VIEWPORT_HEIGHT || height > MAX_VIEWPORT_HEIGHT) {
    return {
      statusCode: 400,
      errorMessage: `Invalid height: ${height}. Please provide a height between ${MIN_VIEWPORT_HEIGHT} and ${MAX_VIEWPORT_HEIGHT}`
    };
  }

  if (["none", "small", "medium", "large"].indexOf(shadow) === -1) {
    return {
      statusCode: 400,
      errorMessage: `Invalid shadow: ${shadow}. The accepted values are: none, small, medium, large`
    };
  }

  if (Number.isNaN(+radius)) {
    return {
      statusCode: 400,
      errorMessage: `Invalid radius: ${radius}. Please provide a number`
    };
  }

  if (["none", "mac-os", "mac-os-dark"].indexOf(window) === -1) {
    return {
      statusCode: 400,
      errorMessage: `Invalid window: ${window}.  The accepted values are: none, mac-os, mac-os-dark`
    };
  }

  if (outputHeight < MIN_VIEWPORT_HEIGHT || outputHeight > MAX_VIEWPORT_HEIGHT) {
    return {
      statusCode: 400,
      errorMessage: `Invalid output height: ${outputHeight}. Please provide a height between ${MIN_VIEWPORT_HEIGHT} and ${MAX_VIEWPORT_HEIGHT}`
    };
  }

  return {
    statusCode: 200
  };
}

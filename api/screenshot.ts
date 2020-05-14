import { IncomingMessage, ServerResponse } from "http";
import getScreenshot from "./_lib/getScreenshot";

const URL_REGEXP = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
const DEFAULT_WIDTH = 1280;
const DEFAULT_HEIGHT = 800;
const DEFAULT_SHADOW = "";
const MIN_VIEWPORT_WIDTH = 360;
const MAX_VIEWPORT_WIDTH = 1920;
const MIN_VIEWPORT_HEIGHT = 360;
const MAX_VIEWPORT_HEIGHT = 1920;

module.exports = async function (req: IncomingMessage, res: ServerResponse) {
  const { query = {} } = require("url").parse(req.url, true);
  let { url, width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT, shadow = DEFAULT_SHADOW } = query;

  const { statusCode, errorMessage } = checkArguments(url, width, height);
  if (!!errorMessage) {
    res.statusCode = statusCode;
    res.end(errorMessage);
    return;
  }

  const origin = req.headers ? (req.headers.origin as string) : "";
  if (
    (origin.startsWith("https://website-screenshot") && origin.endsWith("now.sh")) ||
    origin === "http://localhost:3000"
  ) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  }

  const screenshot = await getScreenshot(url, +width, +height, shadow);

  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end(screenshot);
};

function checkArguments(url: string, width: number, height: number): { statusCode: number; errorMessage?: string } {
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

  if (!(height >= MIN_VIEWPORT_HEIGHT && height <= MAX_VIEWPORT_HEIGHT)) {
    return {
      statusCode: 400,
      errorMessage: `Invalid height: ${height}. Please provide a height between 360 and 1920`
    };
  }
  return {
    statusCode: 200
  };
}

import { IncomingMessage, ServerResponse } from "http";
import getScreenshot from "./_lib/getScreenshot";

const URL_REGEXP = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;

module.exports = async function (req: IncomingMessage, res: ServerResponse) {
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

  const screenshot = await getScreenshot(url, +width, +height);

  res.statusCode = 200;
  // res.setHeader("Content-Type", `text/plain`);
  res.setHeader("Content-Type", `image/png`);
  res.end(screenshot);
};

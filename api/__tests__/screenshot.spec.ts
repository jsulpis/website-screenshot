import getScreenshot from "../_lib/getScreenshot";
import { IncomingMessage, ServerResponse } from "http";

const screenshotApi = require("../screenshot");

jest.mock("../_lib/getScreenshot");

describe("screenshot API", () => {
  const URL = "https://toto.com";
  const WIDTH = 1280;
  const HEIGHT = 800;
  const SHADOW = "medium";
  const RADIUS = 8;
  const WINDOW = "mac-os";
  const OUTPUT_HEIGHT = 600;
  let res: Partial<ServerResponse>;

  beforeEach(() => {
    res = {
      statusCode: undefined,
      setHeader: jest.fn(),
      end: jest.fn()
    };
  });

  it("should return a response built using getScreenshot with the provided arguments", async () => {
    const req = buildRequest();

    await screenshotApi(req, res);

    expect(getScreenshot).toHaveBeenCalledWith(URL, WIDTH, HEIGHT, SHADOW, RADIUS, WINDOW, OUTPUT_HEIGHT);
    expect(res.statusCode).toBe(200);
    expect(res.setHeader).toHaveBeenCalledWith("Content-Type", "text/plain");
    expect(res.end).toHaveBeenCalled();
  });

  it("should have default values except url", async () => {
    const requestUrl = `https://api-url.com?url=${URL}`;
    const req = { url: requestUrl };

    await screenshotApi(req, res);
    expect(res.statusCode).toBe(200);
  });

  it("should reject requests without url parameter", async () => {
    const req = buildRequest("");
    await screenshotApi(req, res);
    expect(res.statusCode).toBe(400);
  });

  it("should reject requests with invalid url parameter", async () => {
    const req = buildRequest("invalid");
    await screenshotApi(req, res);
    expect(res.statusCode).toBe(400);
  });

  it("should reject requests with invalid width parameter", async () => {
    const req = buildRequest(URL, 0);
    await screenshotApi(req, res);
    expect(res.statusCode).toBe(400);
  });

  it("should reject requests with invalid height parameter", async () => {
    const req = buildRequest(URL, WIDTH, 0);
    await screenshotApi(req, res);
    expect(res.statusCode).toBe(400);
  });

  it("should reject requests with invalid shadow parameter", async () => {
    const req = buildRequest(URL, WIDTH, HEIGHT, "invalid");
    await screenshotApi(req, res);
    expect(res.statusCode).toBe(400);
  });

  it("should reject requests with invalid radius parameter", async () => {
    // @ts-ignore
    const req = buildRequest(URL, WIDTH, HEIGHT, SHADOW, "notANumber");
    await screenshotApi(req, res);
    expect(res.statusCode).toBe(400);
  });

  it("should reject requests with invalid window parameter", async () => {
    // @ts-ignore
    const req = buildRequest(URL, WIDTH, HEIGHT, SHADOW, RADIUS, "invalid");
    await screenshotApi(req, res);
    expect(res.statusCode).toBe(400);
  });

  it("should reject requests with invalid output size parameter", async () => {
    // @ts-ignore
    const req = buildRequest(URL, WIDTH, HEIGHT, SHADOW, RADIUS, WINDOW, 8000);
    await screenshotApi(req, res);
    expect(res.statusCode).toBe(400);
  });

  const buildRequest = (
    url = URL,
    width = WIDTH,
    height = HEIGHT,
    shadow = SHADOW,
    radius = RADIUS,
    window = WINDOW,
    outputHeight = OUTPUT_HEIGHT
  ): Partial<IncomingMessage> => ({
    url: `https://api-url.com?url=${url}&width=${width}&height=${height}&shadow=${shadow}&radius=${radius}&window=${window}&outputHeight=${outputHeight}`
  });
});

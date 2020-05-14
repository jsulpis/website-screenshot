import getScreenshot from "../getScreenshot";
import { puppeteer } from "chrome-aws-lambda";

jest.mock("puppeteer-core");

describe("getScreenshot", () => {
  const URL = "https://toto.com";
  const WIDTH = 1280;
  const HEIGHT = 800;

  let mockedBrowser: any;
  let mockedPage: any;

  beforeEach(() => {
    mockedPage = {
      setContent: jest.fn(),
      setViewport: jest.fn(),
      goto: jest.fn(),
      screenshot: jest.fn()
    };
    mockedBrowser = {
      newPage: jest.fn(() => mockedPage),
      close: jest.fn()
    };
    (puppeteer.launch as jest.Mock).mockResolvedValue(mockedBrowser);
  });

  it("should set the viewport dimensions according to the arguments", async () => {
    await getScreenshot(URL, WIDTH, HEIGHT, "none");

    expect(mockedPage.setViewport).toHaveBeenCalledWith({
      width: WIDTH,
      height: HEIGHT,
      deviceScaleFactor: 1
    });
  });

  it("should open a browser and take two screenshots if shadow", async () => {
    await getScreenshot(URL, WIDTH, HEIGHT, "small");

    expect(puppeteer.launch).toHaveBeenCalled();
    expect(mockedPage.screenshot).toHaveBeenCalledTimes(2);
  });
});

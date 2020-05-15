import getScreenshot from "../getScreenshot";
import { puppeteer } from "chrome-aws-lambda";
import getHtml from "../getHtml";

jest.mock("puppeteer-core");
jest.mock("../getHtml");

describe("getScreenshot", () => {
  const URL = "https://toto.com";
  const WIDTH = 1280;
  const HEIGHT = 800;

  let mockedBrowser: any;
  let mockedPage: any;

  beforeEach(() => {
    jest.resetAllMocks();
    mockedPage = {
      setContent: jest.fn(),
      setViewport: jest.fn(),
      goto: jest.fn(),
      screenshot: jest.fn(() => "screenshotBase64")
    };
    mockedBrowser = {
      newPage: jest.fn(() => mockedPage),
      close: jest.fn()
    };
    (puppeteer.launch as jest.Mock).mockResolvedValue(mockedBrowser);
  });

  it("should take a first screenshot with the dimensiosn provided in the arguments", async () => {
    await getScreenshot(URL, WIDTH, HEIGHT, "none", 0);

    expect(mockedPage.setViewport).toHaveBeenNthCalledWith(1, {
      width: WIDTH,
      height: HEIGHT,
      deviceScaleFactor: 1
    });
    expect(mockedPage.screenshot).toHaveBeenCalled();
  });

  it("should open a second page and take a screenshot of height 500 (plus shadow size)", async () => {
    await getScreenshot(URL, WIDTH, HEIGHT, "none", 0);

    expect(mockedPage.setViewport).toHaveBeenNthCalledWith(2, {
      width: expect.any(Number),
      height: 500,
      deviceScaleFactor: 1
    });
    expect(mockedPage.screenshot).toHaveBeenCalledTimes(2);
  });

  it("should get the HTML using the provided arguments", async () => {
    await getScreenshot(URL, WIDTH, HEIGHT, "small", 8);

    expect(getHtml).toHaveBeenCalledWith(expect.any(String), "small", 8);
  });
});

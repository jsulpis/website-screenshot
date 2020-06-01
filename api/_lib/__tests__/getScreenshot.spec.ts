import getScreenshot, { ShadowOption, WindowOption, SHADOW_SIZES, WINDOW_TOP_BAR_HEIGHT } from "../getScreenshot";
import { puppeteer } from "chrome-aws-lambda";
import getHtml from "../getHtml";

jest.mock("puppeteer-core");
jest.mock("../getHtml");

describe("getScreenshot", () => {
  const URL = "https://toto.com";
  const WIDTH = 1280;
  const HEIGHT = 800;
  const SHADOW: ShadowOption = "medium";
  const RADIUS = 8;
  const WINDOW: WindowOption = "none";
  const OUTPUT_HEIGHT = 600;

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

  it("should take a first screenshot with the dimensions provided in the arguments if no window option", async () => {
    await getScreenshot(URL, WIDTH, HEIGHT, SHADOW, RADIUS, WINDOW, OUTPUT_HEIGHT);

    expect(mockedPage.setViewport).toHaveBeenNthCalledWith(1, {
      width: WIDTH,
      height: HEIGHT,
      deviceScaleFactor: 1
    });
    expect(mockedPage.screenshot).toHaveBeenCalled();
  });

  it("should reduce the height of the viewport for the first screenshot if there is a window option", async () => {
    await getScreenshot(URL, WIDTH, HEIGHT, SHADOW, RADIUS, "mac-os", OUTPUT_HEIGHT);

    // The height of the window bar on the final image is 24px.
    // The height of the viewport on the second screenshot is (outputHeight - shadowSize)
    // For a viewport of height h, I substract h*24/(outputHeight - shadowSize) px on the first screenshot
    const secondScreenshotHeight = OUTPUT_HEIGHT - SHADOW_SIZES[SHADOW];
    const topBarHeight = Math.ceil((HEIGHT * WINDOW_TOP_BAR_HEIGHT) / secondScreenshotHeight);

    expect(mockedPage.setViewport).toHaveBeenNthCalledWith(1, {
      width: WIDTH,
      height: HEIGHT - topBarHeight,
      deviceScaleFactor: 1
    });
    expect(mockedPage.screenshot).toHaveBeenCalled();
  });

  it("should open a second page and take a screenshot of the height in arguments", async () => {
    await getScreenshot(URL, WIDTH, HEIGHT, SHADOW, RADIUS, WINDOW, OUTPUT_HEIGHT);

    expect(mockedPage.setViewport).toHaveBeenNthCalledWith(2, {
      width: expect.any(Number),
      height: OUTPUT_HEIGHT,
      deviceScaleFactor: 1
    });
    expect(mockedPage.screenshot).toHaveBeenCalledTimes(2);
  });

  it("should get the HTML using the provided arguments", async () => {
    await getScreenshot(URL, WIDTH, HEIGHT, SHADOW, RADIUS, WINDOW, OUTPUT_HEIGHT);

    // The height of the container div in the second screenshot is reduced due to the shadows
    const secondScreenshotContainerHeight = OUTPUT_HEIGHT - SHADOW_SIZES[SHADOW];

    expect(getHtml).toHaveBeenCalledWith(expect.any(String), secondScreenshotContainerHeight, SHADOW, RADIUS, WINDOW);
  });
});

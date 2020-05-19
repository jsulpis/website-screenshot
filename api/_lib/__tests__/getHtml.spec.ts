import getHtml from "../getHtml";
import { OUTPUT_IMAGE_HEIGHT, WINDOW_TOP_BAR_HEIGHT } from "../getScreenshot";

describe("getHtml", () => {
  it("should return a page with only the image if no option", () => {
    const imgSrc = "SOURCEBASE64";
    const html = getHtml(imgSrc);

    expect(html).toBe(`
<!DOCTYPE html>
<html>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
    body {
      display: flex;
      justify-content: center;
      height: 100vh;
      margin: 0;
    }
    .container, .container > div {
      height: ${OUTPUT_IMAGE_HEIGHT}px;
    }
    img {
      height: ${OUTPUT_IMAGE_HEIGHT}px;
    }</style>
    <body>
      <div class="container">
        <img
          alt="Generated Image"
          src="data:image/png;base64,${imgSrc}"
        /></div>
    </body>
</html>`);
  });

  it("should return a page using all options", () => {
    const imgSrc = "SOURCEBASE64";
    const radius = 8;
    const shadow = "small";
    const window = "mac-os";
    const html = getHtml(imgSrc, shadow, radius, window);

    expect(html).toBe(`
<!DOCTYPE html>
<html>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
    body {
      display: flex;
      justify-content: center;
      height: 100vh;
      margin: 0;
    }
    .container, .container > div {
      height: ${OUTPUT_IMAGE_HEIGHT}px;
    }
    img {
      height: ${OUTPUT_IMAGE_HEIGHT - WINDOW_TOP_BAR_HEIGHT}px;
    }
      .container {
        margin-top: 5px;
        box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
      }
    .container {
      border-radius: ${radius}px;
      overflow: hidden;
    }
      .macos-window {
        display: flex;
        height: 24px;
        background-image: linear-gradient(#fff, #eee);
      }

      .macos-buttons {
        display: flex;
        align-items: center;
        height: 100%;
        margin-left: 0.75rem;
      }

      .macos-button {
        display: inline-block;
        width: 0.75rem;
        height: 0.75rem;
        margin-left: 0.25rem;
        margin-right: 0.25rem;
        border-radius: 9999px;
      }
      .bg-red-500 {
        background-color: #f56565;
      }
      .bg-yellow-500 {
        background-color: #ecc94b;
      }
      .bg-green-500 {
        background-color: #48bb78;
      }</style>
    <body>
      <div class="container">
        <div>
          <div class="macos-window">
            <div class="macos-buttons">
              <span class="bg-red-500 macos-button"></span>
              <span class="bg-yellow-500 macos-button"></span>
              <span class="bg-green-500 macos-button"></span>
            </div>
          </div>
        <img
          alt="Generated Image"
          src="data:image/png;base64,${imgSrc}"
        />
        </div></div>
    </body>
</html>`);
  });
});

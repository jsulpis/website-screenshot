import HtmlPage from "../HtmlPage";

describe("HtmlPage", () => {
  let page: HtmlPage;
  const imgSrc = "data:image/png;base64,SRCBASE64";

  beforeEach(() => {
    page = new HtmlPage();
  });

  it("can generate an empty page", () => {
    expect(page.html).toBe(`
<!DOCTYPE html>
<html>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style></style>
    <body>
      <div class="container">
        <img
          alt="Generated Image"
          src=""
        /></div>
    </body>
</html>`);
  });

  it("can add global style", () => {
    page.addGlobalStyle(`
      body {
        display: flex;
        justify-content: center;
        height: 100vh;
      }`);
    page.addGlobalStyle(`
      img {
        height: 500px;
      }`);

    expect(page.html).toBe(`
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
      }
      img {
        height: 500px;
      }</style>
    <body>
      <div class="container">
        <img
          alt="Generated Image"
          src=""
        /></div>
    </body>
</html>`);
  });

  it("can add an image in the body", () => {
    page.addImageSrc(imgSrc);

    expect(page.html).toBe(`
<!DOCTYPE html>
<html>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style></style>
    <body>
      <div class="container">
        <img
          alt="Generated Image"
          src="${imgSrc}"
        /></div>
    </body>
</html>`);
  });

  it("can add a wrapper around the image", () => {
    page.addImageSrc(imgSrc);
    page.addWrapper(content => `<wrapper>${content}</wrapper>`);

    expect(page.html).toBe(`
<!DOCTYPE html>
<html>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style></style>
    <body>
      <div class="container"><wrapper>
        <img
          alt="Generated Image"
          src="${imgSrc}"
        /></wrapper></div>
    </body>
</html>`);
  });
});

import HtmlPage from "../HtmlPage";

describe("HtmlPage", () => {
  let page: HtmlPage;
  const imgSrc = "data:image/png;base64,SRCBASE64";
  const imgClass = "class";
  const imgStyle = "style";

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
    <body></body>
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
    <body></body>
</html>`);
  });

  it("can add an image in the body", () => {
    page.addImage(imgSrc, imgClass, imgStyle);

    expect(page.html).toBe(`
<!DOCTYPE html>
<html>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style></style>
    <body><img
        alt="Generated Image"
        src="${imgSrc}"
        class="${imgClass}"
        style="${imgStyle}"
    /></body>
</html>`);
  });

  it("can add a wrapper around the image", () => {
    page.addImage(imgSrc, imgClass, imgStyle);
    page.addWrapper(content => `<wrapper>${content}</wrapper>`);

    expect(page.html).toBe(`
<!DOCTYPE html>
<html>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style></style>
    <body><wrapper><img
        alt="Generated Image"
        src="${imgSrc}"
        class="${imgClass}"
        style="${imgStyle}"
    /></wrapper></body>
</html>`);
  });
});

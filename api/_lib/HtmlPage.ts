export default class HtmlPage {
  globalStyle: string;
  bodyContent: string;

  constructor() {
    this.globalStyle = "";
    this.bodyContent = "";
  }

  public addGlobalStyle(style: string) {
    this.globalStyle = this.globalStyle + style;
  }

  public addImage(imgSrc: string, imgClass: string, imgStyle: string) {
    this.bodyContent =
      this.bodyContent +
      `<img
        alt="Generated Image"
        src="${imgSrc}"
        class="${imgClass}"
        style="${imgStyle}"
    />`;
  }

  public addWrapper(wrapper: (content: string) => string) {
    this.bodyContent = wrapper(this.bodyContent);
  }

  public get html() {
    return `
<!DOCTYPE html>
<html>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>${this.globalStyle}</style>
    <body>${this.bodyContent}</body>
</html>`;
  }
}

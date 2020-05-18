export default class HtmlPage {
  globalStyle: string;
  imgSrc: string;
  wrappers: Array<(content: string) => string>;

  constructor() {
    this.globalStyle = "";
    this.imgSrc = "";
    this.wrappers = [];
  }

  public addGlobalStyle(style: string) {
    this.globalStyle = this.globalStyle + style;
  }

  public addImageSrc(imgSrc: string) {
    this.imgSrc = imgSrc;
  }

  public addWrapper(wrapper: (content: string) => string) {
    this.wrappers.push(wrapper);
  }

  public get html() {
    let bodyContent = `
        <img
          alt="Generated Image"
          src="${this.imgSrc}"
        />`;

    this.wrappers.forEach(wrapper => {
      bodyContent = wrapper(bodyContent);
    });

    return `
<!DOCTYPE html>
<html>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>${this.globalStyle}</style>
    <body>
      <div class="container">${bodyContent}</div>
    </body>
</html>`;
  }
}

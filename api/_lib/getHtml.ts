export default function getHtml(imageBase64: string, shadow: string, radius: number) {
  return `
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
        }
        .shadow-small {
          margin-top: 5px;
          box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
        }
        .shadow-medium {
          margin-top: 10px;
          box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
        }
        .shadow-large {
          margin-top: 15px;
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15), 0 5px 10px rgba(0, 0, 0, 0.1);
        }
    </style>
    <body>
       <img
        alt="Generated Image"
        src="data:image/png;base64,${imageBase64}"
        class="shadow-${shadow}"
        style="border-radius: ${radius}px"
    />
    </body>
</html>`;
}

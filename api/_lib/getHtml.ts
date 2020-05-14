export default function getHtml(imageBase64: string, shadow: string) {
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
          align-items: center;
        }
        .shadow-small {
          box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
        }
        .shadow-medium {
          box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
        }
        .shadow-large {
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15), 0 5px 10px rgba(0, 0, 0, 0.1);
        }
    </style>
    <body>
       <img
        alt="Generated Image"
        src="data:image/png;base64,${imageBase64}"
        class="shadow-${shadow}"
    />
    </body>
</html>`;
}

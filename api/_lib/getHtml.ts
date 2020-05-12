export default function getHtml(imageBase64: string) {
  return `
<!DOCTYPE html>
<html>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        img {
          box-shadow: 0 0 10px rgba(0,0,0,0.2);
        }
    </style>
    <body>
       <img
        alt="Generated Image"
        src="data:image/gif;base64,${imageBase64}"
    />
    </body>
</html>`;
}

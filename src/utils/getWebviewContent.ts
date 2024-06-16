import { IDocumentation } from "../interfaces/IDocumentation";

export const getWebviewContent = (documentation: IDocumentation) => {
  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <style>
      body, html
        {
          margin: 0; padding: 0; height: 100%; overflow: hidden; background-color: #fff;
        }
    </style>
    <link rel="icon" href="${documentation.icon}" type="image/png">
    <title>${documentation.name}</title>
  </head>
  <body>
    <iframe width="100%" height="100%" src="${documentation.url}" frameborder="0">
      <p>Can't load ${documentation.url}</p>
    </iframe>
  </body>
  </html>
  `;
  return html;
};

import { IDocumentation } from "../interfaces/IDocumentation";

export const getWebviewContent = (documentation: IDocumentation) => {
  if (documentation.url.includes("github.com")) {
    const url = documentation.url.split("https://github.com/");
    const ownerRepo = url[1].split("/");
    const owner = ownerRepo[0];
    const repo = ownerRepo[1].split("#")[0];
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>GitHub README</title>
        <style>
          body, html {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            padding: 20px;
          }
          a {
            color: #0366d6; /* GitHub link color */
            text-decoration: none;
            cursor: pointer;
          }
          a:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <div id="readme-content"></div>
        
        <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
        <script>
          async function getReadmeContent(owner, repo) {
            const response = await fetch("https://api.github.com/repos/" + owner + "/" + repo + "/readme", {
              headers: {
                'Accept': 'application/vnd.github.v3.raw'
              }
            });

            if (!response.ok) {
              throw new Error('Network response was not ok');
            }

            const content = await response.text();
            return content;
          }

          function replaceBodyContent(href) {
            if(href.includes("github.com")) {
              const url = href.split("https://github.com/");
              const ownerRepo = url[1].split("/");
              const owner = ownerRepo[0];
              const repo = ownerRepo[1].split("#")[0];

              getReadmeContent(owner, repo).then(content => {
              const htmlContent = marked.parse(content);
              document.body.innerHTML = htmlContent;
              }).catch(error => {
                console.error('Error fetching README:', error);
                document.getElementById('readme-content').innerText = 'Error fetching README. Please check the console for details.';
              });
            } else {
              document.documentElement.style.padding = 0;
              document.documentElement.style.height = "100vh";
              document.body.style.height = "100vh";
              document.body.style.padding = 0;
              document.body.innerHTML = "<iframe width='100%' height='100%' src=\\"" + href + "\\" frameborder='0'><p>'Can\\'t load'" + href + "</p></iframe>";
            }
          }

          const renderer = new marked.Renderer();
          renderer.link = (href, title, text) => {
            return "<a href='#' onclick='replaceBodyContent(\\"" + href + "\\")'>" + text + "</a>";
          };

          marked.use({ renderer });

          // Initial load of readme
          getReadmeContent('${owner}', '${repo}').then(content => {
            const htmlContent = marked.parse(content);
            document.getElementById('readme-content').innerHTML = htmlContent;
          }).catch(error => {
            console.error('Error fetching README:', error);
            document.getElementById('readme-content').innerText = 'Error fetching README. Please check the console for details.';
          });
        </script>
      </body>
      </html>`;

    return html;
  }

  // Default fallback for non-GitHub URLs
  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <style>
          body, html {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            padding: 20px;
            margin: 0;
            padding: 0;
            height: 100%;
            overflow: hidden;
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
    </html>`;

  return html;
};

import * as vscode from "vscode";
import scriptGitHubUri from "../components/Documentation/uri/scriptGitHubUri";
import styleDocumentationUri from "../components/Documentation/uri/styleDocumentationUri";
import styleGitHubUri from "../components/Documentation/uri/styleGitHubUri";
import { IDocumentation } from "../interfaces/IDocumentation";
import getNonce from "./getNonce";

const getDocWebviewContent = (
  documentation: IDocumentation,
  webview: vscode.Webview,
  extensionUri: vscode.Uri
) => {
  if (documentation.url.includes("github.com")) {
    const nonce = getNonce();

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
        <link href="${styleGitHubUri(webview, extensionUri)}" rel="stylesheet">
        <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
        <script nonce="${nonce}">
        const owner = "${owner}";
        const repo = "${repo}";
        </script>
        <script nonce="${nonce}" src="${scriptGitHubUri(
      webview,
      extensionUri
    )}"></script>
        <title>GitHub README</title>
      </head>
      <body>
        <div id="readme-content">Loading...</div>
      </body>
      </html>`;

    return html;
  }

  // Default fallback for non-GitHub URLs
  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <link rel="icon" href="${documentation.icon}" type="image/png">
        <link href="${styleDocumentationUri(
          webview,
          extensionUri
        )}" rel="stylesheet">
        <title>${documentation.name}</title>
      </head>
      <body>
        <iframe width="100%" height="100%" src="${
          documentation.url
        }" frameborder="0">
          <p>Can't load ${documentation.url}</p>
        </iframe>
      </body>
    </html>`;

  return html;
};

export default getDocWebviewContent;

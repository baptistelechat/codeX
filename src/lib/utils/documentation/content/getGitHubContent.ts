import * as vscode from "vscode";
import styleCodiconUri from "../../../assets/uri/styleCodiconUri";
import styleTailwindUri from "../../../assets/uri/styleTailwindUri";
import { IDocumentation } from "../../../interfaces/IDocumentation";
import getNonce from "../../getNonce";
import getContentBody from "./getContentBody";
import styleGitHubUri from "../../../assets/uri/styleGitHubUri";
import scriptGitHubUri from "../../../assets/uri/scriptGitHubUri";

const getGitHubContent = (
  documentation: IDocumentation,
  webview: vscode.Webview,
  extensionUri: vscode.Uri,
  url: string
) => {
  const nonce = getNonce();
  const [owner, repo] = url.split("https://github.com/")[1].split("/");

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link href="${styleTailwindUri(webview, extensionUri)}" rel="stylesheet">
      <link href="${styleCodiconUri(webview, extensionUri)}" rel="stylesheet">
      <link href="${styleGitHubUri(webview, extensionUri)}" rel="stylesheet">
      <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
      <script nonce="${nonce}">
      const owner = "${owner}";
      const repo = "${repo.split("#")[0]}";
      </script>
      <script type="module" nonce="${nonce}" src="${scriptGitHubUri(
    webview,
    extensionUri
  )}"></script>
      <title>GitHub README</title>
    </head>
    <body>
      ${getContentBody(documentation, url, "github")}
    </body>
    </html>`;
};

export default getGitHubContent;

import * as vscode from "vscode";
import l10nUri from "../../../assets/uri/l10n/l10nUri";
import scriptGitHubUri from "../../../assets/uri/scriptGitHubUri";
import styleCodiconUri from "../../../assets/uri/styleCodiconUri";
import styleGitHubUri from "../../../assets/uri/styleGitHubUri";
import styleTailwindUri from "../../../assets/uri/styleTailwindUri";
import IDocumentation from "../../../interfaces/IDocumentation";
import Language from "../../../types/Language";
import getNonce from "../../getNonce";
import getContentBody from "./getContentBody";

const getGitHubContent = (
  documentation: IDocumentation,
  webview: vscode.Webview,
  extensionUri: vscode.Uri,
  url: string,
  homepage: boolean,
  language: Language
) => {
  const nonce = getNonce();
  const [owner, repo] = url.split("https://github.com/")[1].split("/");

  return `
    <!DOCTYPE html>
    <html lang="${language}">
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
        const l10nPath = "${l10nUri(webview, extensionUri)}"
      </script>
      <script type="module" nonce="${nonce}" src="${scriptGitHubUri(
    webview,
    extensionUri
  )}"></script>
      <title>GitHub README</title>
    </head>
    <body>
      ${getContentBody(documentation, url, "github", homepage, language)}
    </body>
    </html>`;
};

export default getGitHubContent;

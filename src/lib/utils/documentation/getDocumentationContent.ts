import * as vscode from "vscode";
import styleCodiconUri from "../../assets/uri/styleCodiconUri";
import styleTailwindUri from "../../assets/uri/styleTailwindUri";
import scriptGitHubUri from "../../components/Documentation/uri/scriptGitHubUri";
import styleDocumentationUri from "../../components/Documentation/uri/styleDocumentationUri";
import styleGitHubUri from "../../components/Documentation/uri/styleGitHubUri";
import { IDocumentation } from "../../interfaces/IDocumentation";
import getNonce from "../getNonce";

const getDocumentationContent = (
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
        <link href="${styleTailwindUri(
          webview,
          extensionUri
        )}" rel="stylesheet">
        <link href="${styleCodiconUri(webview, extensionUri)}" rel="stylesheet">
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
        <div class="flex flex-col h-screen">
          <div class="flex-grow overflow-y-auto">
            <div id="readme-content" class="p-4">Loading...</div>
          </div>
          <div class="flex items-center justify-center gap-4 border-t border-t-sky-200 p-2">
            <p class="m-0">Failed to load the ${
              documentation.name
            } ? Try opening it in a browser.</p>
            <a
              id="openBrowser"
              class="flex w-fit items-center justify-center gap-2 rounded bg-sky-500 p-2 text-slate-50 hover:cursor-pointer hover:bg-sky-400 hover:text-slate-50  hover:no-underline"
              href="${documentation.url}"
              target="_blank"
            >
              <div class="codicon codicon-browser" aria-label="browser"></div>
              Open in Browser</a
            >
          </div>
        </div>
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
        <link href="${styleTailwindUri(
          webview,
          extensionUri
        )}" rel="stylesheet">
        <link href="${styleCodiconUri(webview, extensionUri)}" rel="stylesheet">
        <link href="${styleDocumentationUri(
          webview,
          extensionUri
        )}" rel="stylesheet">
        <title>${documentation.name}</title>
      </head>
      <body>
        <div class="flex flex-col h-screen">
          <div class="flex-1 overflow-auto">
            <iframe width="100%" height="100%" src="${
              documentation.url
            }" frameborder="0" class="bg-white">
              <p>Can't load ${documentation.name}</p>
            </iframe>
          </div>
          <div class="flex items-center justify-center gap-4 border-t border-t-sky-200 p-2">
            <p class="m-0">Failed to load the ${
              documentation.name
            } ? Try opening it in a browser.</p>
            <a
              id="openBrowser"
              class="flex w-fit items-center justify-center gap-2 rounded bg-sky-500 p-2 text-slate-50 hover:cursor-pointer hover:bg-sky-400 hover:text-slate-50  hover:no-underline"
              href="${documentation.url}"
              target="_blank"
            >
              <div class="codicon codicon-browser" aria-label="browser"></div>
              Open in Browser</a
            >
          </div>
        </div>
      </body>
    </html>`;

  return html;
};

export default getDocumentationContent;

import * as vscode from "vscode";
import scriptSidebarUri from "../../assets/uri/scriptSidebarUri";
import styleCodiconUri from "../../assets/uri/styleCodiconUri";
import styleResetUri from "../../assets/uri/styleResetUri";
import styleSidebarUri from "../../assets/uri/styleSidebarUri";
import styleTailwindUri from "../../assets/uri/styleTailwindUri";
import styleVscodeUri from "../../assets/uri/styleVscodeUri";
import getNonce from "../getNonce";

const getDocumentationViewContent = (
  webview: vscode.Webview,
  extensionUri: vscode.Uri
) => {
  const nonce = getNonce();

  return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline' ${
          webview.cspSource
        }; font-src 'self' ${
    webview.cspSource
  }; script-src 'nonce-${nonce}' https://unpkg.com; connect-src https://lottie.host;">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="${styleResetUri(webview, extensionUri)}" rel="stylesheet">
        <link href="${styleTailwindUri(
          webview,
          extensionUri
        )}" rel="stylesheet">
        <link href="${styleCodiconUri(webview, extensionUri)}" rel="stylesheet">
        <link href="${styleVscodeUri(webview, extensionUri)}" rel="stylesheet">
        <link href="${styleSidebarUri(webview, extensionUri)}" rel="stylesheet">
        <title>Documentation List</title>
        <script type="module" nonce="${nonce}" src="${scriptSidebarUri(
    webview,
    extensionUri
  )}">
      </script>
      <script nonce="${nonce}" src="https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs" type="module"></script> 
      <script nonce="${nonce}" type="module" src="https://cdn.jsdelivr.net/npm/ldrs/dist/auto/zoomies.js"></script>
      </head>
      <body>
        <div id="no-documentation-found" class="flex flex-col gap-4 px-6 py-4">
          <p>No documentation found or loading too long ? Try to reload the extension or window.</p>
          <div class="flex w-full flex-col items-center justify-center gap-6">
            <div id="reload" class="flex w-full items-center justify-center gap-2 rounded bg-sky-500 p-2 text-slate-50 hover:cursor-pointer hover:bg-sky-400">
              <div class="codicon codicon-refresh" aria-label="refresh"></div>
              <p class="text-slate-50">Reload</p>
            </div>
            <l-zoomies
              size="150"
              stroke="4"
              bg-opacity="0.1"
              speed="1.4"
              color="black" 
            ></l-zoomies>
          </div>
        </div>
        <div id="documentation-container" class="flex overflow-hidden max-w-full"></div>
      </body>
      </html>`;
};

export default getDocumentationViewContent;
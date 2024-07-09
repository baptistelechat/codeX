import * as vscode from "vscode";
import styleCodiconUri from "../../assets/uri/styleCodiconUri";
import styleResetUri from "../../assets/uri/styleResetUri";
import styleTailwindUri from "../../assets/uri/styleTailwindUri";
import styleVscodeUri from "../../assets/uri/styleVscodeUri";
import scriptSidebarUri from "../../components/Sidebar/uri/scriptSidebarUri";
import styleSidebarUri from "../../components/Sidebar/uri/styleSidebarUri";
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
        }; font-src 'self' ${webview.cspSource}; script-src 'nonce-${nonce}';">
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
        <script nonce="${nonce}"> var exports = {}; </script>
        <script type="module" nonce="${nonce}" src="${scriptSidebarUri(
    webview,
    extensionUri
  )}"></script>
      </head>
      <body>
        <div id="no-documentation-found" class="flex flex-col gap-4 py-4">
          <p>No documentation found. Try to reload the extension.</p>
          <div id="reload" class="flex items-center justify-center gap-2 rounded bg-sky-500 p-2 text-slate-50 hover:cursor-pointer hover:bg-sky-400">
            <div class="codicon codicon-refresh" aria-label="refresh"></div>
            <p class="text-slate-50">Reload</p>
          </div>
        </div>
        <div id="documentation-list" class="mt-2 space-y-2 max-w-full"></div>
      </body>
      </html>`;
};

export default getDocumentationViewContent;

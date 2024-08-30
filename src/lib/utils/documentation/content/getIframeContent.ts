import * as vscode from "vscode";
import styleCodiconUri from "../../../assets/uri/styleCodiconUri";
import styleDocumentationUri from "../../../assets/uri/styleDocumentationUri";
import styleTailwindUri from "../../../assets/uri/styleTailwindUri";
import IDocumentation from "../../../interfaces/IDocumentation";
import getContentBody from "./getContentBody";

const getIframeContent = (
  documentation: IDocumentation,
  webview: vscode.Webview,
  extensionUri: vscode.Uri,
  url: string,
  homepage: boolean
) => {
  return `
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
        ${getContentBody(documentation, url, "iframe", homepage)}
      </body>
    </html>`;
};

export default getIframeContent;

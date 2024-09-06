import * as vscode from "vscode";
import styleCodiconUri from "../../../assets/uri/styleCodiconUri";
import styleDocumentationUri from "../../../assets/uri/styleDocumentationUri";
import styleTailwindUri from "../../../assets/uri/styleTailwindUri";
import IDocumentation from "../../../interfaces/IDocumentation";
import Language from "../../../types/Language";
import getContentBody from "./getContentBody";

const getFallbackContent = (
  documentation: IDocumentation,
  webview: vscode.Webview,
  extensionUri: vscode.Uri,
  url: string,
  homepage: boolean,
  language: Language
) => {
  return `
    <!DOCTYPE html>
    <html lang="${language}">
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
        ${getContentBody(documentation, url, "fallback", homepage, language)}
      </body>
    </html>`;
};

export default getFallbackContent;

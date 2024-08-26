import * as vscode from "vscode";

const styleDocumentationUri = (
  webview: vscode.Webview,
  extensionUri: vscode.Uri
) =>
  webview.asWebviewUri(
    vscode.Uri.joinPath(
      extensionUri,
      "src",
      "lib",
      "assets",
      "styles",
      "documentation.css"
    )
  );

export default styleDocumentationUri;

import * as vscode from "vscode";

const styleResetUri = (webview: vscode.Webview, extensionUri: vscode.Uri) =>
  webview.asWebviewUri(
    vscode.Uri.joinPath(
      extensionUri,
      "src",
      "lib",
      "assets",
      "styles",
      "reset.css"
    )
  );

export default styleResetUri;

import * as vscode from "vscode";

const styleVscodeUri = (webview: vscode.Webview, extensionUri: vscode.Uri) =>
  webview.asWebviewUri(
    vscode.Uri.joinPath(
      extensionUri,
      "src",
      "lib",
      "assets",
      "styles",
      "vscode.css"
    )
  );

export default styleVscodeUri;

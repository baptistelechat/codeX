import * as vscode from "vscode";

const styleGitHubUri = (webview: vscode.Webview, extensionUri: vscode.Uri) =>
  webview.asWebviewUri(
    vscode.Uri.joinPath(
      extensionUri,
      "src",
      "lib",
      "assets",
      "styles",
      "gitHub.css"
    )
  );

export default styleGitHubUri;

import * as vscode from "vscode";

const scriptGitHubUri = (webview: vscode.Webview, extensionUri: vscode.Uri) =>
  webview.asWebviewUri(
    vscode.Uri.joinPath(
      extensionUri,
      "out",
      "app",
      "Documentation",
      "gitHub.js"
    )
  );

export default scriptGitHubUri;

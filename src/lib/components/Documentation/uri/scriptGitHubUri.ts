import * as vscode from "vscode";

const scriptGitHubUri = (webview: vscode.Webview, extensionUri: vscode.Uri) =>
  webview.asWebviewUri(
    vscode.Uri.joinPath(
      extensionUri,
      "src",
      "lib",
      "components",
      "Documentation",
      "scripts",
      "github.js"
    )
  );

export default scriptGitHubUri;

import * as vscode from "vscode";

const styleGitHubUri = (webview: vscode.Webview, extensionUri: vscode.Uri) =>
  webview.asWebviewUri(
    vscode.Uri.joinPath(
      extensionUri,
      "src",
      "lib",
      "components",
      "Documentation",
      "styles",
      "gitHub.css"
    )
  );

export default styleGitHubUri;
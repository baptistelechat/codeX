import * as vscode from "vscode";

const styleSidebarUri = (webview: vscode.Webview, extensionUri: vscode.Uri) =>
  webview.asWebviewUri(
    vscode.Uri.joinPath(
      extensionUri,
      "src",
      "lib",
      "assets",
      "styles",
      "sidebar.css"
    )
  );

export default styleSidebarUri;

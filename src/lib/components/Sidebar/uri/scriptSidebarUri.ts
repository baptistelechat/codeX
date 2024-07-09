import * as vscode from "vscode";

const scriptSidebarUri = (webview: vscode.Webview, extensionUri: vscode.Uri) =>
  webview.asWebviewUri(
    vscode.Uri.joinPath(
      extensionUri,
      "out",
      "lib",
      "components",
      "Sidebar",
      "scripts",
      "sidebar.js"
    )
  );

export default scriptSidebarUri;

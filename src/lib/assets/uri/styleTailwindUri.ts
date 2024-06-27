import * as vscode from "vscode";

const styleTailwindUri = (webview: vscode.Webview, extensionUri: vscode.Uri) =>
  webview.asWebviewUri(
    vscode.Uri.joinPath(
      extensionUri,
      "src",
      "lib",
      "assets",
      "styles",
      "tailwind.min.css"
    )
  );

export default styleTailwindUri;

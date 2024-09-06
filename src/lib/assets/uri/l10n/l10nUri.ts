import * as vscode from "vscode";

const l10nUri = (webview: vscode.Webview, extensionUri: vscode.Uri) =>
  webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, "out", "app", "l10n"));

export default l10nUri;

import * as vscode from "vscode";
import { CodeXViewProvider } from "./utils/codeXViewProvider";

export function activate(context: vscode.ExtensionContext) {
  const provider = new CodeXViewProvider(context.extensionUri);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      CodeXViewProvider.viewType,
      provider
    )
  );

  console.log('Extension "codeX" is now active!');
}

export function deactivate() {
  console.log('Extension "codeX" is now deactivated');
}

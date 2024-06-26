import * as vscode from "vscode";
import { CodeXViewProvider } from "./utils/codeXViewProvider";
import openFeedbackForms from "./utils/openFeedbackForms";

export function activate(context: vscode.ExtensionContext) {
  const provider = new CodeXViewProvider(context.extensionUri);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      CodeXViewProvider.viewType,
      provider
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("codeX.reload", () => {
      provider.updateDocumentations();
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("codeX.feedback", () => {
      openFeedbackForms(context);
    })
  );

  console.log('Extension "codeX" is now active!');
}

export function deactivate() {
  console.log('Extension "codeX" is now deactivated');
}

import * as vscode from "vscode";
import openFeedbackForms from "./lib/utils/openFeedbackForms";
import { DocumentationViewProvider } from "./lib/utils/provider/DocumentationViewProvider";

export const activate = (context: vscode.ExtensionContext) => {
  const documentationViewProvider = new DocumentationViewProvider(
    context.extensionUri,
    context
  );

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      DocumentationViewProvider.viewType,
      documentationViewProvider
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("codeX.reload", () => {
      documentationViewProvider.reloadExtension();
      documentationViewProvider.getDocumentations();
      // vscode.commands.executeCommand("workbench.action.reloadWindow");
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("codeX.reset", () => {
      documentationViewProvider.resetExtension();
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("codeX.feedback", () => {
      openFeedbackForms(context);
    })
  );

  console.log('Extension "codeX" is now active!');
};

export const deactivate = () => {
  console.log('Extension "codeX" is now deactivated');
};

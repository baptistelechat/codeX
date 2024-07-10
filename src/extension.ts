import * as vscode from "vscode";
import { DocumentationViewProvider } from "./lib/utils/documentation/DocumentationViewProvider";
import openFeedbackForms from "./lib/utils/openFeedbackForms";

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
      documentationViewProvider.getDocumentations();
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

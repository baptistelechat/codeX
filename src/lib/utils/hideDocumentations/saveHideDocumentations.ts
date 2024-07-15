import * as vscode from "vscode";

export async function saveHideDocumentations(
  context: vscode.ExtensionContext,
  hidden: string[]
) {
  await context.globalState.update("hideDocumentations", hidden);
}

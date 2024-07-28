import * as vscode from "vscode";

export async function loadHideDocumentations(
  context: vscode.ExtensionContext
): Promise<string[]> {
  const hiddenDocumentations =
    context.globalState.get<string[]>("hideDocumentations");
  return hiddenDocumentations || [];
}
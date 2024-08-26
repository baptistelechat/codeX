import * as vscode from "vscode";

const savePinnedDocumentations = async (
  context: vscode.ExtensionContext,
  pinned: string[]
) => {
  await context.globalState.update("pinnedDocumentations", pinned);
};

export default savePinnedDocumentations;

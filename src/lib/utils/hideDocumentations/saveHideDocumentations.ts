import * as vscode from "vscode";

const saveHideDocumentations = async (
  context: vscode.ExtensionContext,
  hidden: string[]
) => {
  await context.globalState.update("hideDocumentations", hidden);
};

export default saveHideDocumentations;

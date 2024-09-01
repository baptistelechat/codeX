import * as vscode from "vscode";
import IDependency from "../../interfaces/IDependency";

const savePinnedDocumentations = async (
  context: vscode.ExtensionContext,
  pinned: IDependency[]
) => {
  await context.globalState.update("pinnedDocumentations", pinned);
};

export default savePinnedDocumentations;

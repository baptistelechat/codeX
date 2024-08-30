import * as vscode from "vscode";
import IDependency from "../../interfaces/IDependency";

const saveHideDocumentations = async (
  context: vscode.ExtensionContext,
  hidden: IDependency[]
) => {
  await context.globalState.update("hideDocumentations", hidden);
};

export default saveHideDocumentations;

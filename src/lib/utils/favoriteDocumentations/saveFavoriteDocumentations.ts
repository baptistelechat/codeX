import * as vscode from "vscode";
import IDependency from "../../interfaces/IDependency";

const saveFavoriteDocumentations = async (
  context: vscode.ExtensionContext,
  favorites: IDependency[]
) => {
  await context.globalState.update("favoriteDocumentations", favorites);
};

export default saveFavoriteDocumentations;

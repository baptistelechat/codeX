import * as vscode from "vscode";

const saveFavoriteDocumentations = async (
  context: vscode.ExtensionContext,
  favorites: string[]
) => {
  await context.globalState.update("favoriteDocumentations", favorites);
};

export default saveFavoriteDocumentations;

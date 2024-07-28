import * as vscode from "vscode";

const loadFavoriteDocumentations = async (
  context: vscode.ExtensionContext
): Promise<string[]> => {
  const savedFavorites = context.globalState.get<string[]>(
    "favoriteDocumentations"
  );
  return savedFavorites || [];
};

export default loadFavoriteDocumentations;

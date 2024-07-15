import * as vscode from "vscode";

export async function loadFavoriteDocumentations(
  context: vscode.ExtensionContext
): Promise<string[]> {
  const savedFavorites = context.globalState.get<string[]>(
    "favoriteDocumentations"
  );
  return savedFavorites || [];
}
import * as vscode from "vscode";

export async function saveFavoriteDocumentations(
  context: vscode.ExtensionContext,
  favorites: string[]
) {
  await context.globalState.update("favoriteDocumentations", favorites);
}
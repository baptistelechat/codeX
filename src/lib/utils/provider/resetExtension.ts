import * as vscode from "vscode";
import { DocumentationViewProvider } from "./DocumentationViewProvider";

export async function resetExtension(provider: DocumentationViewProvider) {
  vscode.window
    .showInformationMessage(
      "Are you sure you want to reset codeX ?",
      "Yes",
      "No"
    )
    .then(async (action) => {
      switch (action) {
        case "Yes":
          await provider.context.globalState.update(
            "pinnedDocumentations",
            []
          );
          await provider.context.globalState.update(
            "favoriteDocumentations",
            []
          );
          await provider.context.globalState.update("hideDocumentations", []);

          provider._pinnedDocumentations = [];
          provider._favoriteDocumentations = [];
          provider._hideDocumentations = [];

          provider.getDocumentations();
          break;
        case "No":
          break;
        default:
          break;
      }
    });
}

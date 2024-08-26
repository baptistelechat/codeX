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
          await provider.context.globalState.update("pinnedDocumentations", []);
          await provider.context.globalState.update(
            "favoriteDocumentations",
            []
          );
          await provider.context.globalState.update("hideDocumentations", []);

          provider._pinnedDocumentations = [];
          provider._favoriteDocumentations = [];
          provider._hideDocumentations = [];

          const newDocumentations = provider._documentations.map(
            (documentation) => {
              documentation.isPinned = false;
              documentation.isFavorite = false;
              documentation.isHide = false;

              return documentation;
            }
          );

          const newSearchDocumentations = provider._searchDocumentations.map(
            (documentation) => {
              documentation.isPinned = false;
              documentation.isFavorite = false;
              documentation.isHide = false;

              return documentation;
            }
          );

          provider._documentations = newDocumentations;
          provider._searchDocumentations = newSearchDocumentations;

          if (provider._view) {
            provider._view.webview.postMessage({
              type: "setDocumentations",
              documentations: provider._documentations,
              searchDocumentations: provider._searchDocumentations,
              openDocumentations: provider._openDocumentations,
              currentDocumentation: provider._currentDocumentations,
              searchMode: provider._searchMode,
              searchValue: provider._searchValue,
              reset: true,
            });
          }

          break;
        case "No":
          break;
        default:
          break;
      }
    });
}

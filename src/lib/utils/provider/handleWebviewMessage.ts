import * as vscode from "vscode";
import focusDocumentation from "../documentation/action/focusDocumentation";
import openDocumentation from "../documentation/action/openDocumentation";
import searchDocumentation from "../documentation/searchDocumentation";
import { showInformationMessage } from "../showMessage";
import { DocumentationViewProvider } from "./DocumentationViewProvider";

export async function handleWebviewMessage(
  provider: DocumentationViewProvider,
  message: any
) {
  switch (message.type) {
    case "openDocumentation":
      openDocumentation({
        id: message.documentationId,
        provider,
        homepage: message.homepage,
      });
      if (!provider._openDocumentations.includes(message.documentationId)) {
        provider._openDocumentations.push(message.documentationId);
      }

      provider._currentDocumentations = message.documentationId;
      break;

    case "focusDocumentation":
      focusDocumentation({
        id: message.documentationId,
        provider,
      });
      break;

    case "togglePinned":
      provider.togglePinned(message.dependency);
      break;

    case "toggleFavorite":
      provider.toggleFavorite(message.dependency);
      break;

    case "toggleHide":
      provider.toggleHide(message.dependency);
      break;

    case "openExternalUri":
      const { documentationId } = message;
      const url = provider._documentations.filter(
        (documentation) => documentation.id === documentationId
      )[0].documentationPage.url;

      vscode.env.openExternal(vscode.Uri.parse(url));
      break;

    case "reload":
      const searchMode = provider._searchDocumentations
        .map((documentation) => documentation.id)
        .includes(provider._currentDocumentations);

      provider._searchMode = searchMode;

      provider.getDocumentations();
      break;

    case "searchDocumentation":
      const { searchValue } = message;
      // console.log("searchValue:", searchValue);
      provider._searchValue = searchValue;
      provider._searchMode = true;
      const searchDocumentations = await searchDocumentation(provider);
      provider._searchDocumentations = searchDocumentations;
      // console.log("searchDocumentations:", searchDocumentations);
      if (provider._view) {
        provider._view.webview.postMessage({
          type: "setDocumentations",
          documentations: provider._documentations,
          searchDocumentations,
          openDocumentations: provider._openDocumentations,
          currentDocumentation: provider._currentDocumentations,
          searchMode: true,
          searchValue,
        });
      }
      break;

    case "toggleSearchMode":
      provider._searchMode = !provider._searchMode;
      break;

    case "wip":
      showInformationMessage(
        "Work in progress. Stay tuned to know when this feature will be ready."
      );
      break;

    default:
      break;
  }
}

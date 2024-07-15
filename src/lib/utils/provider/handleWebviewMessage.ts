import * as vscode from "vscode";
import focusDocumentation from "../documentation/action/focusDocumentation";
import openDocumentation from "../documentation/action/openDocumentation";
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
        documentations: provider._documentations,
        extensionUri: provider._extensionUri,
        panels: provider._panels,
        webview: provider._view!.webview,
      });
      break;

    case "focusDocumentation":
      focusDocumentation({
        id: message.documentationId,
        documentations: provider._documentations,
        extensionUri: provider._extensionUri,
        panels: provider._panels,
        webview: provider._view!.webview,
      });
      break;

    case "toggleFavorite":
      provider.toggleFavorite(message.documentationId);
      break;

    case "toggleHide":
      provider.toggleHide(message.documentationId);
      break;

    case "openExternalUri":
      const { documentationId } = message;
      const url = provider._documentations.filter(
        (documentation) => documentation.id === documentationId
      )[0].url;

      vscode.env.openExternal(vscode.Uri.parse(url));
      break;

    case "reload":
      provider.getDocumentations();
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

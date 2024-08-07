import * as vscode from "vscode";
import isValidUrl from "../../isValidUrl";
import logger from "../../logger";
import { DocumentationViewProvider } from "../../provider/DocumentationViewProvider";
import { showErrorMessage } from "../../showMessage";
import getDocumentationContent from "../getDocumentationContent";

const openDocumentation = ({
  id,
  provider,
  homepage,
}: {
  id: string;
  provider: DocumentationViewProvider;
  homepage: boolean;
}) => {
  logger(provider._searchMode, "search mode");
  let documentation = provider._searchMode
    ? provider._searchDocumentations.find((doc) => doc?.id === id)
    : provider._documentations.find((doc) => doc?.id === id);

  if (documentation && isValidUrl(documentation.documentationPage.url)) {
    const panel = vscode.window.createWebviewPanel(
      id,
      documentation.name,
      vscode.ViewColumn.Two,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [provider._extensionUri],
      }
    );

    const content = getDocumentationContent(
      documentation,
      panel.webview,
      provider._extensionUri,
      homepage
    );

    panel.webview.html = content;
    provider._panels[id] = panel;

    panel.onDidDispose(() => {
      delete provider._panels[id];
      provider._view!.webview.postMessage({
        type: "documentationClosed",
        documentationId: id,
      });

      provider._openDocumentations = provider._openDocumentations.filter(
        (docId) => docId !== id
      );

      if (provider._openDocumentations.length === 0) {
        provider._currentDocumentations = "";
      }
    });

    panel.onDidChangeViewState(() => {
      if (panel.visible) {
        provider._view!.webview.postMessage({
          type: "documentationFocused",
          documentationId: id,
        });

        provider._currentDocumentations = id;

        const searchMode = provider._searchDocumentations
          .map((documentation) => documentation.id)
          .includes(id);

        provider._view?.webview.postMessage({
          type: "setDocumentations",
          documentations: provider._documentations,
          searchDocumentations: provider._searchDocumentations,
          openDocumentations: provider._openDocumentations,
          currentDocumentation: id,
          searchMode,
          searchValue: provider._searchValue,
        });
      }
    });
  } else {
    showErrorMessage("Invalid URL for documentation.");
  }
};

export default openDocumentation;

import * as vscode from "vscode";
import IOpenDocumentationProps from "../../../interfaces/IOpenDocumentationProps";
import isValidUrl from "../../isValidUrl";
import { showErrorMessage } from "../../showMessage";
import getDocumentationContent from "../getDocumentationContent";

const openDocumentation = ({
  id,
  provider,
  homepage,
}: IOpenDocumentationProps) => {
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
    });

    panel.onDidChangeViewState(() => {
      if (panel.visible) {
        provider._view!.webview.postMessage({
          type: "documentationFocused",
          documentationId: id,
        });
      }
    });
  } else {
    showErrorMessage("Invalid URL for documentation.");
  }
};

export default openDocumentation;

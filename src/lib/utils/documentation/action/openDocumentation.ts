import * as vscode from "vscode";
import IDocumentationViewActionParams from "../../../interfaces/IDocumentationViewActionParams";
import isValidUrl from "../../isValidUrl";
import { showErrorMessage } from "../../showMessage";
import getDocumentationContent from "../getDocumentationContent";

const openDocumentation = ({
  id,
  documentations,
  searchDocumentations,
  extensionUri,
  panels,
  webview,
  homepage,
}: IDocumentationViewActionParams) => {
  let documentation =
    searchDocumentations.length > 0
      ? searchDocumentations.find((doc) => doc?.id === id)
      : documentations.find((doc) => doc?.id === id);

  if (documentation && isValidUrl(documentation.documentationPage.url)) {
    const panel = vscode.window.createWebviewPanel(
      id,
      documentation.name,
      vscode.ViewColumn.Two,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [extensionUri],
      }
    );

    const content = getDocumentationContent(
      documentation,
      panel.webview,
      extensionUri,
      homepage
    );
    panel.webview.html = content;
    panels[id] = panel;

    panel.onDidDispose(() => {
      delete panels[id];
      webview.postMessage({
        type: "documentationClosed",
        documentationId: id,
      });
    });

    panel.onDidChangeViewState(() => {
      if (panel.visible) {
        webview.postMessage({
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

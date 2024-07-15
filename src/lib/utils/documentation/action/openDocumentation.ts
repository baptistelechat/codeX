import * as vscode from "vscode";
import isValidUrl from "../../isValidUrl";
import IDocumentationViewActionParams from "../../../interfaces/IDocumentationViewActionParams";
import { showErrorMessage } from "../../showMessage";
import getDocumentationContent from "../getDocumentationContent";

const openDocumentation = ({
  id,
  documentations,
  extensionUri,
  panels,
  webview,
}: IDocumentationViewActionParams) => {
  const documentation = documentations.find((doc) => doc?.id === id);
  if (documentation && isValidUrl(documentation.url)) {
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
      extensionUri
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

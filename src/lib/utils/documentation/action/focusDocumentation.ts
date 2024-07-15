import * as vscode from "vscode";
import IDocumentationViewActionParams from "../../../interfaces/IDocumentationViewActionParams";
import openDocumentation from "./openDocumentation";

const focusDocumentation = ({
  id,
  documentations,
  extensionUri,
  panels,
  webview,
}: IDocumentationViewActionParams) => {
  const panel = panels[id];
  if (panel) {
    panel.reveal(vscode.ViewColumn.Two);
  } else {
    if (webview) {
      openDocumentation({
        id,
        documentations: documentations,
        extensionUri: extensionUri,
        panels: panels,
        webview: webview,
      });
    }
  }
};

export default focusDocumentation;

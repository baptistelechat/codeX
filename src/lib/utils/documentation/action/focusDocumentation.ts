import * as vscode from "vscode";
import IDocumentationViewActionParams from "../../../interfaces/IDocumentationViewActionParams";
import openDocumentation from "./openDocumentation";

const focusDocumentation = ({
  id,
  documentations,
  extensionUri,
  panels,
  webview,
  homepage
}: IDocumentationViewActionParams) => {
  const panel = panels[id];
  if (panel) {
    panel.reveal(vscode.ViewColumn.Two);
  } else {
    if (webview) {
      openDocumentation({
        id,
        documentations,
        extensionUri,
        panels,
        webview,
        homepage
      });
    }
  }
};

export default focusDocumentation;

import * as vscode from "vscode";
import IOpenDocumentationProps from "../../../interfaces/IOpenDocumentationProps";
import openDocumentation from "./openDocumentation";

const focusDocumentation = ({
  id,
  documentations,
  searchDocumentations,
  extensionUri,
  panels,
  webview,
  homepage,
}: IOpenDocumentationProps) => {
  const panel = panels[id];
  if (panel) {
    panel.reveal(vscode.ViewColumn.Two);
  } else {
    if (webview) {
      openDocumentation({
        id,
        documentations,
        searchDocumentations,
        extensionUri,
        panels,
        webview,
        homepage,
      });
    }
  }
};

export default focusDocumentation;

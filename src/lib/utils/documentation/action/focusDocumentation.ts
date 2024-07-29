import * as vscode from "vscode";
import IOpenDocumentationProps from "../../../interfaces/IOpenDocumentationProps";
import openDocumentation from "./openDocumentation";

const focusDocumentation = ({
  id,
  provider,
  homepage,
}: IOpenDocumentationProps) => {
  const panel = provider._panels[id];
  if (panel) {
    panel.reveal(vscode.ViewColumn.Two);
  } else {
    if (provider._view!.webview) {
      openDocumentation({
        id,
        provider,
        homepage,
      });
    }
  }
};

export default focusDocumentation;

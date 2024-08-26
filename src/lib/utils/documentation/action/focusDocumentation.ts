import * as vscode from "vscode";
import { DocumentationViewProvider } from "../../provider/DocumentationViewProvider";

const focusDocumentation = ({
  id,
  provider,
}: {
  id: string;
  provider: DocumentationViewProvider;
}) => {
  const panel = provider._panels[id];
  if (panel) {
    panel.reveal(vscode.ViewColumn.Two);

    provider._currentDocumentations = id;
  }
};

export default focusDocumentation;

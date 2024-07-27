import * as vscode from "vscode";
import { IDocumentation } from "./IDocumentation";

interface IOpenDocumentationProps {
  id: string;
  documentations: IDocumentation[];
  searchDocumentations: IDocumentation[];
  extensionUri: vscode.Uri;
  panels: { [id: string]: vscode.WebviewPanel };
  webview: vscode.Webview;
  homepage: boolean;
}

export default IOpenDocumentationProps;

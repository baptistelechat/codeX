import * as vscode from "vscode";
import { IDocumentation } from "./IDocumentation";

interface IDocumentationViewActionParams {
  id: string;
  documentations: IDocumentation[];
  extensionUri: vscode.Uri;
  panels: { [id: string]: vscode.WebviewPanel };
  webview: vscode.Webview;
}

export default IDocumentationViewActionParams;

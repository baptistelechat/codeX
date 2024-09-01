import * as vscode from "vscode";
import IDocumentation from "../interfaces/IDocumentation";
import getDocumentationContent from "./documentation/getDocumentationContent";

const openGetHelp = (context: vscode.ExtensionContext) => {
  // Create and show a new webview
  const panel = vscode.window.createWebviewPanel(
    "getHelp", // Identifies the type of the webview. Used internally
    "Get Help", // Title of the panel displayed to the user
    vscode.ViewColumn.Two, // Editor column to show the new webview panel in.
    {
      enableScripts: true, // Allow scripts in the webview
      retainContextWhenHidden: true, // Preserve the state of the webview when it's hidden
      localResourceRoots: [vscode.Uri.file(context.extensionPath)], // Allow the webview to access local resources from the extension
    } // Webview options. More on these later.
  );

  const documentation = {
    name: "README",
    id: "",
    version: "",
    description: "",
    homepage: {
      url: "https://github.com/baptistelechat/codeX",
      canBeIframe: true,
    },
    documentationPage: {
      url: "https://github.com/baptistelechat/codeX",
      canBeIframe: true,
    },
    icon: "",
    isPinned: false,
    isFavorite: false,
    isHide: false,
    registry: "npm",
  } as IDocumentation;

  const content = getDocumentationContent(
    documentation,
    panel.webview,
    context.extensionUri,
    true
  );

  panel.webview.html = content;
};

export default openGetHelp;

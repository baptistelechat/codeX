import * as vscode from "vscode";
import getDocumentationViewContent from "../documentation/getDocumentationViewContent";
import { DocumentationViewProvider } from "./DocumentationViewProvider";
import { handleWebviewMessage } from "./handleWebviewMessage";

export async function resolveWebviewView(
  provider: DocumentationViewProvider,
  webviewView: vscode.WebviewView
) {
  provider._view = webviewView;

  provider.getDocumentations();

  webviewView.onDidChangeVisibility(() => {
    if (webviewView.visible) {
      if (provider._documentations.length === 0) {
        provider.getDocumentations();
      } else {
        const searchMode = provider._searchDocumentations
          .map((documentation) => documentation.id)
          .includes(provider._currentDocumentations);

        provider._view?.webview.postMessage({
          type: "setDocumentations",
          documentations: provider._documentations,
          searchDocumentations: provider._searchDocumentations,
          openDocumentations: provider._openDocumentations,
          currentDocumentation: provider._currentDocumentations,
          searchMode,
          searchValue: provider._searchValue,
        });
      }
    }
  });

  webviewView.webview.onDidReceiveMessage(async (message) => {
    await handleWebviewMessage(provider, message);
  });

  webviewView.webview.options = {
    enableScripts: true,
    localResourceRoots: [provider._extensionUri],
  };

  webviewView.webview.html = getDocumentationViewContent(
    webviewView.webview,
    provider._extensionUri
  );
}

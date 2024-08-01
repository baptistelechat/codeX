import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import getDocumentationViewContent from "../documentation/getDocumentationViewContent";
import { showErrorMessage } from "../showMessage";
import { DocumentationViewProvider } from "./DocumentationViewProvider";
import { handleWebviewMessage } from "./handleWebviewMessage";

export async function resolveWebviewView(
  provider: DocumentationViewProvider,
  webviewView: vscode.WebviewView
) {
  provider._view = webviewView;

  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders) {
    showErrorMessage("No workspace folder is open.");
    return;
  }

  const packageJsonPath = path.join(
    workspaceFolders[0].uri.fsPath,
    "package.json"
  );
  if (fs.existsSync(packageJsonPath)) {
    try {
      const packageJsonContent = fs.readFileSync(packageJsonPath, "utf8");
      const packageJSONContentParse = JSON.parse(packageJsonContent);
      const dependencies = [
        ...Object.keys(packageJSONContentParse.dependencies || {}),
        ...Object.keys(packageJSONContentParse.devDependencies || {}),
      ];

      provider._packageJson = dependencies;
    } catch (error) {
      showErrorMessage("Failed to read package.json.");
      return;
    }
  } else {
    showErrorMessage("No package.json found in the workspace.");
    return;
  }

  provider.getDocumentations();

  webviewView.onDidChangeVisibility(() => {
    if (webviewView.visible) {
      if (provider._documentations.length === 0) {
        provider.getDocumentations();
      } else {
        provider._view?.webview.postMessage({
          type: "setDocumentations",
          documentations: provider._documentations,
          searchDocumentations: provider._searchDocumentations,
          openDocumentations: provider._openDocumentations,
          currentDocumentation: provider._currentDocumentations,
          searchMode: provider._searchMode,
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

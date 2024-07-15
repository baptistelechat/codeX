import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import { showErrorMessage } from "../showMessage";
import { handleWebviewMessage } from "./handleWebviewMessage";
import getDocumentationViewContent from "../documentation/getDocumentationViewContent";
import { DocumentationViewProvider } from "./DocumentationViewProvider";

export async function resolveWebviewView(
  provider: DocumentationViewProvider,
  webviewView: vscode.WebviewView,
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
      provider._packageJson = JSON.parse(packageJsonContent);
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
      provider.getDocumentations();
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

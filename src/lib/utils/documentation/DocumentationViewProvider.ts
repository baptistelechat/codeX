import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import { IDocumentation } from "../../interfaces/IDocumentation";
import IPackageJson from "../../interfaces/IPackageJson";
import { showErrorMessage, showInformationMessage } from "../showMessage";
import focusDocumentation from "./focusDocumentation";
import getAllDocumentations from "./getAllDocumentations";
import getDocumentationViewContent from "./getDocumentationViewContent";
import openDocumentation from "./openDocumentation";

export class DocumentationViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "codeX.documentations";
  private _view?: vscode.WebviewView;
  private _panels: { [id: string]: vscode.WebviewPanel } = {};
  private packageJson: IPackageJson = {};
  private _documentations: IDocumentation[] = [];

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public async resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = webviewView;

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
        this.packageJson = JSON.parse(packageJsonContent);
      } catch (error) {
        showErrorMessage("Failed to read package.json.");
        return;
      }
    } else {
      showErrorMessage("No package.json found in the workspace.");
      return;
    }

    this.updateDocumentations();

    webviewView.onDidChangeVisibility(() => {
      if (webviewView.visible) {
        this.updateDocumentations();
      }
    });

    webviewView.webview.onDidReceiveMessage(async (message) => {
      switch (message.type) {
        case "openDocumentation":
          openDocumentation({
            id: message.documentationId,
            documentations: this._documentations,
            extensionUri: this._extensionUri,
            panels: this._panels,
            webview: webviewView.webview,
          });
          break;

        case "focusDocumentation":
          focusDocumentation({
            id: message.documentationId,
            documentations: this._documentations,
            extensionUri: this._extensionUri,
            panels: this._panels,
            webview: webviewView.webview,
          });
          break;

        case "reload":
          this.updateDocumentations();
          break;

        case "wip":
          showInformationMessage(
            "Work in progress. Stay tuned to know when this feature will be ready."
          );
          break;

        default:
          break;
      }
    });

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = getDocumentationViewContent(
      this._view.webview,
      this._extensionUri
    );
  }

  public async updateDocumentations() {
    if (this._view && this.packageJson) {
      this._documentations = await getAllDocumentations(this.packageJson);
      this._view.webview.postMessage({
        type: "setDocumentations",
        documentations: this._documentations,
      });
    }
  }
}

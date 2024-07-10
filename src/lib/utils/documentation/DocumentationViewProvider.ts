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
  private _packageJson: IPackageJson = {};
  private _documentations: IDocumentation[] = [];
  private _favoriteDocumentations: string[] = [];
  private _hideDocumentations: string[] = [];

  constructor(
    private readonly _extensionUri: vscode.Uri,
    private readonly context: vscode.ExtensionContext
  ) {
    this.loadFavoriteDocumentations();
    this.loadHideDocumentations();
  }

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
        this._packageJson = JSON.parse(packageJsonContent);
      } catch (error) {
        showErrorMessage("Failed to read package.json.");
        return;
      }
    } else {
      showErrorMessage("No package.json found in the workspace.");
      return;
    }

    this.getDocumentations();

    webviewView.onDidChangeVisibility(() => {
      if (webviewView.visible) {
        this.getDocumentations();
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

        case "toggleFavorite":
          this.toggleFavorite(message.documentationId);
          break;

        case "toggleHide":
          this.toggleHide(message.documentationId);
          break;

        case "reload":
          this.getDocumentations();
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

  public async getDocumentations() {
    if (this._view && this._packageJson) {
      this._documentations = await getAllDocumentations(
        this._packageJson,
        this._favoriteDocumentations,
        this._hideDocumentations
      );

      this._view.webview.postMessage({
        type: "setDocumentations",
        documentations: this._documentations,
      });
    }
  }

  private async loadFavoriteDocumentations() {
    const savedFavorites = this.context.globalState.get<string[]>(
      "favoriteDocumentations"
    );
    if (savedFavorites) {
      this._favoriteDocumentations = savedFavorites;
    }
  }

  private async saveFavoriteDocumentations() {
    await this.context.globalState.update(
      "favoriteDocumentations",
      this._favoriteDocumentations
    );
  }

  private toggleFavorite(documentationId: string) {
    const index = this._favoriteDocumentations.indexOf(documentationId);
    const documentationName = this._documentations.filter(
      (documentation) => documentation.id === documentationId
    )[0].name;
    if (index !== -1) {
      this._favoriteDocumentations.splice(index, 1);
      showInformationMessage(`${documentationName} removed from favorites.`);
    } else {
      this._favoriteDocumentations.push(documentationId);
      showInformationMessage(`${documentationName} added to favorites.`);
    }

    this.saveFavoriteDocumentations();
  }

  private async loadHideDocumentations() {
    const hidedFavorites =
      this.context.globalState.get<string[]>("hideDocumentations");
    if (hidedFavorites) {
      this._hideDocumentations = hidedFavorites;
    }
  }

  private async saveHideDocumentations() {
    await this.context.globalState.update(
      "hideDocumentations",
      this._hideDocumentations
    );
  }

  private toggleHide(documentationId: string) {
    const index = this._hideDocumentations.indexOf(documentationId);
    const documentationName = this._documentations.filter(
      (documentation) => documentation.id === documentationId
    )[0].name;
    if (index !== -1) {
      this._hideDocumentations.splice(index, 1);
      showInformationMessage(`${documentationName} unhide.`);
    } else {
      this._hideDocumentations.push(documentationId);
      showInformationMessage(`${documentationName} hide.`);
    }

    this.saveHideDocumentations();
  }
}

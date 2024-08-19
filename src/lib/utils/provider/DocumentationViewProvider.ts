import * as vscode from "vscode";
import { IDocumentation } from "../../interfaces/IDocumentation";
import { getDocumentations } from "../documentation/getDocumentations";
import loadFavoriteDocumentations from "../favoriteDocumentations/loadFavoriteDocumentations";
import saveFavoriteDocumentations from "../favoriteDocumentations/saveFavoriteDocumentations";
import toggleFavorite from "../favoriteDocumentations/toggleFavorite";
import { loadHideDocumentations } from "../hideDocumentations/loadHideDocumentations";
import saveHideDocumentations from "../hideDocumentations/saveHideDocumentations";
import toggleHide from "../hideDocumentations/toggleHide";
import loadPinnedDocumentations from "../pinnedDocumentations/loadPinnedDocumentations";
import savePinnedDocumentations from "../pinnedDocumentations/savePinnedDocumentations";
import togglePinned from "../pinnedDocumentations/togglePinned";
import { resetExtension } from "./resetExtension";
import { resolveWebviewView } from "./resolveWebviewView";

export class DocumentationViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "codeX.documentations";
  public _view?: vscode.WebviewView;
  public _panels: { [id: string]: vscode.WebviewPanel } = {};
  public _packageJson: string[] = [];
  public _documentations: IDocumentation[] = [];
  public _pinnedDocumentations: string[] = [];
  public _favoriteDocumentations: string[] = [];
  public _hideDocumentations: string[] = [];
  public _searchValue: string = "";
  public _searchMode: boolean = false;
  public _searchDocumentations: IDocumentation[] = [];
  public _currentDocumentations: string = "";
  public _openDocumentations: string[] = [];

  constructor(
    public readonly _extensionUri: vscode.Uri,
    public readonly context: vscode.ExtensionContext
  ) {
    this.loadPinnedDocumentations();
    this.loadFavoriteDocumentations();
    this.loadHideDocumentations();
  }

  public async resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    await resolveWebviewView(this, webviewView);
  }

  // Documentations
  public async getDocumentations() {
    await getDocumentations(this);
  }

  public async resetExtension() {
    await resetExtension(this);
  }

  public reloadExtension() {
    this._view?.webview.postMessage({
      type: "reloadExtension",
    });
  }

  // Save documentations
  private async loadPinnedDocumentations() {
    this._pinnedDocumentations = await loadPinnedDocumentations(this.context);
  }

  public async savePinnedDocumentations() {
    // console.log(this._pinnedDocumentations);
    await savePinnedDocumentations(this.context, this._pinnedDocumentations);
  }

  public async togglePinned(documentationId: string) {
    togglePinned(this, documentationId);
  }

  // Favorite documentations
  private async loadFavoriteDocumentations() {
    this._favoriteDocumentations = await loadFavoriteDocumentations(
      this.context
    );
  }

  public async saveFavoriteDocumentations() {
    // console.log(this._favoriteDocumentations);
    await saveFavoriteDocumentations(
      this.context,
      this._favoriteDocumentations
    );
  }

  public toggleFavorite(documentationId: string) {
    toggleFavorite(this, documentationId);
  }

  // Hide documentations
  private async loadHideDocumentations() {
    this._hideDocumentations = await loadHideDocumentations(this.context);
  }

  public async saveHideDocumentations() {
    // console.log(this._hideDocumentations);
    await saveHideDocumentations(this.context, this._hideDocumentations);
  }

  public toggleHide(documentationId: string) {
    toggleHide(this, documentationId);
  }
}

import * as vscode from "vscode";
import { IDocumentation } from "../../interfaces/IDocumentation";
import IPackageJson from "../../interfaces/IPackageJson";
import { getDocumentations } from "../documentation/getDocumentations";
import { saveFavoriteDocumentations } from "../favoriteDocumentations/saveFavoriteDocumentations";
import { toggleFavorite } from "../favoriteDocumentations/toggleFavorite";
import { loadHideDocumentations } from "../hideDocumentations/loadDocumentations";
import { saveHideDocumentations } from "../hideDocumentations/saveHideDocumentations";
import { toggleHide } from "../hideDocumentations/toggleHide";
import { resolveWebviewView } from "./resolveWebviewView";
import { loadFavoriteDocumentations } from "../favoriteDocumentations/loadFavoriteDocumentations";
import { resetExtension } from "./resetExtension";

export class DocumentationViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "codeX.documentations";
  public _view?: vscode.WebviewView;
  public _panels: { [id: string]: vscode.WebviewPanel } = {};
  public _packageJson: IPackageJson = {};
  public _documentations: IDocumentation[] = [];
  public _favoriteDocumentations: string[] = [];
  public _hideDocumentations: string[] = [];

  constructor(
    public readonly _extensionUri: vscode.Uri,
    public readonly context: vscode.ExtensionContext
  ) {
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

  // Favorite documentations
  private async loadFavoriteDocumentations() {
    this._favoriteDocumentations = await loadFavoriteDocumentations(
      this.context
    );
  }

  public async saveFavoriteDocumentations() {
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
    await saveHideDocumentations(this.context, this._hideDocumentations);
  }

  public toggleHide(documentationId: string) {
    toggleHide(this, documentationId);
  }
}
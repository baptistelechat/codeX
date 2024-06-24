import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import styleCodiconUri from "../assets/uri/styleCodiconUri";
import styleResetUri from "../assets/uri/styleResetUri";
import styleTailwindUri from "../assets/uri/styleTailwindUri";
import styleVscodeUri from "../assets/uri/styleVscodeUri";
import scriptSidebarUri from "../components/Sidebar/uri/scriptSidebarUri";
import styleSidebarUri from "../components/Sidebar/uri/styleSidebarUri";
import { IDocumentation } from "../interfaces/IDocumentation";
import getDocumentationContent from "./getDocumentationContent";
import getFaviconUrl from "./getFaviconUrl";
import getNonce from "./getNonce";
import getPackageInfo from "./getPackageInfo";
import isValidUrl from "./isValidUrl";
import { showErrorMessage, showInformationMessage } from "./showMessage";

export class CodeXViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "codeX.documentations";
  private _view?: vscode.WebviewView;
  private _panels: { [id: string]: vscode.WebviewPanel } = {};
  private packageJson: any;
  private _documentations: (IDocumentation | null)[] = [];

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
          this.openDocumentation(message.documentationId);
          break;

        case "focusDocumentation":
          this.focusDocumentation(message.documentationId);
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

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
  }

  private openDocumentation(id: string) {
    const documentation = this._documentations.find((doc) => doc?.id === id);
    if (documentation && isValidUrl(documentation.url)) {
      const panel = vscode.window.createWebviewPanel(
        id,
        documentation.name,
        vscode.ViewColumn.Two,
        {
          enableScripts: true,
          retainContextWhenHidden: true,
          localResourceRoots: [this._extensionUri],
        }
      );

      const content = getDocumentationContent(
        documentation,
        panel.webview,
        this._extensionUri
      );
      panel.webview.html = content;
      this._panels[id] = panel;

      panel.onDidDispose(() => {
        delete this._panels[id];
        this._view?.webview.postMessage({
          type: "documentationClosed",
          documentationId: id,
        });
      });

      panel.onDidChangeViewState(() => {
        if (panel.visible) {
          this._view?.webview.postMessage({
            type: "documentationFocused",
            documentationId: id,
          });
        }
      });
    } else {
      showErrorMessage("Invalid URL for documentation.");
    }
  }

  private focusDocumentation(id: string) {
    const panel = this._panels[id];
    if (panel) {
      panel.reveal(vscode.ViewColumn.Two);
    } else {
      this.openDocumentation(id);
    }
  }

  public async updateDocumentations() {
    if (this._view && this.packageJson) {
      const dependencies = [
        ...Object.keys(this.packageJson.dependencies || {}),
        ...Object.keys(this.packageJson.devDependencies || {}),
      ];

      const uniqueUrls: string[] = [];
      const documentations = await Promise.all(
        dependencies.map(async (dependency) => {
          const info = await getPackageInfo(dependency);
          if (info) {
            const url =
              info.homepage || (info.repository && info.repository.url) || "";
            if (uniqueUrls.includes(url)) {
              return null;
            }
            uniqueUrls.push(url);
            return {
              name: info.name.charAt(0).toUpperCase() + info.name.slice(1),
              id: info.name,
              version: info.version,
              description: info.description ?? "...",
              url,
              icon: getFaviconUrl(url) ?? "",
            } as IDocumentation;
          }
          return null;
        })
      );

      const validDocumentations = documentations
        .filter((doc) => doc !== null)
        .filter(
          (doc) => !doc?.id.startsWith("@types") && doc?.url !== ""
        ) as IDocumentation[];

      this._documentations = validDocumentations.sort((a, b) =>
        a && b ? a.name.localeCompare(b.name) : 0
      );

      this._view.webview.postMessage({
        type: "setDocumentations",
        documentations: this._documentations,
      });
    }
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const nonce = getNonce();
    const extensionUri = this._extensionUri;

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline' ${
          webview.cspSource
        }; font-src 'self' ${webview.cspSource}; script-src 'nonce-${nonce}';">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="${styleResetUri(webview, extensionUri)}" rel="stylesheet">
        <link href="${styleTailwindUri(
          webview,
          extensionUri
        )}" rel="stylesheet">
        <link href="${styleCodiconUri(webview, extensionUri)}" rel="stylesheet">
        <link href="${styleVscodeUri(webview, extensionUri)}" rel="stylesheet">
        <link href="${styleSidebarUri(webview, extensionUri)}" rel="stylesheet">
        <title>Documentation List</title>
        <script nonce="${nonce}" src="${scriptSidebarUri(
      this._view?.webview as vscode.Webview,
      this._extensionUri
    )}"></script>
      </head>
      <body>
        <div id="no-documentation-found" class="flex flex-col gap-4 py-4">
          <p>No documentation found. Try to reload the extension.</p>
          <div id="reload" class="flex items-center justify-center gap-2 rounded bg-sky-500 p-2 text-slate-50 hover:cursor-pointer hover:bg-sky-400">
            <div class="codicon codicon-refresh" aria-label="refresh"></div>
            <p class="text-slate-50">Reload</p>
          </div>
        </div>
        <div id="documentation-list" class="mt-2 space-y-2 max-w-full"></div>
      </body>
      </html>`;
  }
}

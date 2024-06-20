import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import { IDocumentation } from "../interfaces/IDocumentation";
import getFaviconUrl from "./getFaviconUrl";
import getNonce from "./getNonce";
import getPackageInfo from "./getPackageInfo";
import { getWebviewContent } from "./getWebviewContent";
import isValidUrl from "./isValidUrl";

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
      vscode.window.showErrorMessage("No workspace folder is open.");
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
        vscode.window.showErrorMessage("Failed to read package.json.");
        return;
      }
    } else {
      vscode.window.showErrorMessage("No package.json found in the workspace.");
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
      panel.webview.html = getWebviewContent(documentation);
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
      vscode.window.showErrorMessage("Invalid URL for documentation.");
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
              id: info.name,
              name: info.name.charAt(0).toUpperCase() + info.name.slice(1),
              description: info.description,
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
          (doc) => !doc?.id.startsWith("@") && doc?.url !== ""
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
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(
        this._extensionUri,
        "src",
        "components",
        "Sidebar",
        "main.js"
      )
    );
    const styleResetUri = webview.asWebviewUri(
      vscode.Uri.joinPath(
        this._extensionUri,
        "src",
        "assets",
        "styles",
        "reset.css"
      )
    );
    const styleVSCodeUri = webview.asWebviewUri(
      vscode.Uri.joinPath(
        this._extensionUri,
        "src",
        "assets",
        "styles",
        "vscode.css"
      )
    );
    const styleTailwindUri = webview.asWebviewUri(
      vscode.Uri.joinPath(
        this._extensionUri,
        "src",
        "assets",
        "styles",
        "tailwind.min.css"
      )
    );
    const codiconsUri = webview.asWebviewUri(
      vscode.Uri.joinPath(
        this._extensionUri,
        "node_modules",
        "@vscode",
        "codicons",
        "dist",
        "codicon.css"
      )
    );
    const styleMainUri = webview.asWebviewUri(
      vscode.Uri.joinPath(
        this._extensionUri,
        "src",
        "components",
        "Sidebar",
        "main.css"
      )
    );

    const nonce = getNonce();

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline' ${webview.cspSource}; font-src 'self' ${webview.cspSource}; script-src 'nonce-${nonce}';">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="${styleResetUri}" rel="stylesheet">
        <link href="${styleTailwindUri}" rel="stylesheet">
        <link href="${codiconsUri}" rel="stylesheet">
        <link href="${styleVSCodeUri}" rel="stylesheet">
        <link href="${styleMainUri}" rel="stylesheet">
        <title>Documentation List</title>
        <script nonce="${nonce}" src="${scriptUri}"></script>
      </head>
      <body>
        <div id="no-documentation-found" class="flex flex-col gap-4 p-4">
          <p>No documentation found. Try to reload the extension.</p>
          <div id="reload" class="flex items-center justify-center gap-2 rounded bg-sky-500 p-2 text-slate-50 hover:cursor-pointer hover:bg-sky-400">
            <div class="codicon codicon-refresh" aria-label="refresh"></div>
            <p class="text-slate-50">Reload</p>
          </div>
        </div>
        <div id="documentation-list" class="mt-2 space-y-2"></div>
      </body>
      </html>`;
  }
}

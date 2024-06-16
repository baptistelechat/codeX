import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import documentations from "../data/documentations";
import { getWebviewContent } from "./getWebviewContent";

export class CodeXViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "codeX.documentations";

  private _view?: vscode.WebviewView;
  private packageJson: any;

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

        // Filter documentations based on dependencies
        const filteredDocumentations = documentations.filter((doc) => {
          // Check if dependency exists in dependencies or devDependencies
          return doc.dependencies.some((dependency) => {
            return (
              this.packageJson.dependencies?.[dependency] ||
              this.packageJson.devDependencies?.[dependency]
            );
          });
        });

        // Send filtered documentations to the webview
        webviewView.webview.postMessage({
          type: "setDocumentations",
          documentations: filteredDocumentations,
        });
      } catch (error) {
        vscode.window.showErrorMessage("Failed to read package.json.");
      }
    } else {
      vscode.window.showErrorMessage("No package.json found in the workspace.");
    }

    if (webviewView.visible && this.packageJson) {
      // Filter documentations based on dependencies
      const filteredDocumentations = documentations.filter((doc) => {
        // Check if dependency exists in dependencies or devDependencies
        return doc.dependencies.some((dependency) => {
          return (
            this.packageJson.dependencies?.[dependency] ||
            this.packageJson.devDependencies?.[dependency]
          );
        });
      });

      webviewView.webview.postMessage({
        type: "setDocumentations",
        documentations: filteredDocumentations,
      });
    }

    // Update documentations when visibility changes
    webviewView.onDidChangeVisibility(() => {
      if (webviewView.visible && this.packageJson) {
        // Filter documentations based on dependencies
        const filteredDocumentations = documentations.filter((doc) => {
          // Check if dependency exists in dependencies or devDependencies
          return doc.dependencies.some((dependency) => {
            return (
              this.packageJson.dependencies?.[dependency] ||
              this.packageJson.devDependencies?.[dependency]
            );
          });
        });

        webviewView.webview.postMessage({
          type: "setDocumentations",
          documentations: filteredDocumentations,
        });
      }
    });

    webviewView.webview.onDidReceiveMessage((message) => {
      switch (message.type) {
        case "openDocumentation":
          const documentationId = message.documentationId;
          const documentation = documentations.filter(
            (documentation) => documentation.id === documentationId
          )[0];
          if (this.isValidUrl(documentation.url)) {
            const panel = vscode.window.createWebviewPanel(
              documentation.id,
              documentation.name,
              vscode.ViewColumn.Two,
              {
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: [this._extensionUri],
              }
            );

            panel.webview.html = getWebviewContent(documentation);
          } else {
            vscode.window.showErrorMessage("Invalid URL for documentation.");
          }

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

  public refresh() {
    if (this._view?.visible && this.packageJson) {
      // Filter documentations based on dependencies
      const filteredDocumentations = documentations.filter((doc) => {
        // Check if dependency exists in dependencies or devDependencies
        return doc.dependencies.some((dependency) => {
          return (
            this.packageJson.dependencies?.[dependency] ||
            this.packageJson.devDependencies?.[dependency]
          );
        });
      });

      this._view.webview.postMessage({
        type: "setDocumentations",
        documentations: filteredDocumentations,
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
          <script src="https://cdn.tailwindcss.com"></script>
          <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline' ${webview.cspSource}; script-src 'nonce-${nonce}';">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link href="${styleResetUri}" rel="stylesheet">
          <link href="${styleTailwindUri}" rel="stylesheet">
          <link href="${styleVSCodeUri}" rel="stylesheet">
          <link href="${styleMainUri}" rel="stylesheet">
          <title>Documentation List</title>
          <script nonce="${nonce}" src="${scriptUri}"></script>
        </head>
        <body>
          <p id="no-documentation-found" class="flex items-center gap-2 font-bold p-4">
            No documentation found. Try to refresh the extension.
            <svg width="18" height="18" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M4.681 3H2V2h3.5l.5.5V6H5V4a5 5 0 1 0 4.53-.761l.302-.954A6 6 0 1 1 4.681 3z"/></svg>
          </p>
          <div id="documentation-list" class="mt-2 space-y-2"></div>
        </body>
      </html>`;
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  }
}

function getNonce() {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

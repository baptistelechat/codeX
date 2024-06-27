import * as vscode from "vscode";

const openFeedbackForms = (context: vscode.ExtensionContext) => {
  // Create and show a new webview
  const panel = vscode.window.createWebviewPanel(
    "feedback", // Identifies the type of the webview. Used internally
    "Feedback", // Title of the panel displayed to the user
    vscode.ViewColumn.Two, // Editor column to show the new webview panel in.
    {
      enableScripts: true, // Allow scripts in the webview
      retainContextWhenHidden: true, // Preserve the state of the webview when it's hidden
      localResourceRoots: [vscode.Uri.file(context.extensionPath)], // Allow the webview to access local resources from the extension
    } // Webview options. More on these later.
  );

  panel.webview.html = `
      <!DOCTYPE html>
      <html lang="en" style="height: 100%; margin: 0; padding: 0;">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Revit API Docs</title>
            <style>
                body {
                    height: 100%;
                    margin: 0;
                    padding: 0;
                    overflow: hidden;
                }
                iframe {
                    width: 100%;
                    height: 100%;
                    border: none;
                }
            </style>
        </head>
        <body>
            <iframe src="https://tally.so/r/wzz91R"></iframe>
        </body>
      </html>`;
};

export default openFeedbackForms;

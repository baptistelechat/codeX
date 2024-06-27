import * as vscode from "vscode";


const showErrorMessage = (message: string) => {
  vscode.window.showErrorMessage(message);
};

const showInformationMessage = (message: string) => {
  vscode.window.showInformationMessage(message);
};

export { showErrorMessage, showInformationMessage };

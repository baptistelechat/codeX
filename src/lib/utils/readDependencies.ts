import * as fs from "fs";
import path from "path";
import * as vscode from "vscode";
import { DocumentationViewProvider } from "./provider/DocumentationViewProvider";
import { showErrorMessage } from "./showMessage";

const readDependencies = (provider: DocumentationViewProvider) => {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders) {
    showErrorMessage("No workspace folder is open.");
    return;
  }

  const packageJsonPath = path.join(
    workspaceFolders[0].uri.fsPath,
    "package.json"
  );

  const composerJsonPath = path.join(
    workspaceFolders[0].uri.fsPath,
    "composer.json"
  );

  if (fs.existsSync(packageJsonPath)) {
    try {
      const packageJsonContent = fs.readFileSync(packageJsonPath, "utf8");
      const packageJsonContentParse = JSON.parse(packageJsonContent);
      const dependencies = [
        ...Object.keys(packageJsonContentParse.dependencies || {}),
        ...Object.keys(packageJsonContentParse.devDependencies || {}),
      ];

      provider._registry = "npm";
      provider._dependencies = dependencies;
    } catch (error) {
      showErrorMessage("Failed to read package.json.");
      return;
    }
  } else if (fs.existsSync(composerJsonPath)) {
    try {
      const composerJsonContent = fs.readFileSync(composerJsonPath, "utf8");
      const composerJsonContentParse = JSON.parse(composerJsonContent);
      const dependencies = [
        ...Object.keys(composerJsonContentParse.require || {}),
        ...Object.keys(composerJsonContentParse["require-dev"] || {}),
      ];

      provider._registry = "packagist";
      provider._dependencies = dependencies;
    } catch (error) {
      showErrorMessage("Failed to read composer.json.");
      return;
    }
  } else {
    showErrorMessage(
      "No package.json or composer.json found in the workspace."
    );
    return;
  }
};

export default readDependencies;

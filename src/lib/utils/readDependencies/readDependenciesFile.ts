import * as fs from "fs";
import path from "path";
import * as vscode from "vscode";
import IDependency from "../../interfaces/IDependency";
import { DocumentationViewProvider } from "../provider/DocumentationViewProvider";
import { showErrorMessage } from "../showMessage";

const readDependenciesFile = (
  provider: DocumentationViewProvider,
  registry: "npm" | "packagist"
) => {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders) {
    showErrorMessage("No workspace folder is open.");
    return;
  }
  const fileName = registry === "npm" ? "package.json" : "composer.json";
  const filePath = path.join(workspaceFolders[0].uri.fsPath, fileName);
  const fileExist = fs.existsSync(filePath);

  if (fileExist) {
    try {
      const fileContent = fs.readFileSync(filePath, "utf8");
      const fileContentParse = JSON.parse(fileContent);
      const dependencies = [
        // package.json
        ...Object.keys(fileContentParse.dependencies || {}),
        ...Object.keys(fileContentParse.devDependencies || {}),
        // composer.json
        ...Object.keys(fileContentParse.require || {}),
        ...Object.keys(fileContentParse["require-dev"] || {}),
      ];

      provider._dependencies.push(
        ...dependencies.map(
          (dependency) =>
            ({
              id: dependency,
              registry,
            } as IDependency)
        )
      );
    } catch (error) {
      showErrorMessage(`Failed to read ${fileName}`);
      return;
    }
  }
};

export default readDependenciesFile;

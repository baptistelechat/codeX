import * as vscode from "vscode";
import IDependency from "../../interfaces/IDependency";

const loadHideDocumentations = async (
  context: vscode.ExtensionContext
): Promise<IDependency[]> => {
  const hiddenDocumentations =
    context.globalState.get<(string | IDependency)[]>("hideDocumentations");

  if (hiddenDocumentations && typeof hiddenDocumentations[0] === "string") {
    const convertedHidden = (hiddenDocumentations as string[]).map<IDependency>(
      (id) => ({
        id,
        registry: "npm",
      })
    );

    await context.globalState.update("hideDocumentations", convertedHidden);

    return convertedHidden;
  }

  return (hiddenDocumentations as IDependency[]) || [];
};

export default loadHideDocumentations;

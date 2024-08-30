import * as vscode from "vscode";
import IDependency from "../../interfaces/IDependency";

const loadPinnedDocumentations = async (
  context: vscode.ExtensionContext
): Promise<IDependency[]> => {
  const savedPinned = context.globalState.get<(string | IDependency)[]>(
    "pinnedDocumentations"
  );

  if (savedPinned && typeof savedPinned[0] === "string") {
    const convertedPinned = (savedPinned as string[]).map<IDependency>(
      (id) => ({
        id,
        registry: "npm",
      })
    );

    await context.globalState.update("pinnedDocumentations", convertedPinned);

    return convertedPinned;
  }

  return (savedPinned as IDependency[]) || [];
};

export default loadPinnedDocumentations;

import * as vscode from "vscode";

const loadPinnedDocumentations = async (
  context: vscode.ExtensionContext
): Promise<string[]> => {
  const savedPinned = context.globalState.get<string[]>(
    "pinnedDocumentations"
  );
  return savedPinned || [];
};

export default loadPinnedDocumentations;

import * as vscode from "vscode";
import IDependency from "../../interfaces/IDependency";

const loadFavoriteDocumentations = async (
  context: vscode.ExtensionContext
): Promise<IDependency[]> => {
  const savedFavorites = context.globalState.get<(string | IDependency)[]>(
    "favoriteDocumentations"
  );

  if (savedFavorites && typeof savedFavorites[0] === "string") {
    const convertedFavorites = (savedFavorites as string[]).map<IDependency>(
      (id) => ({
        id,
        registry: "npm"
      })
    );

    await context.globalState.update("favoriteDocumentations", convertedFavorites);

    return convertedFavorites;
  }

  return (savedFavorites as IDependency[]) || [];
};

export default loadFavoriteDocumentations;

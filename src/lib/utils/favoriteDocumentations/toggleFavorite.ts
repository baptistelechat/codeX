import IDependency from "../../interfaces/IDependency";
import getDocumentationName from "../getDocumentationName";
import { DocumentationViewProvider } from "../provider/DocumentationViewProvider";
import { showInformationMessage } from "../showMessage";

const toggleFavorite = (
  provider: DocumentationViewProvider,
  dependency: IDependency
) => {
  const index = provider._favoriteDocumentations.findIndex(
    (documentation) => documentation.id === dependency.id
  );

  if (index !== -1) {
    provider._favoriteDocumentations.splice(index, 1);
    showInformationMessage(
      `${getDocumentationName(
        provider,
        dependency.id
      )} removed from favorites.`
    );
  } else {
    provider._favoriteDocumentations.push(dependency);
    showInformationMessage(
      `${getDocumentationName(provider, dependency.id)} added to favorites.`
    );
  }

  provider.saveFavoriteDocumentations();
};

export default toggleFavorite;

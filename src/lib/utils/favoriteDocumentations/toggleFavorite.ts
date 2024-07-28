import getDocumentationName from "../getDocumentationName";
import { DocumentationViewProvider } from "../provider/DocumentationViewProvider";
import { showInformationMessage } from "../showMessage";

const toggleFavorite = (
  provider: DocumentationViewProvider,
  documentationId: string
) => {
  const index = provider._favoriteDocumentations.indexOf(documentationId);

  if (index !== -1) {
    provider._favoriteDocumentations.splice(index, 1);
    showInformationMessage(
      `${getDocumentationName(
        provider,
        documentationId
      )} removed from favorites.`
    );
  } else {
    provider._favoriteDocumentations.push(documentationId);
    showInformationMessage(
      `${getDocumentationName(provider, documentationId)} added to favorites.`
    );
  }

  provider.saveFavoriteDocumentations();
};

export default toggleFavorite;

import { DocumentationViewProvider } from "../provider/DocumentationViewProvider";
import { showInformationMessage } from "../showMessage";

export function toggleFavorite(
  provider: DocumentationViewProvider,
  documentationId: string
) {
  const index = provider._favoriteDocumentations.indexOf(documentationId);
  const documentationName = provider._documentations.filter(
    (documentation) => documentation.id === documentationId
  )[0].name;
  if (index !== -1) {
    provider._favoriteDocumentations.splice(index, 1);
    showInformationMessage(`${documentationName} removed from favorites.`);
  } else {
    provider._favoriteDocumentations.push(documentationId);
    showInformationMessage(`${documentationName} added to favorites.`);
  }

  provider.saveFavoriteDocumentations();
}

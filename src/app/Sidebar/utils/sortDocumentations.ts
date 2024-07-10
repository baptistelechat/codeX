import { IDocumentation } from "../../../lib/interfaces/IDocumentation";

const sortDocumentations = (
  documentations: IDocumentation[] = [],
  favoriteDocumentationIds: string[]
): IDocumentation[] => {
  const uncategorizedDocumentations: IDocumentation[] = [];
  const favoriteDocumentations: IDocumentation[] = [];

  documentations.map((documentation) => {
    const isFavorite = favoriteDocumentationIds.includes(documentation.id);

    if (isFavorite) {
      favoriteDocumentations.push(documentation);
    } else {
      uncategorizedDocumentations.push(documentation);
    }
  });

  const sortedFavoriteDocumentations = favoriteDocumentations.sort((a, b) =>
    a && b ? a.id.localeCompare(b.id) : 0
  );

  const sortedUncategorizedDocumentation = uncategorizedDocumentations.sort(
    (a, b) => (a && b ? a.id.localeCompare(b.id) : 0)
  );

  const sortedDocumentations = sortedFavoriteDocumentations.concat(
    sortedUncategorizedDocumentation
  );

  return sortedDocumentations;
};

export default sortDocumentations;

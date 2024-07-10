import { IDocumentation } from "../../../lib/interfaces/IDocumentation";

const sortDocumentations = (
  documentations: IDocumentation[] = [],
  favoriteDocumentationIds: string[],
  hideDocumentationIds: string[]
): IDocumentation[] => {
  const uncategorizedDocumentations: IDocumentation[] = [];
  const favoriteDocumentations: IDocumentation[] = [];
  const hideDocumentations: IDocumentation[] = [];

  documentations.map((documentation) => {
    const isFavorite = favoriteDocumentationIds.includes(documentation.id);
    const isHide = hideDocumentationIds.includes(documentation.id);

    if (isFavorite) {
      favoriteDocumentations.push(documentation);
    } else if (isHide) {
      hideDocumentations.push(documentation);
    } else {
      uncategorizedDocumentations.push(documentation);
    }
  });

  const sortedFavoriteDocumentations = favoriteDocumentations.sort((a, b) =>
    a && b ? a.id.localeCompare(b.id) : 0
  );

  const sortedHideDocumentations = hideDocumentations.sort((a, b) =>
    a && b ? a.id.localeCompare(b.id) : 0
  );

  const sortedUncategorizedDocumentation = uncategorizedDocumentations.sort(
    (a, b) => (a && b ? a.id.localeCompare(b.id) : 0)
  );

  const sortedDocumentations = [
    ...sortedFavoriteDocumentations,
    ...sortedUncategorizedDocumentation,
    ...sortedHideDocumentations,
  ];

  return sortedDocumentations;
};

export default sortDocumentations;

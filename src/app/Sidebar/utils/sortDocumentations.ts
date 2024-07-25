import { IDocumentation } from "../../../lib/interfaces/IDocumentation";

const sortDocumentations = (
  documentations: IDocumentation[] = [],
  favoriteDocumentationIds: string[],
  hideDocumentationIds: string[],
  searchMode: boolean
): IDocumentation[] => {
  // console.log("searchMode:", searchMode);

  const uncategorizedDocumentations: IDocumentation[] = [];
  const favoriteDocumentations: IDocumentation[] = [];
  const hideDocumentations: IDocumentation[] = [];

  documentations.forEach((documentation) => {
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

  const sortedFavoriteDocumentations = [...favoriteDocumentations].sort(
    (a, b) => (a && b ? a.id.localeCompare(b.id) : 0)
  );

  const sortedHideDocumentations = [...hideDocumentations].sort((a, b) =>
    a && b ? a.id.localeCompare(b.id) : 0
  );

  const sortedUncategorizedDocumentations = [
    ...uncategorizedDocumentations,
  ].sort((a, b) => (a && b ? a.id.localeCompare(b.id) : 0));

  if (searchMode) {
    // console.log("searchMode activated");
    const sortedDocumentations = [
      ...sortedFavoriteDocumentations,
      ...uncategorizedDocumentations,
      ...sortedHideDocumentations,
    ];

    return sortedDocumentations;
  }

  // console.log("default mode activated");
  const sortedDocumentations = [
    ...sortedFavoriteDocumentations,
    ...sortedUncategorizedDocumentations,
    ...sortedHideDocumentations,
  ];

  return sortedDocumentations;
};

export default sortDocumentations;

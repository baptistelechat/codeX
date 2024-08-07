import { IDocumentation } from "../../../lib/interfaces/IDocumentation";

const sortDocumentations = (
  documentations: IDocumentation[] = [],
  pinnedDocumentationIds: string[],
  favoriteDocumentationIds: string[],
  hideDocumentationIds: string[],
  searchMode: boolean
): IDocumentation[] => {
  // console.log("searchMode:", searchMode);

  const uncategorizedDocumentations: IDocumentation[] = [];
  const pinnedDocumentations: IDocumentation[] = [];
  const favoriteDocumentations: IDocumentation[] = [];
  const hideDocumentations: IDocumentation[] = [];

  documentations.forEach((documentation) => {
    const isPinned = pinnedDocumentationIds.includes(documentation.id);
    const isFavorite = favoriteDocumentationIds.includes(documentation.id);
    const isHide = hideDocumentationIds.includes(documentation.id);

    if (isPinned) {
      pinnedDocumentations.push(documentation);
    } else if (isFavorite) {
      favoriteDocumentations.push(documentation);
    } else if (isHide) {
      hideDocumentations.push(documentation);
    } else {
      uncategorizedDocumentations.push(documentation);
    }
  });

  const sortedPinnedDocumentations = [...pinnedDocumentations].sort(
    (a, b) => (a && b ? a.id.localeCompare(b.id) : 0)
  );

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
      ...sortedPinnedDocumentations,
      ...sortedFavoriteDocumentations,
      ...uncategorizedDocumentations,
      ...sortedHideDocumentations,
    ];
    
    return sortedDocumentations;
  }
  
  // console.log("default mode activated");
  const sortedDocumentations = [
    ...sortedPinnedDocumentations,
    ...sortedFavoriteDocumentations,
    ...sortedUncategorizedDocumentations,
    ...sortedHideDocumentations,
  ];

  return sortedDocumentations;
};

export default sortDocumentations;

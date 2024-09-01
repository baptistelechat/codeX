import IDocumentation from "../../../../lib/interfaces/IDocumentation";

export const npmLength = (
  searchMode: boolean,
  documentations: IDocumentation[],
  searchDocumentations: IDocumentation[]
) =>
  searchMode
    ? searchDocumentations.filter(
        (documentation) => documentation.registry === "npm"
      ).length
    : documentations.filter((documentation) => documentation.registry === "npm")
        .length;

export const packagistLength = (
  searchMode: boolean,
  documentations: IDocumentation[],
  searchDocumentations: IDocumentation[]
) =>
  searchMode
    ? searchDocumentations.filter(
        (documentation) => documentation.registry === "packagist"
      ).length
    : documentations.filter(
        (documentation) => documentation.registry === "packagist"
      ).length;

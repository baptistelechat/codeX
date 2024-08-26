import { DocumentationViewProvider } from "./provider/DocumentationViewProvider";

const getDocumentationName = (
  provider: DocumentationViewProvider,
  documentationId: string
) => {
  try {
    const name = provider._documentations.filter(
      (documentation) => documentation.id === documentationId
    )[0].name;

    return name;
  } catch (error) {
    try {
      const name = provider._searchDocumentations.filter(
        (documentation) => documentation.id === documentationId
      )[0].name;

      return name;
    } catch (error) {
      return "error";
    }
  }
};

export default getDocumentationName;

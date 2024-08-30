import { DocumentationViewProvider } from "../provider/DocumentationViewProvider";
import readDependencies from "../readDependencies/readDependencies";
import getAllDocumentations from "./getAllDocumentations";

export async function getDocumentations(provider: DocumentationViewProvider) {
  readDependencies(provider);

  if (provider._view && provider._dependencies) {
    const pinnedDocumentations = await getAllDocumentations(provider, [
      ...provider._pinnedDocumentations,
      ...provider._searchDocumentations
        .filter((documentation) => documentation.isPinned)
        .map((documentation) => ({
          id: documentation.id,
          registry: documentation.registry,
        })),
    ]);

    const documentations = await getAllDocumentations(
      provider,
      provider._dependencies
    );

    provider._documentations = [
      ...pinnedDocumentations,
      ...documentations.filter((documentation) => !documentation.isPinned),
    ].filter(
      (doc, index, self) => index === self.findIndex((d) => d.id === doc.id)
    );

    provider._view.webview.postMessage({
      type: "setDocumentations",
      documentations: provider._documentations,
      searchDocumentations: provider._searchDocumentations,
      openDocumentations: provider._openDocumentations,
      currentDocumentation: provider._currentDocumentations,
      searchMode: provider._searchMode,
      searchValue: provider._searchValue,
    });
  }
}

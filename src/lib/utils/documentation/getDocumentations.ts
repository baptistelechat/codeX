import { DocumentationViewProvider } from "../provider/DocumentationViewProvider";
import getAllDocumentations from "./getAllDocumentations";

export async function getDocumentations(provider: DocumentationViewProvider) {
  if (provider._view && provider._packageJson) {
    const pinnedDocumentations = await getAllDocumentations(provider, [
      ...provider._pinnedDocumentations,
      ...provider._searchDocumentations
        .filter((documentation) => documentation.isPinned)
        .map((documentation) => documentation.id),
    ]);

    const documentations = await getAllDocumentations(
      provider,
      provider._packageJson
    );

    provider._documentations = [
      ...pinnedDocumentations,
      ...documentations.filter((documentation) => !documentation.isPinned),
    ];

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

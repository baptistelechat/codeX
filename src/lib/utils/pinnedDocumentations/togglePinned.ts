import getAllDocumentations from "../documentation/getAllDocumentations";
import getDocumentationName from "../getDocumentationName";
import { DocumentationViewProvider } from "../provider/DocumentationViewProvider";
import { showInformationMessage } from "../showMessage";

const togglePinned = async (
  provider: DocumentationViewProvider,
  documentationId: string
) => {
  const index = provider._pinnedDocumentations.indexOf(documentationId);

  if (index !== -1) {
    provider._pinnedDocumentations.splice(index, 1);
    showInformationMessage(
      `${getDocumentationName(provider, documentationId)} unpinned.`
    );
  } else {
    provider._pinnedDocumentations.push(documentationId);
    showInformationMessage(
      `${getDocumentationName(provider, documentationId)} pinned for later.`
    );
  }

  await provider.savePinnedDocumentations();

  if (provider._view) {
    const pinnedDocumentations = await getAllDocumentations(provider, [
      ...provider._pinnedDocumentations,
      ...provider._searchDocumentations
        .filter((documentation) => documentation.isPinned)
        .map((documentation) => documentation.id),
    ]);

    const seenIds = new Set();

    const uniqueDocumentations = provider._documentations.filter(
      (documentation) => {
        if (seenIds.has(documentation.id)) {
          return false;
        }
        seenIds.add(documentation.id);
        return true;
      }
    );

    provider._documentations = uniqueDocumentations;

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
};

export default togglePinned;

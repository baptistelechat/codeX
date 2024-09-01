import IDependency from "../../interfaces/IDependency";
import getDocumentationName from "../getDocumentationName";
import { DocumentationViewProvider } from "../provider/DocumentationViewProvider";
import { showInformationMessage } from "../showMessage";

const togglePinned = async (
  provider: DocumentationViewProvider,
  dependency: IDependency
) => {
  const pinnedDocumentationIndex = provider._pinnedDocumentations.findIndex(
    (documentation) => documentation.id === dependency.id
  );

  const documentationIndex = provider._documentations.findIndex(
    (documentation) => documentation.id === dependency.id
  );

  const searchDocumentationIndex = provider._searchDocumentations.findIndex(
    (documentation) => documentation.id === dependency.id
  );

  if (pinnedDocumentationIndex !== -1) {
    provider._pinnedDocumentations.splice(pinnedDocumentationIndex, 1);

    if (documentationIndex !== -1) {
      provider._documentations[documentationIndex].isPinned = false;
    }

    if (searchDocumentationIndex !== -1) {
      provider._searchDocumentations[searchDocumentationIndex].isPinned = false;
    }

    showInformationMessage(
      `${getDocumentationName(provider, dependency.id)} unpinned.`
    );
  } else {
    provider._pinnedDocumentations.push(dependency);

    if (documentationIndex !== -1) {
      provider._documentations[documentationIndex].isPinned = true;
    }

    if (searchDocumentationIndex !== -1) {
      provider._searchDocumentations[searchDocumentationIndex].isPinned = true;

      provider._documentations.push(
        provider._searchDocumentations[searchDocumentationIndex]
      );

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
    }

    showInformationMessage(
      `${getDocumentationName(provider, dependency.id)} pinned for later.`
    );
  }

  await provider.savePinnedDocumentations();

  if (provider._view) {
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

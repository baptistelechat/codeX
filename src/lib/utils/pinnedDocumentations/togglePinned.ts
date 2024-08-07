import getDocumentationName from "../getDocumentationName";
import { DocumentationViewProvider } from "../provider/DocumentationViewProvider";
import { showInformationMessage } from "../showMessage";

const togglePinned = (
  provider: DocumentationViewProvider,
  documentationId: string
) => {
  const index = provider._pinnedDocumentations.indexOf(documentationId);

  if (index !== -1) {
    provider._pinnedDocumentations.splice(index, 1);
    showInformationMessage(
      `${getDocumentationName(
        provider,
        documentationId
      )} unpinned.`
    );
  } else {
    provider._pinnedDocumentations.push(documentationId);
    showInformationMessage(
      `${getDocumentationName(provider, documentationId)} pinned for later.`
    );
  }

  provider.savePinnedDocumentations();
};

export default togglePinned;

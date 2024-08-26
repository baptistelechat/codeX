import getDocumentationName from "../getDocumentationName";
import { DocumentationViewProvider } from "../provider/DocumentationViewProvider";
import { showInformationMessage } from "../showMessage";

const toggleHide = (
  provider: DocumentationViewProvider,
  documentationId: string
) => {
  const index = provider._hideDocumentations.indexOf(documentationId);

  if (index !== -1) {
    provider._hideDocumentations.splice(index, 1);
    showInformationMessage(
      `${getDocumentationName(provider, documentationId)} unhide.`
    );
  } else {
    provider._hideDocumentations.push(documentationId);
    showInformationMessage(
      `${getDocumentationName(provider, documentationId)} hide.`
    );
  }

  provider.saveHideDocumentations();
};

export default toggleHide;

import { DocumentationViewProvider } from "../provider/DocumentationViewProvider";
import { showInformationMessage } from "../showMessage";

export function toggleHide(
  provider: DocumentationViewProvider,
  documentationId: string
) {
  const index = provider._hideDocumentations.indexOf(documentationId);
  const documentationName = provider._documentations.filter(
    (documentation) => documentation.id === documentationId
  )[0].name;
  if (index !== -1) {
    provider._hideDocumentations.splice(index, 1);
    showInformationMessage(`${documentationName} unhide.`);
  } else {
    provider._hideDocumentations.push(documentationId);
    showInformationMessage(`${documentationName} hide.`);
  }

  provider.saveHideDocumentations();
}

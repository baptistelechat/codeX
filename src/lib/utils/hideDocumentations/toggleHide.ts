import IDependency from "../../interfaces/IDependency";
import getDocumentationName from "../getDocumentationName";
import { DocumentationViewProvider } from "../provider/DocumentationViewProvider";
import { showInformationMessage } from "../showMessage";

const toggleHide = (
  provider: DocumentationViewProvider,
  dependency: IDependency
) => {
  const index = provider._hideDocumentations.findIndex(
    (documentation) => documentation.id === dependency.id
  );

  if (index !== -1) {
    provider._hideDocumentations.splice(index, 1);
    showInformationMessage(
      `${getDocumentationName(provider, dependency.id)} unhide.`
    );
  } else {
    provider._hideDocumentations.push(dependency);
    showInformationMessage(
      `${getDocumentationName(provider, dependency.id)} hide.`
    );
  }

  provider.saveHideDocumentations();
};

export default toggleHide;

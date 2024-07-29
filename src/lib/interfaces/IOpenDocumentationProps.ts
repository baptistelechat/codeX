import { DocumentationViewProvider } from "../utils/provider/DocumentationViewProvider";

interface IOpenDocumentationProps {
  id: string;
  provider: DocumentationViewProvider;
  homepage: boolean;
}

export default IOpenDocumentationProps;

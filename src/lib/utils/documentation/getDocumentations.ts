import { DocumentationViewProvider } from "../provider/DocumentationViewProvider";
import getAllDocumentations from "./getAllDocumentations";

export async function getDocumentations(provider: DocumentationViewProvider) {
  if (provider._view && provider._packageJson) {
    provider._documentations = await getAllDocumentations(provider);

    provider._view.webview.postMessage({
      type: "setDocumentations",
      documentations: provider._documentations,
      searchDocumentations: provider._searchDocumentations,
      searchMode: false,
      searchValue: provider._searchValue,
    });
  }
}

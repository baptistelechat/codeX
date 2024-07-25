import { DocumentationViewProvider } from "../provider/DocumentationViewProvider";
import getAllDocumentations from "./getAllDocumentations";

export async function getDocumentations(provider: DocumentationViewProvider) {
  if (provider._view && provider._packageJson) {
    provider._documentations = await getAllDocumentations(
      provider._packageJson,
      provider._favoriteDocumentations,
      provider._hideDocumentations
    );

    provider._view.webview.postMessage({
      type: "setDocumentations",
      documentations: provider._documentations,
      searchMode: false,
      searchValue: provider._searchValue,
    });
  }
}

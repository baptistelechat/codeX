import * as vscode from "vscode";
import { IDocumentation } from "../../interfaces/IDocumentation";
import getFallbackContent from "./content/getFallbackContent";
import getGitHubContent from "./content/getGitHubContent";
import getIframeContent from "./content/getIframeContent";

const getDocumentationContent = (
  documentation: IDocumentation,
  webview: vscode.Webview,
  extensionUri: vscode.Uri,
  homepage: boolean
) => {
  const url = homepage
    ? documentation.homepage.url
    : documentation.documentationPage.url;
  const canBeIframe = homepage
    ? documentation.homepage.canBeIframe
    : documentation.documentationPage.canBeIframe;

  if (url.includes("github.com")) {
    return getGitHubContent(
      documentation,
      webview,
      extensionUri,
      url,
      homepage
    );
  } else if (canBeIframe) {
    return getIframeContent(
      documentation,
      webview,
      extensionUri,
      url,
      homepage
    );
  } else {
    return getFallbackContent(
      documentation,
      webview,
      extensionUri,
      url,
      homepage
    );
  }
};

export default getDocumentationContent;

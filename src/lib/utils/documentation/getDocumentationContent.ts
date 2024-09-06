import * as vscode from "vscode";
import IDocumentation from "../../interfaces/IDocumentation";
import Language from "../../types/Language";
import getFallbackContent from "./content/getFallbackContent";
import getGitHubContent from "./content/getGitHubContent";
import getIframeContent from "./content/getIframeContent";

const getDocumentationContent = (
  documentation: IDocumentation,
  webview: vscode.Webview,
  extensionUri: vscode.Uri,
  homepage: boolean,
  language: Language
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
      homepage,
      language
    );
  } else if (canBeIframe) {
    return getIframeContent(
      documentation,
      webview,
      extensionUri,
      url,
      homepage,
      language
    );
  } else {
    return getFallbackContent(
      documentation,
      webview,
      extensionUri,
      url,
      homepage,
      language
    );
  }
};

export default getDocumentationContent;

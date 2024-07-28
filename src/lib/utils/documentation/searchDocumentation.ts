import { IDocumentation } from "../../interfaces/IDocumentation";
import checkIframeSupport from "../checkIframeSupport";
import findUrlDocumentation from "../findUrlDocumentation";
import getFaviconUrl from "../getFaviconUrl";
import searchPackage from "../searchPackage";
import formatUrl from "./formatUrl";

const searchDocumentation = async (
  searchValue: string,
  favoriteDocumentations: string[],
  hideDocumentations: string[]
): Promise<IDocumentation[]> => {
  try {
    const packages = await searchPackage(searchValue);
    const uniqueIds: string[] = [];

    const documentations = await Promise.all(
      packages.map(async (pkg) => {
        const info = pkg;
        if (info.name.startsWith("@types")) {
          return null;
        }

        const id = info.name.replaceAll("@", "");

        const homepageUrl = await formatUrl(info);

        if (!homepageUrl) {
          return null;
        }

        const homepageCanBeIFrame = await checkIframeSupport(homepageUrl);

        const documentationPageUrl = homepageUrl.includes(
          "radix-ui.com/primitives"
        )
          ? homepageUrl
          : await findUrlDocumentation(homepageUrl);

        if (!documentationPageUrl) {
          return null;
        }

        const documentationPageCanBeIFrame = await checkIframeSupport(
          documentationPageUrl
        );

        if (uniqueIds.includes(id)) {
          return null;
        }

        uniqueIds.push(id);

        const doc = {
          name: id.charAt(0).toUpperCase() + id.slice(1),
          id,
          version: info.version,
          description: info.description ?? "...",
          homepage: {
            url: homepageUrl,
            canBeIframe: homepageCanBeIFrame,
          },
          documentationPage: {
            url: documentationPageUrl,
            canBeIframe: documentationPageCanBeIFrame,
          },
          icon: (await getFaviconUrl(documentationPageUrl)) ?? "",
          isFavorite: favoriteDocumentations.includes(id),
          isHide: hideDocumentations.includes(id),
        } as IDocumentation;

        return doc;
      })
    );

    const validDocumentations = documentations
      .filter((documentation) => documentation !== null)
      .filter(
        (documentation) =>
          documentation?.homepage.url !== "" &&
          documentation?.documentationPage.url !== ""
      ) as IDocumentation[];

    return validDocumentations;
  } catch (error) {
    console.error("Error getting documentations:", error);
    return [];
  }
};

export default searchDocumentation;

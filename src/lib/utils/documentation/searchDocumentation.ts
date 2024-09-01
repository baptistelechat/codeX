import IDependency from "../../interfaces/IDependency";
import IDocumentation from "../../interfaces/IDocumentation";
import IPackageInformation from "../../interfaces/IPackageInformation";
import checkIframeSupport from "../checkIframeSupport";
import findUrlDocumentation from "../findUrlDocumentation";
import getFaviconUrl from "../getFaviconUrl";
import { DocumentationViewProvider } from "../provider/DocumentationViewProvider";
import searchPackage from "../searchPackage/searchPackage";
import formatUrl from "./formatUrl";

const searchDocumentation = async (
  provider: DocumentationViewProvider
): Promise<IDocumentation[]> => {
  try {
    const packages = await searchPackage(
      provider._searchValue,
      provider._registries
    );
    const uniqueIds: string[] = [];

    const documentations = await Promise.all(
      packages.map(async (pkg: IPackageInformation) => {
        const info = pkg;

        const registry = info.registry;

        if (info.name.startsWith("@types")) {
          return null;
        }

        const id = info.name.replaceAll("@", "");

        const version = info.version.startsWith("v")
          ? info.version.slice(1)
          : info.version;

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

        const description = () => {
          if (info.description) {
            return info.description;
          }

          if (homepageUrl.includes("radix-ui.com/primitives")) {
            return "Radix-ui component";
          }

          return "...";
        };

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
          version,
          description: description(),
          homepage: {
            url: homepageUrl,
            canBeIframe: homepageCanBeIFrame,
          },
          documentationPage: {
            url: documentationPageUrl,
            canBeIframe: documentationPageCanBeIFrame,
          },
          icon: (await getFaviconUrl(documentationPageUrl)) ?? "",
          isPinned: provider._pinnedDocumentations.some(
            (dependency: IDependency) => dependency.id === id
          ),
          isFavorite: provider._favoriteDocumentations.some(
            (dependency: IDependency) => dependency.id === id
          ),
          isHide: provider._hideDocumentations.some(
            (dependency: IDependency) => dependency.id === id
          ),
          registry,
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

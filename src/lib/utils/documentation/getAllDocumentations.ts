import { IDocumentation } from "../../interfaces/IDocumentation";
import IPackageJson from "../../interfaces/IPackageJson";
import checkIframeSupport from "../checkIframeSupport";
import findUrlDocumentation from "../findUrlDocumentation";
import getFaviconUrl from "../getFaviconUrl";
import getPackageInfo from "../getPackageInfo";
import formatUrl from "./formatUrl";

const getAllDocumentations = async (
  packageJson: IPackageJson,
  favoriteDocumentations: string[],
  hideDocumentations: string[]
) => {
  const dependencies = [
    ...Object.keys(packageJson.dependencies || {}),
    ...Object.keys(packageJson.devDependencies || {}),
  ];

  const uniqueIds: string[] = [];

  const documentations = await Promise.all(
    dependencies.map(async (dependency) => {
      const info = await getPackageInfo(dependency);
      if (info) {
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

        return {
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
      }
      return null;
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
};

export default getAllDocumentations;

import { fetch } from "undici";
import { IDocumentation } from "../../interfaces/IDocumentation";
import IPackageInformation from "../../interfaces/IPackageInformation";
import IPackageJson from "../../interfaces/IPackageJson";
import findUrlDocumentation from "../findUrlDocumentation";
import getFaviconUrl from "../getFaviconUrl";
import getPackageInfo from "../getPackageInfo";

const formatUrl = async (info: IPackageInformation) => {
  const url = info.homepage || (info.repository && info.repository.url) || "";

  if (url.includes("radix-ui.com/primitives")) {
    const componentName = info.name.split("/")[1].split("react-")[1];
    const componentUrl = `${url}/docs/components/${componentName}`;

    const response = await fetch(componentUrl);
    if (!response.ok) {
      const utilityUrl = `${url}/docs/utilities/${componentName}`;
      const response = await fetch(utilityUrl);
      if (!response.ok) {
        return null;
      }
      return utilityUrl;
    }

    return componentUrl;
  }

  return url;
};

const checkIframeSupport = async (url: string) => {
  try {
    const response = await fetch(url, {
      method: "HEAD",
    });

    const xFrameOptions = response.headers.get("X-Frame-Options");

    if (xFrameOptions) {
      // console.log(`X-Frame-Options: ${xFrameOptions}`);
      return false;
    }

    return true;
  } catch (error) {
    // console.error("Error fetching the URL:", error);
    return false;
  }
};

const getAllDocumentations = async (
  packageJson: IPackageJson,
  favoriteDocumentations: string[],
  hideDocumentations: string[]
) => {
  const dependencies = [
    ...Object.keys(packageJson.dependencies || {}),
    ...Object.keys(packageJson.devDependencies || {}),
  ];

  const uniqueUrls: string[] = [];
  const uniqueIds: string[] = [];

  const documentations = await Promise.all(
    dependencies.map(async (dependency) => {
      const info = await getPackageInfo(dependency);
      if (info) {
        if (info.name.startsWith("@types")) {
          return null;
        }

        const url = await formatUrl(info);
        const id = info.name.replaceAll("@", "");

        if (uniqueIds.includes(id) || !url) {
          return null;
        }

        const canBeIFrame = await checkIframeSupport(url);

        uniqueUrls.push(url);

        const documentationUrl = await findUrlDocumentation(url);
        uniqueIds.push(id);

        return {
          name: id.charAt(0).toUpperCase() + id.slice(1),
          id,
          version: info.version,
          description: info.description ?? "...",
          url,
          documentationUrl,
          canBeIFrame,
          icon: getFaviconUrl(documentationUrl) ?? "",
          isFavorite: favoriteDocumentations.includes(id),
          isHide: hideDocumentations.includes(id),
        } as IDocumentation;
      }
      return null;
    })
  );

  const validDocumentations = documentations
    .filter((doc) => doc !== null)
    .filter((doc) => doc?.url !== "") as IDocumentation[];

  const sortedDocumentations = validDocumentations.sort((a, b) =>
    a && b ? a.id.localeCompare(b.id) : 0
  );

  return sortedDocumentations;
};

export default getAllDocumentations;

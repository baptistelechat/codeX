import { IDocumentation } from "../../interfaces/IDocumentation";
import IPackageJson from "../../interfaces/IPackageJson";
import getFaviconUrl from "../getFaviconUrl";
import getPackageInfo from "../getPackageInfo";

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
  const documentations = await Promise.all(
    dependencies.map(async (dependency) => {
      const info = await getPackageInfo(dependency);
      if (info) {
        if (info.name.startsWith("@types")) {
          return null;
        }

        const url =
          info.homepage || (info.repository && info.repository.url) || "";
        if (uniqueUrls.includes(url)) {
          return null;
        }
        uniqueUrls.push(url);

        const documentationName = info.name.includes("/")
          ? info.name.split("/")[0].replaceAll("@", "")
          : info.name;

        return {
          name:
            documentationName.charAt(0).toUpperCase() +
            documentationName.slice(1),
          id: documentationName,
          version: info.version,
          description: info.description ?? "...",
          url,
          icon: getFaviconUrl(url) ?? "",
          isFavorite: favoriteDocumentations.includes(documentationName),
          isHide: hideDocumentations.includes(documentationName),
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

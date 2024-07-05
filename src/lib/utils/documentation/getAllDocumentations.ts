import { IDocumentation } from "../../interfaces/IDocumentation";
import IPackageJson from "../../interfaces/IPackageJson";
import getFaviconUrl from "../getFaviconUrl";
import getPackageInfo from "../getPackageInfo";

const getAllDocumentations = async (packageJson: IPackageJson) => {
  const dependencies = [
    ...Object.keys(packageJson.dependencies || {}),
    ...Object.keys(packageJson.devDependencies || {}),
  ];

  const uniqueUrls: string[] = [];
  const documentations = await Promise.all(
    dependencies.map(async (dependency) => {
      const info = await getPackageInfo(dependency);
      if (info) {
        const url =
          info.homepage || (info.repository && info.repository.url) || "";
        if (uniqueUrls.includes(url)) {
          return null;
        }
        uniqueUrls.push(url);
        return {
          name: info.name.charAt(0).toUpperCase() + info.name.slice(1),
          id: info.name,
          version: info.version,
          description: info.description ?? "...",
          url,
          icon: getFaviconUrl(url) ?? "",
        } as IDocumentation;
      }
      return null;
    })
  );

  const validDocumentations = documentations
    .filter((doc) => doc !== null)
    .filter(
      (doc) => !doc?.id.startsWith("@types") && doc?.url !== ""
    ) as IDocumentation[];

  const sortedDocumentations = validDocumentations.sort((a, b) =>
    a && b ? a.name.localeCompare(b.name) : 0
  );

  return sortedDocumentations;
};

export default getAllDocumentations;

import { fetch } from "undici";
import IPackageInformation from "../../interfaces/IPackageInformation";
import IPackageSearchResponse from "../../interfaces/IPackageSearch";
import getPackageInfo from "../getPackageInfo";
import getRegistriesFromQuery from "./getRegistriesFromQuery";
import replaceKeywordsInQuery from "./replaceKeywordsInQuery";

const searchPackage = async (
  query: string,
  registries: ("npm" | "packagist")[]
): Promise<IPackageInformation[]> => {
  const searchedDependencies = [] as IPackageInformation[];
  const requestedRegistries = getRegistriesFromQuery(query);
  const usedRegistries =
    requestedRegistries.length > 0 ? requestedRegistries : registries;

  for (const registry of usedRegistries) {
    try {
      const cleanQuery = replaceKeywordsInQuery(query, usedRegistries);
      let url: string;

      if (registry === "npm") {
        url = `https://registry.npmjs.org/-/v1/search?text=${cleanQuery}&popularity=1.0`;
      } else if (registry === "packagist") {
        url = `https://packagist.org/search.json?q=${cleanQuery}`;
      } else {
        throw new Error(`Unknown registry: ${registry}`);
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `Failed to search packages for query: ${query} on ${registry}`
        );
      }

      if (registry === "npm") {
        const data = (await response.json()) as IPackageSearchResponse;
        const npmPackages = data.objects.map(
          (obj) =>
            ({
              ...obj.package,
              registry: "npm",
            } as IPackageInformation)
        );
        searchedDependencies.push(...npmPackages);
      } else if (registry === "packagist") {
        const data = (await response.json()) as any;
        const packagistPackages = await Promise.all(
          data.results.map(async (pkg: any) => {
            const packageInfo = await getPackageInfo({
              id: pkg.name,
              registry: "packagist",
            });

            return packageInfo
              ? { ...packageInfo, registry: "packagist" }
              : null;
          })
        );

        searchedDependencies.push(
          ...packagistPackages.filter((pkg) => pkg !== null)
        );
      }
    } catch (error) {
      console.error(
        `Failed to search packages for query ${query} on ${registry}:`,
        error
      );
    }
  }

  return searchedDependencies;
};

export default searchPackage;

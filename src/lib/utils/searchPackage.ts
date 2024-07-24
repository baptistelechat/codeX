import { fetch } from "undici";
import IPackageInformation from "../interfaces/IPackageInformation";
import { IPackageSearchResponse } from "../interfaces/IPackageSearch";

const searchPackage = async (query: string): Promise<IPackageInformation[]> => {
  try {
    const response = await fetch(
      `https://registry.npmjs.org/-/v1/search?text=${query}&popularity=1.0`
    );
    if (!response.ok) {
      throw new Error(`Failed to search npm packages for query: ${query}`);
    }
    const data = (await response.json()) as IPackageSearchResponse;
    return data.objects.map((obj) => obj.package as IPackageInformation);
  } catch (error) {
    console.error(`Failed to search npm packages for query ${query}:`, error);
    return [];
  }
};

export default searchPackage;

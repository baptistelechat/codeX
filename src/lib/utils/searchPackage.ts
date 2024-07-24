import { fetch } from "undici";
import IPackageInformation from "../interfaces/IPackageInformation";
import { IPackageSearchResponse } from "../interfaces/IPackageSearch";

const searchPackage = async (query: string) => {
  const response = await fetch(
    `https://registry.npmjs.org/-/v1/search?text=${query}&popularity=1.0`
  );
  if (!response.ok) {
    throw new Error(`Failed to search npm packages for query: ${query}`);
  }
  const data = (await response.json()) as IPackageSearchResponse;
  return data.objects.map((obj: any) => obj.package as IPackageInformation);
};

export default searchPackage;

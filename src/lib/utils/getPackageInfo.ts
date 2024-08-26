import { fetch } from "undici";
import IPackageInformation from "../interfaces/IPackageInformation";

const getPackageInfo = async (
  packageName: string
): Promise<IPackageInformation | null> => {
  try {
    const response = await fetch(
      `https://registry.npmjs.org/${packageName}/latest`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch package info for ${packageName}`);
    }
    const data = (await response.json()) as IPackageInformation | null;
    return data;
  } catch (error) {
    console.error(`Failed to fetch package info for ${packageName}:`, error);
    try {
      const response = await fetch(
        `https://registry.npmjs.org/@${packageName}/latest`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch package info for @${packageName}`);
      }
      const data = (await response.json()) as IPackageInformation | null;
      return data;
    } catch (error) {
      console.error(`Failed to fetch package info for ${packageName}:`, error);
      return null;
    }
  }
};

export default getPackageInfo;

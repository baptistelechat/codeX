import { fetch } from "undici";
import IPackageInformation from "../interfaces/IPackageInformation";

const getPackageInfo = async (
  packageName: string,
  registry: "npm" | "packagist"
): Promise<IPackageInformation | null> => {
  const getUrl = (
    packageName: string,
    registry: "npm" | "packagist"
  ): string => {
    if (registry === "npm") {
      return `https://registry.npmjs.org/${packageName}/latest`;
    } else {
      return `https://repo.packagist.org/p2/${packageName}.json`;
    }
  };

  try {
    let url = getUrl(packageName, registry);
    let response = await fetch(url);

    if (!response.ok) {
      url = getUrl(`@${packageName}`, registry);
      response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch package info for ${packageName} from ${registry} registry`
        );
      }
    }

    if (registry === "npm") {
      const data = (await response.json()) as IPackageInformation | null;
      return data;
    } else if (registry === "packagist") {
      const res = (await response.json()) as any;
      const packageData = res.packages[packageName];

      if (packageData && packageData.length > 0) {
        const data = packageData[0] as IPackageInformation;
        return data;
      } else {
        console.warn(`No package data found for ${packageName} on Packagist`);
        return null;
      }
    }

    return null;
  } catch (error) {
    console.error(
      `Failed to fetch package info for ${packageName} from ${registry} registry:`,
      error
    );
    return null;
  }
};

export default getPackageInfo;

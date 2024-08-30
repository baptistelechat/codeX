import { fetch } from "undici";
import IDependency from "../interfaces/IDependency";
import IPackageInformation from "../interfaces/IPackageInformation";

const getPackageInfo = async (
  dependency: IDependency
): Promise<IPackageInformation | null> => {
  const getUrl = (dependency: IDependency): string => {
    if (dependency.registry === "npm") {
      return `https://registry.npmjs.org/${dependency.id}/latest`;
    } else {
      return `https://repo.packagist.org/p2/${dependency.id}.json`;
    }
  };

  try {
    let url = getUrl(dependency);
    let response = await fetch(url);

    if (!response.ok) {
      url = getUrl({
        id: `@${dependency.id}`,
        registry: dependency.registry,
      });
      response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch package info for ${dependency.id} from ${dependency.registry} registry`
        );
      }
    }

    if (dependency.registry === "npm") {
      const data = (await response.json()) as IPackageInformation | null;
      return data;
    } else if (dependency.registry === "packagist") {
      const res = (await response.json()) as any;
      const packageData = res.packages[dependency.id];

      if (packageData && packageData.length > 0) {
        const data = packageData[0] as IPackageInformation;
        return data;
      } else {
        console.warn(`No package data found for ${dependency.id} on Packagist`);
        return null;
      }
    }

    return null;
  } catch (error) {
    console.error(
      `Failed to fetch package info for ${dependency.id} from ${dependency.registry} registry:`,
      error
    );
    return null;
  }
};

export default getPackageInfo;

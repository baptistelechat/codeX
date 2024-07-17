import { fetch } from "undici";
import IPackageInformation from "../../interfaces/IPackageInformation";

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

export default formatUrl;

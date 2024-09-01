import registryKeywords from "../../constants/registryKeywords";

const getRegistriesFromQuery = (query: string): ("npm" | "packagist")[] => {
  const registries: ("npm" | "packagist")[] = [];

  for (const [registry, keywords] of Object.entries(registryKeywords)) {
    if (keywords.some((keyword) => query.includes(keyword))) {
      registries.push(registry as "npm" | "packagist");
    }
  }

  return registries;
};

export default getRegistriesFromQuery;

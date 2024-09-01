import registryKeywords from "../../constants/registryKeywords";

const getRegistriesFromQuery = (query: string): ("npm" | "packagist")[] => {
  const registriesSet = new Set<"npm" | "packagist">();

  for (const [registry, keywords] of Object.entries(registryKeywords)) {
    if (keywords.some((keyword) => query.includes(keyword))) {
      registriesSet.add(registry as "npm" | "packagist");
    }
  }

  return Array.from(registriesSet);
};

export default getRegistriesFromQuery;

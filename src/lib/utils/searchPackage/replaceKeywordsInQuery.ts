import registryKeywords from "../../constants/registryKeywords";

const replaceKeywordsInQuery = (
  query: string,
  registries: ("npm" | "packagist")[]
): string => {
  let modifiedQuery = query;

  for (const registry of registries) {
    const keywords = registryKeywords[registry]
      .slice()
      .sort((a, b) => b.length - a.length);

    for (const keyword of keywords) {
      modifiedQuery = modifiedQuery.split(keyword).join("");
    }
  }

  return modifiedQuery.trim();
};

export default replaceKeywordsInQuery;

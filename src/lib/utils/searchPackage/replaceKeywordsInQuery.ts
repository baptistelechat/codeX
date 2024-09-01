import registryKeywords from "../../constants/registryKeywords";

const replaceKeywordsInQuery = (
  query: string,
  registry: "npm" | "packagist"
) => {
  const keywords = registryKeywords[registry]
    .slice()
    .sort((a, b) => b.length - a.length);
  let modifiedQuery = query;

  for (const keyword of keywords) {
    modifiedQuery = modifiedQuery.replace(keyword, "");
  }

  return modifiedQuery.trim();
};

export default replaceKeywordsInQuery;

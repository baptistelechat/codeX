import IDocumentation from "../../../lib/interfaces/IDocumentation";
import navigationButton from "./navigationButton";
import registryButton from "./registryButton";

const searchInput = (
  searchValue: string,
  searchMode: boolean,
  documentations: IDocumentation[],
  searchDocumentations: IDocumentation[],
  hideRegistries: ("npm" | "packagist")[]
) => {
  const subtitle = searchMode
    ? searchDocumentations.length + " documentation(s) found"
    : documentations.length + " documentation(s) loaded";

  const npm = searchMode
    ? searchDocumentations.filter(
        (documentation) => documentation.registry === "npm"
      ).length
    : documentations.filter((documentation) => documentation.registry === "npm")
        .length;

  const packagist = searchMode
    ? searchDocumentations.filter(
        (documentation) => documentation.registry === "packagist"
      ).length
    : documentations.filter(
        (documentation) => documentation.registry === "packagist"
      ).length;

  return `<div class="flex w-full gap-2">
    ${navigationButton(searchMode, searchDocumentations.length)}
      <input id="search-package-input" type="text" placeholder="Search documentations..." class="w-full appearance-none rounded-md p-4 leading-tight ring-1 ring-inset focus:outline-none focus:ring-sky-500" value="${searchValue}" />
    <div id="search-package-button" class="flex items-center justify-center gap-2 rounded bg-sky-500 px-3 py-2 text-slate-50 hover:cursor-pointer hover:bg-sky-400">
      <div class="codicon codicon-search" aria-label="search"></div>
    </div>
  </div>
  <div id="subtitle" class="flex items-center gap-4">
    <p class="italic">${subtitle}</p>
    <div class="flex gap-3">
      ${registryButton(hideRegistries, "npm", npm)}
      ${registryButton(hideRegistries, "packagist", packagist)}
    </div>
  </div>`;
};

export default searchInput;

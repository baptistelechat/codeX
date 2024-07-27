import { IDocumentation } from "../../../lib/interfaces/IDocumentation";
import createActionItems from "./createActionItems";

const createDocumentationItem = (
  documentation: IDocumentation,
  favoriteDocumentations: string[],
  hideDocumentations: string[]
) => {
  const { id, icon, name, description, version, isHide } = documentation;
  const actionItems = createActionItems(
    favoriteDocumentations,
    hideDocumentations,
    id
  );

  return `
    <div id="${id}" class="${
    isHide ? "blur-sm grayscale" : ""
  } item cursor-pointer flex-col rounded py-2 pl-4 transition-all duration-200 ease-in-out" data-url="${
    documentation.documentationPage.url
  }">
      <div class="flex items-center gap-4">
        ${
          icon.includes("github")
            ? '<div class="codicon codicon-github-inverted" aria-label="github-inverted" style="font-size:32px"></div>'
            : `<img src="${icon}" alt="${name} icon" class="size-10" />`
        }
        <div class="flex w-full flex-col gap-1 overflow-hidden">
          <h2 class="text-xl font-semibold">${name}</h2>
          <p class="truncate text-slate-400">${description}</p>
          <div class="flex justify-between">
            <p class="font-semibold italic text-slate-400">v${version}</p>
            <div class="mr-2 flex gap-1.5">${actionItems}</div>
          </div>
        </div>
      </div>
    </div>
  `;
};

export default createDocumentationItem;

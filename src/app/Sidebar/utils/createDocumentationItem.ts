import { IDocumentation } from "../../../lib/interfaces/IDocumentation";
import createActionItems from "./createActionItems";
import escapeHTML from "./escapeHTML";

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

  const formatIcon = (icon: string) => {
    if (icon === "error") {
      return '<div class="codicon codicon-book" aria-label="book" style="font-size:32px"></div>';
    }

    if (icon.includes("github")) {
      return '<div class="codicon codicon-github-inverted" aria-label="github-inverted" style="font-size:32px"></div>';
    }

    return `<img src="${icon}" alt="${name} icon" class="size-10" />`;
  };

  const formatDescription = (description: string) => {
    if (description.includes("<")) {
      return "...";
    }
    return escapeHTML(description);
  };

  return `
    <div id="${escapeHTML(id)}" class="${
    isHide ? "blur-sm grayscale" : ""
  } item cursor-pointer flex-col rounded py-2 pl-4 transition-all duration-200 ease-in-out" data-url="${
    documentation.documentationPage.url
  }">
      <div class="flex items-center gap-4">
        ${formatIcon(icon)}
        <div class="flex w-full flex-col gap-1 overflow-hidden">
          <h2 class="text-xl font-semibold">${escapeHTML(name)}</h2>
          <p class="truncate text-slate-400">${formatDescription(
            description
          )}</p>
          <div class="flex justify-between">
            <p class="font-semibold italic text-slate-400">v${escapeHTML(
              version
            )}</p>
            <div class="mr-2 flex gap-1.5">${actionItems}</div>
          </div>
        </div>
      </div>
    </div>
  `;
};

export default createDocumentationItem;

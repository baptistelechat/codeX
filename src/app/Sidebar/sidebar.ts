import { IDocumentation } from "../../lib/interfaces/IDocumentation";
import removeBorder from "./utils/removeBorder";
import resetHover from "./utils/resetHover";
import sortDocumentations from "./utils/sortDocumentations";
import updateBorder from "./utils/updateBorder";
import updateHover from "./utils/updateHover";

// @ts-ignore
const vscode = acquireVsCodeApi();

let documentations: IDocumentation[] = [];
let openDocumentations: string[] = [];
let currentDocumentation: string = "";
let favoriteDocumentations: string[] = [];
let hideDocumentations: string[] = [];
let searchMode: boolean = false;

document.addEventListener("DOMContentLoaded", () => {
  const reloadButton = document.getElementById("reload");
  reloadButton?.addEventListener("click", () =>
    vscode.postMessage({ type: "reload" })
  );
});

const loadDocumentations = (newDocumentations: IDocumentation[]) => {
  favoriteDocumentations = newDocumentations
    .filter((doc) => doc.isFavorite)
    .map((doc) => doc.id);
  hideDocumentations = newDocumentations
    .filter((doc) => doc.isHide)
    .map((doc) => doc.id);
  documentations = sortDocumentations(
    newDocumentations,
    favoriteDocumentations,
    hideDocumentations,
    searchMode
  );

  const container = document.getElementById("documentation-list");

  if (!container) {
    return console.error("Documentation container not found!");
  }

  document
    .getElementById("no-documentation-found")
    ?.style.setProperty("display", "none");

  container.innerHTML = `
  <div class="relative flex flex-col h-screen">
    <div class="absolute left-0 right-0 top-0 z-10 flex gap-2 px-4 py-2">
      <input id="search-package-input" type="text" placeholder="Search documentations..." class="w-full appearance-none rounded-md p-4 leading-tight ring-1 ring-inset focus:outline-none focus:ring-sky-500" />
      <div id="search-package-button" class="flex items-center justify-center gap-2 rounded bg-sky-500  px-3 py-2 text-slate-50 hover:cursor-pointer hover:bg-sky-400">
        <div class="codicon codicon-search" aria-label="search"></div>
      </div>
    </div>

    <div class="space-y-2 flex-1 mt-16 overflow-y-auto p-4">
      ${documentations.map(createDocumentationItem).join("")}
    </div>
  </div>`;

  setupEventListeners();
};

const createDocumentationItem = (documentation: IDocumentation) => {
  const { id, icon, name, description, version, isHide } = documentation;
  const actionItems = createActionItems(id);

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

const createActionItems = (documentationId: string) => {
  const actions = [
    { codicon: "home", description: "Open homepage" },
    { codicon: "preview", description: "Open in browser" },
    {
      codicon: favoriteDocumentations.includes(documentationId)
        ? "star-full"
        : "star-empty",
      description: favoriteDocumentations.includes(documentationId)
        ? "Remove favorite"
        : "Add to favorites",
    },
    {
      codicon: hideDocumentations.includes(documentationId)
        ? "eye"
        : "eye-closed",
      description: hideDocumentations.includes(documentationId)
        ? "Unhide"
        : "Hide",
    },
  ];

  return actions
    .map(
      (action) => `
    <div id="${
      action.codicon
    }" class="action-item flex items-center justify-center rounded p-1 hover:bg-[--vscode-toolbar-hoverBackground]">
      <div class="codicon codicon-${action.codicon} ${
        action.codicon === "star-full" ? "text-yellow-400" : ""
      }" aria-label="${action.codicon}"></div>
      <div class="tooltip tooltip-${action.codicon}">${action.description}</div>
    </div>
  `
    )
    .join("");
};

const setupEventListeners = () => {
  document.querySelectorAll(".item").forEach((item) => {
    const documentationId = item.id;
    updateBorder(
      documentationId,
      currentDocumentation,
      openDocumentations,
      favoriteDocumentations,
      hideDocumentations
    );

    item.addEventListener("click", () => handleItemClick(documentationId));
    item.addEventListener("mouseenter", () =>
      updateHover(documentationId, openDocumentations, hideDocumentations)
    );
    item.addEventListener("mouseleave", () =>
      resetHover(openDocumentations, hideDocumentations)
    );
  });

  document.querySelectorAll(".action-item").forEach((item) => {
    const iconName = item.id;
    const documentationId = item.closest(".item")?.id;
    if (documentationId) {
      item.addEventListener("click", (event) =>
        handleActionItemClick(event, iconName, documentationId)
      );
    }
  });

  const searchPackageInput = document.getElementById(
    "search-package-input"
  ) as HTMLInputElement;

  const searchPackageButton = document.getElementById(
    "search-package-button"
  ) as HTMLInputElement;

  if (searchPackageInput && searchPackageButton) {
    searchPackageInput.addEventListener("change", () => {
      const searchValue = searchPackageInput.value;
      vscode.postMessage({
        type: "searchDocumentation",
        searchValue,
      });
    });

    searchPackageButton.addEventListener("click", () => {
      const searchValue = searchPackageInput.value;
      vscode.postMessage({
        type: "searchDocumentation",
        searchValue,
      });
    });
  }
};

const handleItemClick = (documentationId: string) => {
  if (openDocumentations.includes(documentationId)) {
    vscode.postMessage({
      type: "focusDocumentation",
      documentationId,
      homepage: false,
    });
  } else {
    vscode.postMessage({
      type: "openDocumentation",
      documentationId,
      homepage: false,
    });
    openDocumentations.push(documentationId);
  }

  currentDocumentation = documentationId;
  updateBorder(
    documentationId,
    currentDocumentation,
    openDocumentations,
    favoriteDocumentations,
    hideDocumentations
  );
};

const handleActionItemClick = (
  event: Event,
  iconName: string,
  documentationId: string
) => {
  event.stopPropagation();

  const actions: Record<string, () => void> = {
    home: () => openHomepage(documentationId),
    preview: () =>
      vscode.postMessage({ type: "openExternalUri", documentationId }),
    "star-empty": () => toggleFavorite(documentationId),
    "star-full": () => toggleFavorite(documentationId),
    "eye-closed": () => toggleHide(documentationId),
    eye: () => toggleHide(documentationId),
  };

  const action = actions[iconName];
  if (action) {
    action();
  } else {
    vscode.postMessage({ type: "wip" });
  }
};

const openHomepage = (documentationId: string) => {
  if (openDocumentations.includes(documentationId)) {
    vscode.postMessage({
      type: "focusDocumentation",
      documentationId,
      homepage: true,
    });
  } else {
    vscode.postMessage({
      type: "openDocumentation",
      documentationId,
      homepage: true,
    });
    openDocumentations.push(documentationId);
  }

  currentDocumentation = documentationId;
  updateBorder(
    documentationId,
    currentDocumentation,
    openDocumentations,
    favoriteDocumentations,
    hideDocumentations
  );
};

const toggleFavorite = (documentationId: string) => {
  const isFavorite = favoriteDocumentations.includes(documentationId);
  const isHide = hideDocumentations.includes(documentationId);

  if (isHide) {
    toggleHide(documentationId);
  }

  favoriteDocumentations = isFavorite
    ? favoriteDocumentations.filter((id) => id !== documentationId)
    : [...favoriteDocumentations, documentationId];

  vscode.postMessage({ type: "toggleFavorite", documentationId });
  updateDocumentation(documentationId, {
    isFavorite: !isFavorite,
    isHide: false,
  });
};

const toggleHide = (documentationId: string) => {
  const isFavorite = favoriteDocumentations.includes(documentationId);
  const isHide = hideDocumentations.includes(documentationId);

  if (isFavorite) {
    toggleFavorite(documentationId);
  }

  hideDocumentations = isHide
    ? hideDocumentations.filter((id) => id !== documentationId)
    : [...hideDocumentations, documentationId];

  vscode.postMessage({ type: "toggleHide", documentationId });
  updateDocumentation(documentationId, { isHide: !isHide, isFavorite: false });
};

const updateDocumentation = (
  documentationId: string,
  updates: Partial<IDocumentation>
) => {
  const index = documentations.findIndex((doc) => doc.id === documentationId);
  if (index !== -1) {
    documentations[index] = { ...documentations[index], ...updates };
    documentations = sortDocumentations(
      documentations,
      favoriteDocumentations,
      hideDocumentations,
      searchMode
    );
    loadDocumentations(documentations);
    updateBorder(
      documentationId,
      currentDocumentation,
      openDocumentations,
      favoriteDocumentations,
      hideDocumentations
    );
  }
};

window.addEventListener("message", (event) => {
  const message = event.data;

  switch (message.type) {
    case "setDocumentations":
      const { documentations, searchMode: newSearchMode } = message;
      searchMode = newSearchMode;
      loadDocumentations(documentations);
      break;
    case "documentationFocused":
      currentDocumentation = message.documentationId;
      updateBorder(
        message.documentationId,
        currentDocumentation,
        openDocumentations,
        favoriteDocumentations,
        hideDocumentations
      );
      break;
    case "documentationClosed":
      openDocumentations = openDocumentations.filter(
        (id) => id !== message.documentationId
      );
      currentDocumentation =
        openDocumentations.length === 0 ? "" : currentDocumentation;
      removeBorder(message.documentationId, openDocumentations);
      break;
  }
});

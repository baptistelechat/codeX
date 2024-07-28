import { IDocumentation } from "../../lib/interfaces/IDocumentation";
import loader from "./components/loader";
import searchInput from "./components/searchInput";
import removeBorder from "./utils/border/removeBorder";
import resetHover from "./utils/border/resetHover";
import updateBorder from "./utils/border/updateBorder";
import createDocumentationItem from "./utils/createDocumentationItem";
import getRandomLottieFile from "./utils/getRandomLottieFile";
import sortDocumentations from "./utils/sortDocumentations";
import updateHover from "./utils/updateHover";

// @ts-ignore
const vscode = acquireVsCodeApi();

let documentations: IDocumentation[] = [];
let openDocumentations: string[] = [];
let currentDocumentation: string = "";
let favoriteDocumentations: string[] = [];
let hideDocumentations: string[] = [];
let searchValue: string = "";
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

  const container = document.getElementById("documentation-container");

  if (!container) {
    return console.error("Documentation container not found!");
  }

  document
    .getElementById("no-documentation-found")
    ?.style.setProperty("display", "none");

  container.innerHTML = `
  <div class="relative flex flex-col h-screen w-full">
    <div class="absolute left-0 right-0 top-0 z-10 flex flex-col gap-2 p-4 pb-0">
      ${searchInput(searchValue, documentations.length)}
    </div>
    ${loader()}  
    <div id="documentation-list" class="space-y-2 flex-1 mt-28 overflow-y-auto p-4 pt-0">
      ${documentations
        .map((documentation) =>
          createDocumentationItem(
            documentation,
            favoriteDocumentations,
            hideDocumentations
          )
        )
        .join("")}
    </div>
  </div>`;

  setupEventListeners();
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

  const documentationFoundLength = document.getElementById(
    "documentation-found-length"
  ) as HTMLInputElement;

  const loader = document.getElementById("loader");
  const lottieAnimations = document.querySelectorAll(".lottieAnimation");

  const documentationList = document.getElementById("documentation-list");

  if (
    searchPackageInput &&
    searchPackageButton &&
    documentationFoundLength &&
    loader &&
    documentationList &&
    lottieAnimations
  ) {
    searchPackageInput.addEventListener("change", () => {
      const searchValue = searchPackageInput.value;

      documentationFoundLength.style.setProperty("display", "none");
      documentationList.style.setProperty("display", "none");
      loader.style.setProperty("display", "flex");

      const activeLottieFileId =
        "lottie-animation-" + getRandomLottieFile().id.toString();
      lottieAnimations.forEach((lottieAnimation) => {
        if (lottieAnimation.id === activeLottieFileId) {
          lottieAnimation.classList.remove("hidden");
        } else {
          lottieAnimation.classList.add("hidden");
        }
      });

      vscode.postMessage({
        type: "searchDocumentation",
        searchValue,
      });
    });
    
    searchPackageButton.addEventListener("click", () => {
      const searchValue = searchPackageInput.value;
      
      documentationFoundLength.style.setProperty("display", "none");
      documentationList.style.setProperty("display", "none");
      loader.style.setProperty("display", "flex");
      
      const activeLottieFileId =
        "lottie-animation-" + getRandomLottieFile().id.toString();
      lottieAnimations.forEach((lottieAnimation) => {
        if (lottieAnimation.id === activeLottieFileId) {
          lottieAnimation.classList.remove("hidden");
        } else {
          lottieAnimation.classList.add("hidden");
        }
      });

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
      const {
        documentations,
        searchMode: newSearchMode,
        searchValue: newSearchValue,
      } = message;
      searchMode = newSearchMode;
      searchValue = newSearchValue;
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

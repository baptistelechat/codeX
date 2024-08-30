import IDependency from "../../lib/interfaces/IDependency";
import IDocumentation from "../../lib/interfaces/IDocumentation";
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
let searchDocumentations: IDocumentation[] = [];
let openDocumentations: string[] = [];
let currentDocumentation: string = "";
let pinnedDocumentations: IDependency[] = [];
let favoriteDocumentations: IDependency[] = [];
let hideDocumentations: IDependency[] = [];
let searchValue: string = "";
let searchMode: boolean = false;

document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const styles = getComputedStyle(root);
  const color = styles.getPropertyValue("--vscode-editor-foreground").trim();
  const loader = document.querySelector("l-zoomies");
  if (loader) {
    loader.setAttribute("color", color);
  }

  const reloadButton = document.getElementById("reload");
  reloadButton?.addEventListener("click", () =>
    vscode.postMessage({ type: "reload" })
  );
});

const loadDocumentations = (
  newDocumentations: IDocumentation[],
  newSearchDocumentations: IDocumentation[]
) => {
  if (pinnedDocumentations.length === 0) {
    pinnedDocumentations = [
      ...newDocumentations
        .filter((documentation) => documentation.isPinned)
        .map((documentation) => ({
          id: documentation.id,
          registry: documentation.registry,
        })),
      ...newSearchDocumentations
        .filter((documentation) => documentation.isPinned)
        .map((documentation) => ({
          id: documentation.id,
          registry: documentation.registry,
        })),
    ];
  }
  if (favoriteDocumentations.length === 0) {
    favoriteDocumentations = [
      ...newDocumentations
        .filter((documentation) => documentation.isFavorite)
        .map((documentation) => ({
          id: documentation.id,
          registry: documentation.registry,
        })),
      ...newSearchDocumentations
        .filter((documentation) => documentation.isFavorite)
        .map((documentation) => ({
          id: documentation.id,
          registry: documentation.registry,
        })),
    ];
  }
  if (hideDocumentations.length === 0) {
    hideDocumentations = [
      ...newDocumentations
        .filter((documentation) => documentation.isHide)
        .map((documentation) => ({
          id: documentation.id,
          registry: documentation.registry,
        })),
      ...newSearchDocumentations
        .filter((documentation) => documentation.isHide)
        .map((documentation) => ({
          id: documentation.id,
          registry: documentation.registry,
        })),
    ];
  }

  searchDocumentations = sortDocumentations(
    newSearchDocumentations,
    pinnedDocumentations,
    favoriteDocumentations,
    hideDocumentations,
    true
  );

  documentations = sortDocumentations(
    newDocumentations,
    pinnedDocumentations,
    favoriteDocumentations,
    hideDocumentations,
    false
  );

  const container = document.getElementById("documentation-container");

  if (!container) {
    return console.error("Documentation container not found!");
  }

  document
    .getElementById("no-documentation-found")
    ?.style.setProperty("display", "none");

  container.style.setProperty("display", "flex");

  container.innerHTML = `
  <div class="relative flex flex-col h-screen w-full">
    <div class="absolute left-0 right-0 top-0 z-10 flex flex-col gap-2 p-4 pb-0">
      ${searchInput(
        searchValue,
        searchMode,
        documentations.length,
        searchDocumentations.length
      )}
    </div>
    ${loader()}  
    <div id="documentation-list" class="space-y-2 flex-1 mt-28 overflow-y-auto p-4 pt-0">
      ${
        searchMode
          ? searchDocumentations
              .map((documentation) =>
                createDocumentationItem(
                  documentation,
                  pinnedDocumentations,
                  favoriteDocumentations,
                  hideDocumentations
                )
              )
              .join("")
          : documentations
              .map((documentation) =>
                createDocumentationItem(
                  documentation,
                  pinnedDocumentations,
                  favoriteDocumentations,
                  hideDocumentations
                )
              )
              .join("")
      }
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
      pinnedDocumentations,
      favoriteDocumentations
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
  ) as HTMLButtonElement;

  const navigationButton = document.getElementById(
    "navigation-button"
  ) as HTMLButtonElement;

  const documentationFoundLength = document.getElementById(
    "documentation-found-length"
  ) as HTMLInputElement;

  const loader = document.getElementById("loader");
  const lottieAnimations = document.querySelectorAll(".lottieAnimation");

  const documentationList = document.getElementById("documentation-list");

  if (
    searchPackageInput &&
    searchPackageButton &&
    navigationButton &&
    documentationFoundLength &&
    loader &&
    documentationList &&
    lottieAnimations
  ) {
    searchPackageInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
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
      }
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

    navigationButton.addEventListener("click", () => {
      searchMode = !searchMode;
      loadDocumentations(documentations, searchDocumentations);

      vscode.postMessage({
        type: "toggleSearchMode",
      });
    });
  }
};

const handleItemClick = (documentationId: string) => {
  if (openDocumentations.includes(documentationId)) {
    vscode.postMessage({
      type: "focusDocumentation",
      documentationId,
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
    pinnedDocumentations,
    favoriteDocumentations
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
    pinned: () => togglePinned(documentationId),
    "pinned-dirty": () => togglePinned(documentationId),
    "star-empty": () => toggleFavorite(documentationId),
    "star-full": () => toggleFavorite(documentationId),
    "eye-closed": () => toggleHide(documentationId),
    eye: () => toggleHide(documentationId),
    registry: () => "",
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
    pinnedDocumentations,
    favoriteDocumentations
  );
};

const togglePinned = (documentationId: string) => {
  const isPinned = pinnedDocumentations.some(
    (dependency: IDependency) => dependency.id === documentationId
  );
  const isHide = hideDocumentations.some(
    (dependency: IDependency) => dependency.id === documentationId
  );

  if (isHide) {
    toggleHide(documentationId);
  }

  const dependency = {
    id: documentationId,
    registry: documentations.some(
      (dependency: IDependency) => dependency.id === documentationId
    )
      ? documentations.filter(
          (documentation) => documentation.id === documentationId
        )[0].registry
      : searchDocumentations.filter(
          (documentation) => documentation.id === documentationId
        )[0].registry,
  };

  pinnedDocumentations = isPinned
    ? pinnedDocumentations.filter(
        (dependency: IDependency) => dependency.id !== documentationId
      )
    : [...pinnedDocumentations, dependency];

  vscode.postMessage({ type: "togglePinned", dependency });
  updateDocumentation(documentationId, {
    isPinned: !isPinned,
    isHide: false,
  });
};

const toggleFavorite = (documentationId: string) => {
  const isFavorite = favoriteDocumentations.some(
    (dependency: IDependency) => dependency.id === documentationId
  );
  const isHide = hideDocumentations.some(
    (dependency: IDependency) => dependency.id === documentationId
  );

  if (isHide) {
    toggleHide(documentationId);
  }

  const dependency = {
    id: documentationId,
    registry: documentations.some(
      (dependency: IDependency) => dependency.id === documentationId
    )
      ? documentations.filter(
          (documentation) => documentation.id === documentationId
        )[0].registry
      : searchDocumentations.filter(
          (documentation) => documentation.id === documentationId
        )[0].registry,
  };

  favoriteDocumentations = isFavorite
    ? favoriteDocumentations.filter(
        (dependency: IDependency) => dependency.id !== documentationId
      )
    : [...favoriteDocumentations, dependency];

  vscode.postMessage({ type: "toggleFavorite", dependency });
  updateDocumentation(documentationId, {
    isFavorite: !isFavorite,
    isHide: false,
  });
};

const toggleHide = (documentationId: string) => {
  const isFavorite = favoriteDocumentations.some(
    (dependency: IDependency) => dependency.id === documentationId
  );
  const isHide = hideDocumentations.some(
    (dependency: IDependency) => dependency.id === documentationId
  );

  if (isFavorite) {
    toggleFavorite(documentationId);
  }

  const dependency = {
    id: documentationId,
    registry: documentations.some(
      (dependency: IDependency) => dependency.id === documentationId
    )
      ? documentations.filter(
          (documentation) => documentation.id === documentationId
        )[0].registry
      : searchDocumentations.filter(
          (documentation) => documentation.id === documentationId
        )[0].registry,
  };

  hideDocumentations = isHide
    ? hideDocumentations.filter(
        (dependency: IDependency) => dependency.id !== documentationId
      )
    : [...hideDocumentations, dependency];

  vscode.postMessage({ type: "toggleHide", dependency });
  updateDocumentation(documentationId, { isHide: !isHide, isFavorite: false });
};

const updateDocumentation = (
  documentationId: string,
  updates: Partial<IDocumentation>
) => {
  if (searchMode) {
    const index = searchDocumentations.findIndex(
      (doc) => doc.id === documentationId
    );
    if (index !== -1) {
      searchDocumentations[index] = {
        ...searchDocumentations[index],
        ...updates,
      };
      searchDocumentations = sortDocumentations(
        searchDocumentations,
        pinnedDocumentations,
        favoriteDocumentations,
        hideDocumentations,
        searchMode
      );
      loadDocumentations(documentations, searchDocumentations);
      updateBorder(
        documentationId,
        currentDocumentation,
        openDocumentations,
        pinnedDocumentations,
        favoriteDocumentations
      );
    }
  } else {
    const index = documentations.findIndex((doc) => doc.id === documentationId);
    if (index !== -1) {
      documentations[index] = { ...documentations[index], ...updates };
      documentations = sortDocumentations(
        documentations,
        pinnedDocumentations,
        favoriteDocumentations,
        hideDocumentations,
        searchMode
      );
      loadDocumentations(documentations, searchDocumentations);
      updateBorder(
        documentationId,
        currentDocumentation,
        openDocumentations,
        pinnedDocumentations,
        favoriteDocumentations
      );
    }
  }
};

window.addEventListener("message", (event) => {
  const message = event.data;

  switch (message.type) {
    case "reloadExtension":
      document
        .getElementById("documentation-container")
        ?.style.setProperty("display", "none");

      document
        .getElementById("no-documentation-found")
        ?.style.setProperty("display", "flex");
      break;
    case "setDocumentations":
      const {
        documentations: newDocumentations,
        searchDocumentations: newSearchDocumentations,
        openDocumentations: newOpenDocumentations,
        currentDocumentation: newCurrentDocumentations,
        searchMode: newSearchMode,
        searchValue: newSearchValue,
        reset,
      } = message;
      openDocumentations = newOpenDocumentations;
      currentDocumentation = newCurrentDocumentations;
      searchMode = newSearchMode;
      searchValue = newSearchValue;
      if (reset) {
        pinnedDocumentations = [];
        favoriteDocumentations = [];
        hideDocumentations = [];
      }
      loadDocumentations(newDocumentations, newSearchDocumentations);
      break;
    case "documentationFocused":
      currentDocumentation = message.documentationId;
      updateBorder(
        message.documentationId,
        currentDocumentation,
        openDocumentations,
        pinnedDocumentations,
        favoriteDocumentations
      );
      break;
    case "documentationClosed":
      openDocumentations = openDocumentations.filter(
        (id) => id !== message.documentationId
      );

      if (openDocumentations.length === 0) {
        currentDocumentation = "";
      }
      removeBorder(message.documentationId, openDocumentations);
      break;
  }
});

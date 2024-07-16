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

document.addEventListener("DOMContentLoaded", () => {
  const reloadButton = document.getElementById("reload");
  if (reloadButton) {
    reloadButton.addEventListener("click", () => {
      vscode.postMessage({
        type: "reload",
      });
    });
  }
});

const loadDocumentations = (newDocumentations: IDocumentation[]) => {
  favoriteDocumentations = newDocumentations
    .filter((documentation: IDocumentation) => documentation.isFavorite)
    .map((documentation: IDocumentation) => documentation.id);

  hideDocumentations = newDocumentations
    .filter((documentation: IDocumentation) => documentation.isHide)
    .map((documentation: IDocumentation) => documentation.id);

  const sortedDocumentations = sortDocumentations(
    newDocumentations,
    favoriteDocumentations,
    hideDocumentations
  );

  documentations = sortedDocumentations;

  const container = document.getElementById("documentation-list");
  if (!container) {
    console.error("Documentation container not found!");
    return;
  }

  const noDocumentationFoundElement = document.getElementById(
    "no-documentation-found"
  );

  if (noDocumentationFoundElement) {
    noDocumentationFoundElement.style.display = "none";
  }

  const actionItems = (documentationId: string) => {
    const isFavorite = favoriteDocumentations.includes(documentationId);
    const isHide = hideDocumentations.includes(documentationId);

    return [
      {
        codicon: "home",
        description: "Open in browser",
      },
      {
        codicon: "preview",
        description: "Open in browser",
      },
      {
        codicon: isFavorite ? "star-full" : "star-empty",
        description: isFavorite ? "Remove favorite" : "Add to favorites",
      },
      {
        codicon: isHide ? "eye" : "eye-closed",
        description: isHide ? "Unhide" : "Hide",
      },
    ]
      .map(
        (actionItem) =>
          `<div id="${
            actionItem.codicon
          }" class="action-item flex items-center justify-center rounded p-1 hover:bg-[--vscode-toolbar-hoverBackground]">
                <div
                  class="codicon codicon-${actionItem.codicon} ${
            actionItem.codicon === "star-full" ? "text-yellow-400" : ""
          }"
                  aria-label="${actionItem.codicon}"
                ></div>
                <div class="tooltip tooltip-${actionItem.codicon}">${
            actionItem.description
          }</div>
              </div>`
      )
      .join("");
  };

  container.innerHTML = documentations
    .map(
      (documentation: IDocumentation) =>
        `<div
            id="${documentation.id}"
            class="${
              documentation.isHide ? "blur-sm grayscale" : ""
            } item cursor-pointer flex-col rounded py-2 pl-4 transition-all duration-200 ease-in-out blur-none"
            data-url="${documentation.documentationPage.url}"
          >
            <div class="flex items-center gap-4">
              ${
                documentation.icon.includes("github")
                  ? '<div class="codicon codicon-github-inverted" aria-label="github-inverted" style="font-size:32px"></div>'
                  : `<img
                      src="${documentation.icon}"
                      alt="${documentation.name} icon"
                      class="size-10"
                    />`
              }
              <div class="flex w-full flex-col gap-1 overflow-hidden">
                <h2 class="text-xl font-semibold">${documentation.name}</h2>
                <p class="truncate text-slate-400">
                  ${documentation.description}
                </p>
                <div class="flex justify-between">
                  <p class="font-semibold italic text-slate-400">
                    v${documentation.version}
                  </p>
                  <div class="mr-2 flex gap-1.5">${actionItems(
                    documentation.id
                  )}</div>
                </div>
              </div>
            </div>
          </div>`
    )
    .join("");

  document.querySelectorAll(".item").forEach((item) => {
    const documentationId = item.id;
    updateBorder(
      documentationId,
      currentDocumentation,
      openDocumentations,
      favoriteDocumentations,
      hideDocumentations
    );

    item.addEventListener("click", (event) => {
      const documentationId = item.id;
      if (openDocumentations.includes(documentationId)) {
        vscode.postMessage({
          type: "focusDocumentation",
          documentationId,
        });
      } else {
        vscode.postMessage({
          type: "openDocumentation",
          documentationId,
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
    });

    item.addEventListener("mouseenter", () => {
      const documentationId = item.id;
      updateHover(documentationId, openDocumentations, hideDocumentations);
    });

    item.addEventListener("mouseleave", () => {
      resetHover(openDocumentations, hideDocumentations);
    });
  });

  document.querySelectorAll(".action-item").forEach((item) => {
    const iconName = item.id;
    const documentationId =
      item.parentElement?.parentElement?.parentElement?.parentElement
        ?.parentElement?.id;

    if (documentationId) {
      if (iconName.includes("preview")) {
        item.addEventListener("click", (event) => {
          event.stopPropagation();
          vscode.postMessage({
            type: "openExternalUri",
            documentationId,
          });
        });
      } else if (iconName.includes("star")) {
        item.addEventListener("click", (event) => {
          event.stopPropagation();
          const isFavorite = favoriteDocumentations.includes(documentationId);
          const isHide = hideDocumentations.includes(documentationId);

          if (isHide) {
            vscode.postMessage({
              type: "toggleHide",
              documentationId,
            });
          }

          if (isFavorite) {
            favoriteDocumentations = favoriteDocumentations.filter(
              (id) => id !== documentationId
            );

            item.innerHTML = `<div class="codicon codicon-star-empty" aria-label="star-empty"></div>
                      <div class="tooltip tooltip-star-empty">Add to favorites</div>`;
          } else {
            favoriteDocumentations.push(documentationId);
            item.innerHTML = `<div class="codicon codicon-star-full text-yellow-400" aria-label="star-full"></div>
                      <div class="tooltip tooltip-star-empty">Remove favorite</div>`;
          }

          vscode.postMessage({
            type: "toggleFavorite",
            documentationId,
          });

          const index = documentations.findIndex(
            (doc) => doc.id === documentationId
          );

          if (index !== -1) {
            const updatedDocumentation = { ...documentations[index] };

            updatedDocumentation.isFavorite = !updatedDocumentation.isFavorite;
            if (isHide) {
              updatedDocumentation.isHide = false;
            }

            const newDocumentations = [
              ...documentations.slice(0, index),
              updatedDocumentation,
              ...documentations.slice(index + 1),
            ];

            documentations = sortDocumentations(
              newDocumentations,
              favoriteDocumentations,
              hideDocumentations
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
        });
      } else if (iconName.includes("eye")) {
        item.addEventListener("click", (event) => {
          event.stopPropagation();
          const isFavorite = favoriteDocumentations.includes(documentationId);
          const isHide = hideDocumentations.includes(documentationId);

          if (isFavorite) {
            vscode.postMessage({
              type: "toggleFavorite",
              documentationId,
            });
          }

          if (isHide) {
            hideDocumentations = hideDocumentations.filter(
              (id) => id !== documentationId
            );
            item.innerHTML = `<div class="codicon codicon-eye-closed" aria-label="eye-closed"></div>
                    <div class="tooltip tooltip-star-empty">Hide</div>`;
          } else {
            hideDocumentations.push(documentationId);
            item.innerHTML = `<div class="codicon codicon-eye" aria-label="eye"></div>
                    <div class="tooltip tooltip-star-empty">Unhide</div>`;
          }

          vscode.postMessage({
            type: "toggleHide",
            documentationId,
          });

          const index = documentations.findIndex(
            (doc) => doc.id === documentationId
          );

          if (index !== -1) {
            const updatedDocumentation = { ...documentations[index] };

            updatedDocumentation.isHide = !updatedDocumentation.isHide;
            if (isFavorite) {
              updatedDocumentation.isFavorite = false;
            }
            const newDocumentations = [
              ...documentations.slice(0, index),
              updatedDocumentation,
              ...documentations.slice(index + 1),
            ];

            documentations = sortDocumentations(
              newDocumentations,
              favoriteDocumentations,
              hideDocumentations
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
        });
      }
    } else {
      item.addEventListener("click", (event) => {
        event.stopPropagation();
        vscode.postMessage({
          type: "wip",
        });
      });
    }
  });
};

window.addEventListener("message", (event) => {
  const message = event.data;

  switch (message.type) {
    case "setDocumentations":
      const { documentations: newDocumentations } = message;
      loadDocumentations(newDocumentations);
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
      if (openDocumentations.length === 0) {
        currentDocumentation = "";
      }
      removeBorder(message.documentationId, openDocumentations);
      break;

    default:
      break;
  }
});

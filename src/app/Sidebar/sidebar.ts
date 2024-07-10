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

window.addEventListener("message", (event) => {
  const message = event.data;

  switch (message.type) {
    case "setDocumentations":
      const { documentations: newDocumentations } = message;
      favoriteDocumentations = newDocumentations
        .filter((documentation: IDocumentation) => documentation.isFavorite)
        .map((documentation: IDocumentation) => documentation.id);

      const sortedDocumentations = sortDocumentations(
        newDocumentations,
        favoriteDocumentations
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

        return [
          {
            codicon: "preview",
            description: "Open in browser",
          },
          {
            codicon: isFavorite ? "star-full" : "star-empty",
            description: isFavorite ? "Remove favorite" : "Add to favorites",
          },
          {
            codicon: "eye-closed",
            description: "Hide",
          },
        ]
          .map(
            (actionItem) =>
              `<div id="${
                actionItem.codicon
              }" class="action-item flex items-center justify-center rounded p-1 hover:bg-[--vscode-toolbar-hoverBackground]">
                <div
                  class="codicon codicon-${actionItem.codicon} ${
                actionItem.codicon === "star-full" ? "text-yellow-500" : ""
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
            class="item cursor-pointer flex-col rounded py-2 pl-4 transition-all duration-200"
            data-url="${documentation.url}"
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
            favoriteDocumentations
          );
        });

        item.addEventListener("mouseenter", () => {
          const documentationId = item.id;
          updateHover(documentationId, openDocumentations);
        });

        item.addEventListener("mouseleave", () => {
          resetHover(openDocumentations);
        });
      });

      document.querySelectorAll(".action-item").forEach((item) => {
        const iconName = item.id;
        const documentationId =
          item.parentElement?.parentElement?.parentElement?.parentElement
            ?.parentElement?.id;
        if (documentationId && iconName.includes("star")) {
          item.addEventListener("click", (event) => {
            event.stopPropagation();

            if (favoriteDocumentations.includes(documentationId)) {
              favoriteDocumentations = favoriteDocumentations.filter(
                (id) => id !== documentationId
              );
              item.innerHTML = `<div class="codicon codicon-star-empty" aria-label="star-empty"></div>
                  <div class="tooltip tooltip-star-empty">Add to favorites</div>`;
            } else {
              favoriteDocumentations.push(documentationId);
              item.innerHTML = `<div class="codicon codicon-star-full text-yellow-500" aria-label="star-full"></div>
                  <div class="tooltip tooltip-star-empty">Remove favorite</div>`;
            }

            vscode.postMessage({
              type: "toggleFavorite",
              documentationId,
            });

            vscode.postMessage({
              type: "reload",
            });
          });
        } else {
          item.addEventListener("click", (event) => {
            event.stopPropagation();
            vscode.postMessage({
              type: "wip",
            });
          });
        }
      });
      break;

    case "documentationFocused":
      currentDocumentation = message.documentationId;
      updateBorder(
        message.documentationId,
        currentDocumentation,
        openDocumentations,
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

    default:
      break;
  }
});

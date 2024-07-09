import { IDocumentation } from "../../lib/interfaces/IDocumentation";

// @ts-ignore
const vscode = acquireVsCodeApi();

let openDocumentation: string[] = [];
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
      const { documentations } = message;
      favoriteDocumentations = documentations
        .filter((documentation: IDocumentation) => documentation.isFavorite)
        .map((documentation: IDocumentation) => documentation.id);

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
        item.addEventListener("click", (event) => {
          const documentationId = item.id;
          if (openDocumentation.includes(documentationId)) {
            vscode.postMessage({
              type: "focusDocumentation",
              documentationId,
            });
          } else {
            vscode.postMessage({
              type: "openDocumentation",
              documentationId,
            });
            openDocumentation.push(documentationId);
          }

          currentDocumentation = documentationId;
          updateBorder(documentationId);
        });

        item.addEventListener("mouseenter", () => {
          updateHover(item.id);
        });

        item.addEventListener("mouseleave", () => {
          resetHover();
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

            updateBorder(documentationId);
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
      updateBorder(message.documentationId);
      break;

    case "documentationClosed":
      openDocumentation = openDocumentation.filter(
        (id) => id !== message.documentationId
      );
      removeBorder(openDocumentation, message.documentationId);
      break;

    default:
      break;
  }
});

const updateBorder = (documentationId: string) => {
  document.querySelectorAll(".item").forEach((item) => {
    const isFavorite = favoriteDocumentations.includes(item.id);
    const isOpen = openDocumentation.includes(item.id);
    const isCurrentDocumentation = currentDocumentation === item.id;

    // Reset classes
    item.classList.remove(
      "brightness-50",
      "brightness-100",
      "border-l-8",
      "border-l-slate-700",
      "border-l-sky-500",
      "border-l-yellow-500",
      "border-l-yellow-800"
    );

    if (isCurrentDocumentation || (isOpen && item.id === documentationId)) {
      item.classList.add("brightness-100");
      item.classList.add("border-l-8");

      if (isFavorite) {
        item.classList.add(
          isCurrentDocumentation ? "border-l-yellow-500" : "border-l-yellow-800"
        );
      } else {
        item.classList.add(
          isCurrentDocumentation ? "border-l-sky-500" : "border-l-slate-700"
        );
      }
    } else if (isOpen) {
      item.classList.remove("brightness-50");
      item.classList.add("border-l-8");

      if (isFavorite) {
        item.classList.add("border-l-yellow-800");
      } else {
        item.classList.add("border-l-slate-700");
      }
    } else {
      item.classList.add("brightness-50");
    }
  });
};

const updateHover = (documentationId: string) => {
  document.querySelectorAll(".item").forEach((item) => {
    const isHovered = item.id === documentationId;
    const isOpen = openDocumentation.includes(item.id);
    item.classList.toggle("brightness-100", isHovered);
    item.classList.toggle("brightness-50", !isHovered && !isOpen);
  });
};

const resetHover = () => {
  const isAnyOpen = openDocumentation.length > 0;
  document.querySelectorAll(".item").forEach((item) => {
    const isOpen = openDocumentation.includes(item.id);
    item.classList.toggle("brightness-100", !isAnyOpen || isOpen);
    item.classList.toggle("brightness-50", isAnyOpen && !isOpen);
  });
};

const removeBorder = (openDocumentation: string[], documentationId: string) => {
  const closedItem = document.getElementById(documentationId);
  if (closedItem) {
    closedItem.classList.add("brightness-50");
    closedItem.classList.remove(
      "brightness-100",
      "border-l-8",
      "border-l-sky-500",
      "border-l-slate-700",
      "border-l-yellow-500",
      "border-l-yellow-800"
    );
  }

  if (openDocumentation.length === 0) {
    document.querySelectorAll(".item").forEach((item) => {
      item.classList.add("brightness-100");
      item.classList.remove("brightness-50");
    });
  }
};
const vscode = acquireVsCodeApi();
let openDocumentation = [];
let currentDocumentation = "";
let favoriteDocumentations = [];

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
        .filter((documentation) => documentation.isFavorite)
        .map((documentation) => documentation.id);

      const container = document.getElementById("documentation-list");
      if (!container) {
        console.error("Documentation container not found!");
        return;
      }

      document.getElementById("no-documentation-found").style.display = "none";

      const actionItems = (id) => {
        const isFavorite = favoriteDocumentations.includes(id);

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
          (documentation) =>
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
          resetHover(item.id);
        });
      });

      document.querySelectorAll(".action-item").forEach((item) => {
        const iconName = item.id;
        const documentationId =
          item.parentElement.parentElement.parentElement.parentElement
            .parentElement.id;
        if (iconName.includes("star")) {
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
      removeBorder(message.documentationId, openDocumentation);
      break;

    default:
      break;
  }
});

const updateBorder = (documentationId) => {
  document.querySelectorAll(".item").forEach((item) => {
    const isFavorite = favoriteDocumentations.includes(item.id);
    const isOpen = openDocumentation.includes(item.id);
    const isCurrentDocumentation = currentDocumentation === item.id;

    if (isOpen && item.id === documentationId) {
      // Brightness
      item.classList.remove("brightness-50");
      item.classList.add("brightness-100");
      // Border
      if (isFavorite) {
        item.classList.add("border-l-8");
        item.classList.remove("border-l-slate-700");
        item.classList.remove("border-l-sky-500");
        if (isCurrentDocumentation) {
          item.classList.add("border-l-yellow-500");
          item.classList.remove("border-l-yellow-800");
        } else {
          item.classList.remove("border-l-yellow-500");
          item.classList.add("border-l-yellow-800");
        }
      } else {
        item.classList.add("border-l-8");
        if (isCurrentDocumentation) {
          item.classList.remove("border-l-slate-700");
          item.classList.add("border-l-sky-500");
        } else {
          item.classList.add("border-l-slate-700");
          item.classList.remove("border-l-sky-500");
        }
        item.classList.remove("border-l-yellow-500");
        item.classList.remove("border-l-yellow-800");
      }
    } else if (isOpen) {
      // Brightness
      item.classList.remove("brightness-50");
      item.classList.remove("brightness-100");
      // Border
      if (isFavorite) {
        item.classList.add("border-l-8");
        item.classList.remove("border-l-slate-700");
        item.classList.remove("border-l-sky-500");
        item.classList.remove("border-l-yellow-500");
        item.classList.add("border-l-yellow-800");
      } else {
        item.classList.add("border-l-8");
        item.classList.add("border-l-slate-700");
        item.classList.remove("border-l-sky-500");
        item.classList.remove("border-l-yellow-500");
        item.classList.remove("border-l-yellow-800");
      }
    } else {
      // Brightness
      item.classList.add("brightness-50");
      item.classList.remove("brightness-100");
      // Border
      item.classList.remove("border-l-8");
      item.classList.remove("border-l-slate-700");
      item.classList.remove("border-l-sky-500");
      item.classList.remove("border-l-yellow-500");
      item.classList.remove("border-l-yellow-800");
    }
  });
};

const updateHover = (hoveredId) => {
  document.querySelectorAll(".item").forEach((item) => {
    if (item.id === hoveredId) {
      item.classList.add("brightness-100");
      item.classList.remove("brightness-50");
    } else if (!openDocumentation.includes(item.id)) {
      item.classList.add("brightness-50");
      item.classList.remove("brightness-100");
    }
  });
};

const resetHover = (hoveredId) => {
  if (openDocumentation.length === 0) {
    document.querySelectorAll(".item").forEach((item) => {
      item.classList.add("brightness-100");
      item.classList.remove("brightness-50");
    });
  } else {
    document.querySelectorAll(".item").forEach((item) => {
      if (!openDocumentation.includes(item.id)) {
        item.classList.add("brightness-50");
        item.classList.remove("brightness-100");
      }
    });
  }
};

const removeBorder = (closedId, updatedOpenDocumentation) => {
  const closedItem = document.getElementById(closedId);
  if (closedItem) {
    closedItem.classList.add("brightness-50");
    closedItem.classList.remove("brightness-100");
    closedItem.classList.remove("border-l-8");
    closedItem.classList.remove("border-l-sky-500");
    closedItem.classList.remove("border-l-slate-700");
    closedItem.classList.remove("border-l-yellow-500");
    closedItem.classList.remove("border-l-yellow-800");
  }

  if (updatedOpenDocumentation.length === 0) {
    document.querySelectorAll(".item").forEach((item) => {
      item.classList.add("brightness-100");
      item.classList.remove("brightness-50");
    });
  }
};

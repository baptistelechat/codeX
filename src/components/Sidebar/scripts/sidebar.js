const vscode = acquireVsCodeApi();
let openDocumentation = [];

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

      const container = document.getElementById("documentation-list");
      if (!container) {
        console.error("Documentation container not found!");
        return;
      }

      document.getElementById("no-documentation-found").style.display = "none";

      const actionItems = [
        {
          codicon: "preview",
          description: "Open in browser",
        },
        {
          codicon: "bookmark",
          description: "Bookmark",
        },
        {
          codicon: "eye-closed",
          description: "Hide",
        },
      ]
        .map((actionItem) => (
          `<div class="action-item flex items-center justify-center rounded p-1 hover:bg-[--vscode-toolbar-hoverBackground]">
            <div
              class="codicon codicon-${actionItem.codicon}"
              aria-label="${actionItem.codicon}"
            ></div>
            <div class="tooltip tooltip-${actionItem.codicon}">${actionItem.description}</div>
          </div>`
        ))
        .join("");

      container.innerHTML = documentations
        .map(
          (documentation) =>
            `<div
            id="${documentation.id}"
            class="item cursor-pointer flex-col rounded py-4 pl-4 transition-all duration-200"
            data-url="${documentation.url}"
          >
            <div class="flex items-center gap-4">
              <img
                src="${documentation.icon}"
                alt="${documentation.name} icon"
                class="size-10"
              />
              <div class="flex w-full flex-col gap-1 overflow-hidden">
                <h2 class="text-xl font-semibold">${documentation.name}</h2>
                <p class="truncate text-slate-400">
                  ${documentation.description}
                </p>
                <div class="flex justify-between">
                  <p class="font-semibold italic text-slate-400">
                    v${documentation.version}
                  </p>
                  <div class="mr-2 flex gap-1.5">${actionItems}</div>
                </div>
              </div>
            </div>
          </div>`
        )
        .join("");

      document.querySelectorAll(".item").forEach((item) => {
        item.addEventListener("click", (event) => {
          const id = item.getAttribute("id");
          if (openDocumentation.includes(id)) {
            vscode.postMessage({
              type: "focusDocumentation",
              documentationId: id,
            });
          } else {
            vscode.postMessage({
              type: "openDocumentation",
              documentationId: id,
            });
            openDocumentation.push(id);
          }

          updateBorder(id);
        });

        item.addEventListener("mouseenter", () => {
          updateHover(item.id);
        });

        item.addEventListener("mouseleave", () => {
          resetHover(item.id);
        });
      });

      document.querySelectorAll(".action-item").forEach((item) => {
        item.addEventListener("click", (event) => {
          event.stopPropagation();
          vscode.postMessage({
            type: "wip",
          });
        });
      });
      break;

    case "documentationFocused":
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

function updateBorder(focusedId) {
  document.querySelectorAll(".item").forEach((item) => {
    if (item.id === focusedId) {
      // Brightness
      item.classList.remove("brightness-50");
      item.classList.add("brightness-100");
      // Border
      item.classList.add("border-l-8");
      item.classList.add("border-l-sky-500");
      item.classList.remove("border-l-slate-700");
    } else if (openDocumentation.includes(item.id)) {
      // Brightness
      item.classList.remove("brightness-50");
      item.classList.remove("brightness-100");
      // Border
      item.classList.add("border-l-8");
      item.classList.remove("border-l-sky-500");
      item.classList.add("border-l-slate-700");
    } else {
      // Brightness
      item.classList.add("brightness-50");
      item.classList.remove("brightness-100");
      // Border
      item.classList.remove("border-l-8");
      item.classList.remove("border-l-sky-500");
      item.classList.remove("border-l-slate-700");
    }
  });
}

function updateHover(hoveredId) {
  document.querySelectorAll(".item").forEach((item) => {
    if (item.id === hoveredId) {
      item.classList.add("brightness-100");
      item.classList.remove("brightness-50");
    } else if (!openDocumentation.includes(item.id)) {
      item.classList.add("brightness-50");
      item.classList.remove("brightness-100");
    }
  });
}

function resetHover(hoveredId) {
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
}

function removeBorder(closedId, updatedOpenDocumentation) {
  const closedItem = document.getElementById(closedId);
  if (closedItem) {
    closedItem.classList.add("brightness-50");
    closedItem.classList.remove("brightness-100");
    closedItem.classList.remove("border-l-8");
    closedItem.classList.remove("border-l-sky-500");
    closedItem.classList.remove("border-l-slate-700");
  }

  if (updatedOpenDocumentation.length === 0) {
    document.querySelectorAll(".item").forEach((item) => {
      item.classList.add("brightness-100");
      item.classList.remove("brightness-50");
    });
  }
}

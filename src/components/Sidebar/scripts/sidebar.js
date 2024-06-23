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

      container.innerHTML = documentations
        .map(
          (doc) => `
            <div id="${
              doc.id
            }" class="item rounded cursor-pointer flex-col gap-4 p-4 transition-all duration-200" data-url="${
            doc.url
          }">
                <div class="flex items-center gap-2">
                    <img src="${doc.icon}" alt="${
            doc.name
          } icon" class="size-10" />
                    <div class="flex flex-col gap-2">
                        <h2 class="text-xl font-semibold">${doc.name}</h2>
                        <p class="text-slate-400">${doc.description ?? ""}</p>
                    </div>
                </div>
            </div>
            `
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

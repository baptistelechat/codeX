const vscode = acquireVsCodeApi();

window.addEventListener("message", (event) => {
  const message = event.data;

  switch (message.type) {
    case "setDocumentations":
      const documentations = message.documentations;

      const container = document.getElementById("documentation-list");
      if (!container) {
        console.error("Documentation container not found!");
        return;
      }

      document.querySelector("#no-documentation-found").style.display = "none";

      container.innerHTML = documentations
        .map(
          (doc) => `
        <div id="${doc.id}" class="item rounded cursor-pointer flex-col gap-4 p-4 brightness-50 transition-all duration-200 hover:brightness-100" data-url="${doc.url}">
          <div class="flex items-center gap-2">
            <img src="${doc.icon}" alt="${doc.name} icon" class="size-10" />
            <div class="flex flex-col gap-2">
              <h2 class="text-xl font-semibold">${doc.name}</h2>
              <p class="text-slate-400">${doc.description}</p>
            </div>
          </div>
        </div>
      `
        )
        .join("");

      document.querySelectorAll(".item").forEach((item) => {
        item.addEventListener("click", (event) => {
          document.querySelectorAll(".item").forEach((i) => {
            // Brightness
            i.classList.remove("brightness-100");
            i.classList.add("brightness-50");
            // Border
            i.classList.remove("border-l-8");
            i.classList.remove("border-l-sky-500");
          });
          // Brightness
          item.classList.remove("brightness-50");
          item.classList.add("brightness-100");
          // Border
          item.classList.add("border-l-8");
          item.classList.add("border-l-sky-500");

          const url = item.getAttribute("data-url");
          const id = item.getAttribute("id");

          vscode.postMessage({
            type: "openDocumentation",
            documentationId: id,
          });
        });
      });
      break;
  }
});

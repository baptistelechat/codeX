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

      container.innerHTML = documentations
        .map(
          (doc) => `
        <div class="p-4 border rounded">
          <img src="${doc.icon}" alt="${doc.name} icon" class="w-8 h-8">
          <h2 class="text-xl font-semibold">${doc.name}</h2>
          <p>${doc.description}</p>
          <p><a href="${
            doc.url
          }" target="_blank" class="text-blue-500">Documentation</a></p>
          <p><strong>Author:</strong> ${doc.author}</p>
          <p><strong>Tags:</strong> ${doc.tags.join(", ")}</p>
          <p><strong>Languages:</strong> ${doc.languages.join(", ")}</p>
          <p><strong>Difficulty:</strong> ${doc.difficulty}</p>
        </div>
      `
        )
        .join("");
      break;
  }
});

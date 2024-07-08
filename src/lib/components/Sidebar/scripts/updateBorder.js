const updateBorder = (
  favoriteDocumentations,
  openDocumentation,
  currentDocumentation,
  documentationId
) => {
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

export default updateBorder;

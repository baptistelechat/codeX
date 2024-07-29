const updateBorder = (
  documentationId: string,
  currentDocumentation: string,
  openDocumentations: string[],
  favoriteDocumentations: string[],
) => {
  document.querySelectorAll(".item").forEach((item) => {
    const isCurrentDocumentation = currentDocumentation === item.id;
    const isOpen = openDocumentations.includes(item.id);
    const isFavorite = favoriteDocumentations.includes(item.id);

    // Reset classes
    item.classList.remove(
      "brightness-50",
      "brightness-100",
      "border-l-8",
      "border-l-sky-400",
      "border-l-sky-900",
      "border-l-yellow-400",
      "border-l-yellow-900"
    );

    if (isCurrentDocumentation || (isOpen && item.id === documentationId)) {
      item.classList.add("brightness-100", "border-l-8");

      if (isFavorite) {
        item.classList.add(
          isCurrentDocumentation ? "border-l-yellow-400" : "border-l-yellow-900"
        );
      } else {
        item.classList.add(
          isCurrentDocumentation ? "border-l-sky-400" : "border-l-sky-900"
        );
      }
    } else if (isOpen) {
      item.classList.remove("brightness-50");
      item.classList.add("border-l-8");

      if (isFavorite) {
        item.classList.add("border-l-yellow-900");
      } else {
        item.classList.add("border-l-sky-900");
      }
    } else {
      item.classList.add("brightness-50");
    }
  });
};

export default updateBorder;

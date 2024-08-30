import IDependency from "../../../../lib/interfaces/IDependency";

const updateBorder = (
  documentationId: string,
  currentDocumentation: string,
  openDocumentations: string[],
  pinnedDocumentations: IDependency[],
  favoriteDocumentations: IDependency[]
) => {
  document.querySelectorAll(".item").forEach((item) => {
    const isCurrentDocumentation = currentDocumentation === item.id;
    const isOpen = openDocumentations.includes(item.id);
    const isPinned = pinnedDocumentations.some(
      (dependency: IDependency) => dependency.id === item.id
    );
    const isFavorite = favoriteDocumentations.some(
      (dependency: IDependency) => dependency.id === item.id
    );

    // Reset classes
    item.classList.remove(
      "brightness-50",
      "brightness-100",
      "border-l-8",
      "border-l-lime-400",
      "border-l-lime-900",
      "border-l-sky-400",
      "border-l-sky-900",
      "border-l-yellow-400",
      "border-l-yellow-900"
    );

    if (isCurrentDocumentation || (isOpen && item.id === documentationId)) {
      item.classList.add("brightness-100", "border-l-8");

      if (isPinned) {
        item.classList.add(
          isCurrentDocumentation ? "border-l-lime-400" : "border-l-lime-900"
        );
      } else if (isFavorite) {
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

      if (isPinned) {
        item.classList.add("border-l-lime-900");
      } else if (isFavorite) {
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

const updateHover = (
  documentationId: string,
  openDocumentations: string[],
  hideDocumentations: string[]
) => {
  document.querySelectorAll(".item").forEach((item) => {
    const isHovered = item.id === documentationId;
    const isOpen = openDocumentations.includes(item.id);
    const isHide = hideDocumentations.includes(item.id);

    if (isHovered) {
      item.classList.add("brightness-100");
      item.classList.remove("brightness-50");

      if (isHide) {
        item.classList.remove("blur-sm");
        item.classList.add("blur-none");
      }
    } else {
      item.classList.remove("brightness-100");
      item.classList.toggle("brightness-50", !isOpen);

      if (isHide) {
        item.classList.add("blur-sm");
        item.classList.remove("blur-none");
      }
    }
  });
};

export default updateHover;

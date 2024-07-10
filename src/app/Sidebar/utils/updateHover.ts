const updateHover = (documentationId: string, openDocumentations: string[]) => {
  document.querySelectorAll(".item").forEach((item) => {
    const isHovered = item.id === documentationId;
    const isOpen = openDocumentations.includes(item.id);
    item.classList.toggle("brightness-100", isHovered);
    item.classList.toggle("brightness-50", !isHovered && !isOpen);
  });
};

export default updateHover;

const updateHover = (openDocumentation: string[], documentationId: string) => {
  document.querySelectorAll(".item").forEach((item) => {
    const isHovered = item.id === documentationId;
    const isOpen = openDocumentation.includes(item.id);
    item.classList.toggle("brightness-100", isHovered);
    item.classList.toggle("brightness-50", !isHovered && !isOpen);
  });
};

export default updateHover;

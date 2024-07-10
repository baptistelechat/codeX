const resetHover = (openDocumentations: string[]) => {
  const isAnyOpen = openDocumentations.length > 0;
  document.querySelectorAll(".item").forEach((item) => {
    const isOpen = openDocumentations.includes(item.id);
    item.classList.toggle("brightness-100", !isAnyOpen || isOpen);
    item.classList.toggle("brightness-50", isAnyOpen && !isOpen);
  });
};

export default resetHover;

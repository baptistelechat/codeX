const resetHover = (
  openDocumentations: string[],
  hideDocumentations: string[]
) => {
  const isAnyOpen = openDocumentations.length > 0;
  document.querySelectorAll(".item").forEach((item) => {
    const isOpen = openDocumentations.includes(item.id);
    const isHide = hideDocumentations.includes(item.id);

    if (!isAnyOpen || isOpen) {
      item.classList.add("brightness-100");
      item.classList.remove("brightness-50");
    } else {
      item.classList.remove("brightness-100");
      item.classList.add("brightness-50");
    }

    if (isHide) {
      item.classList.add("blur-sm");
      item.classList.remove("blur-none");
    } else {
      item.classList.remove("blur-sm");
      item.classList.add("blur-none");
    }
  });
};

export default resetHover;

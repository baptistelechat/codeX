const resetHover = (openDocumentation: string[]) => {
  const isAnyOpen = openDocumentation.length > 0;
  document.querySelectorAll(".item").forEach((item) => {
    const isOpen = openDocumentation.includes(item.id);
    item.classList.toggle("brightness-100", !isAnyOpen || isOpen);
    item.classList.toggle("brightness-50", isAnyOpen && !isOpen);
  });
};

export default resetHover;

const removeBorder = (
  documentationId: string,
  openDocumentations: string[]
) => {
  const closedItem = document.getElementById(documentationId);
  if (closedItem) {
    closedItem.classList.add("brightness-50");
    closedItem.classList.remove(
      "brightness-100",
      "border-l-8",
      "border-l-sky-500",
      "border-l-slate-700",
      "border-l-yellow-500",
      "border-l-yellow-800"
    );
  }

  if (openDocumentations.length === 0) {
    document.querySelectorAll(".item").forEach((item) => {
      item.classList.add("brightness-100");
      item.classList.remove("brightness-50");
    });
  }
};

export default removeBorder;
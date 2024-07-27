const createActionItems = (
  favoriteDocumentations: string[],
  hideDocumentations: string[],
  documentationId: string
) => {
  const actions = [
    { codicon: "home", description: "Open homepage" },
    { codicon: "preview", description: "Open in browser" },
    {
      codicon: favoriteDocumentations.includes(documentationId)
        ? "star-full"
        : "star-empty",
      description: favoriteDocumentations.includes(documentationId)
        ? "Remove favorite"
        : "Add to favorites",
    },
    {
      codicon: hideDocumentations.includes(documentationId)
        ? "eye"
        : "eye-closed",
      description: hideDocumentations.includes(documentationId)
        ? "Unhide"
        : "Hide",
    },
  ];

  return actions
    .map(
      (action) => `
    <div id="${
      action.codicon
    }" class="action-item flex items-center justify-center rounded p-1 hover:bg-[--vscode-toolbar-hoverBackground]">
      <div class="codicon codicon-${action.codicon} ${
        action.codicon === "star-full" ? "text-yellow-400" : ""
      }" aria-label="${action.codicon}"></div>
      <div class="tooltip tooltip-${action.codicon}">${action.description}</div>
    </div>
  `
    )
    .join("");
};

export default createActionItems;

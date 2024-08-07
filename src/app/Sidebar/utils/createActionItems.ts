const createActionItems = (
  pinnedDocumentations: string[],
  favoriteDocumentations: string[],
  hideDocumentations: string[],
  documentationId: string
) => {
  const isSave = pinnedDocumentations.includes(documentationId);

  const actions = [
    { codicon: "home", description: "Open homepage" },
    { codicon: "preview", description: "Open in browser" },
    {
      codicon: isSave ? "pinned-dirty" : "pinned",
      description: isSave ? "Unpin for later" : "Pin for later",
    },
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

  const actionIconColor = (codicon: string) => {
    if (codicon === "star-full") {
      return "text-yellow-400";
    }

    if (codicon === "pinned-dirty") {
      return "text-lime-400";
    }

    return "";
  };

  return actions
    .map(
      (action) => `
    <div id="${
      action.codicon
    }" class="action-item flex items-center justify-center rounded p-1 hover:bg-[--vscode-toolbar-hoverBackground]">
      <div class="codicon codicon-${action.codicon} ${actionIconColor(
        action.codicon
      )}" aria-label="${action.codicon}"></div>
      <div class="tooltip tooltip-${action.codicon}">${action.description}</div>
    </div>
  `
    )
    .join("");
};

export default createActionItems;

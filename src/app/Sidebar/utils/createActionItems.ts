import IDependency from "../../../lib/interfaces/IDependency";

const createActionItems = (
  pinnedDocumentations: IDependency[],
  favoriteDocumentations: IDependency[],
  hideDocumentations: IDependency[],
  documentationId: string
) => {
    const isPinned = pinnedDocumentations.some(
      (dependency: IDependency) => dependency.id === documentationId
    );
    const isFavorite = favoriteDocumentations.some(
      (dependency: IDependency) => dependency.id === documentationId
    );
    const isHide = hideDocumentations.some(
      (dependency: IDependency) => dependency.id === documentationId
    );

  const actions = [
    { codicon: "home", description: "Open homepage" },
    { codicon: "preview", description: "Open in browser" },
    {
      codicon: isPinned ? "pinned-dirty" : "pinned",
      description: isPinned ? "Unpin for later" : "Pin for later",
    },
    {
      codicon: isFavorite
        ? "star-full"
        : "star-empty",
      description: isFavorite
        ? "Remove favorite"
        : "Add to favorites",
    },
    {
      codicon:isHide
        ? "eye"
        : "eye-closed",
      description: isHide
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

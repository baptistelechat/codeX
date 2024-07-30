const navigationButton = (
  searchMode: boolean,
  searchDocumentationLength: number
) => {
  return ` <div id="navigation-button" class="flex items-center justify-center gap-2 rounded px-3 py-2 text-slate-50 ${
    searchMode || searchDocumentationLength > 0
      ? "bg-sky-500 hover:bg-sky-400 hover:cursor-pointer"
      : "bg-slate-600 hover:bg-slate-600 hover:cursor-not-allowed"
  }">
      <div class="codicon ${
        searchMode ? "codicon-arrow-left" : "codicon-arrow-right"
      }"aria-label="${searchMode ? "arrow-right" : "arrow-left"}"></div>
    </div>`;
};

export default navigationButton;

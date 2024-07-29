const searchInput = (
  searchValue: string,
  searchMode: boolean,
  documentationFoundLength: number
) => `<div class="flex w-full gap-2">
    <div id="go-back-button" class="flex items-center justify-center gap-2 rounded px-3 py-2 text-slate-50 ${
      searchMode
        ? "bg-sky-500 hover:bg-sky-400 hover:cursor-pointer"
        : "bg-slate-600 hover:bg-slate-600 hover:cursor-not-allowed"
    }">
      <div class="codicon codicon-arrow-left" aria-label="arrow-left"></div>
    </div>
    <input id="search-package-input" type="text" placeholder="Search documentations..." class="w-full appearance-none rounded-md p-4 leading-tight ring-1 ring-inset focus:outline-none focus:ring-sky-500" value="${searchValue}" />
    <div id="search-package-button" class="flex items-center justify-center gap-2 rounded bg-sky-500 px-3 py-2 text-slate-50 hover:cursor-pointer hover:bg-sky-400">
      <div class="codicon codicon-search" aria-label="search"></div>
    </div>
  </div>
  <p id="documentation-found-length" class="italic text-slate-400">${documentationFoundLength} documentation(s) found</p>`;

export default searchInput;
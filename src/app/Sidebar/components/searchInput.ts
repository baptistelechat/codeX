const searchInput = (
  searchValue: string
) => `<input id="search-package-input" type="text" placeholder="Search documentations..." class="w-full appearance-none rounded-md p-4 leading-tight ring-1 ring-inset focus:outline-none focus:ring-sky-500" value="${searchValue}"/>
      <div id="search-package-button" class="flex items-center justify-center gap-2 rounded bg-sky-500  px-3 py-2 text-slate-50 hover:cursor-pointer hover:bg-sky-400">
        <div class="codicon codicon-search" aria-label="search"></div>
      </div>`;

export default searchInput;

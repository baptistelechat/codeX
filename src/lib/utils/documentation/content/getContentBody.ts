import IDocumentation from "../../../interfaces/IDocumentation";
import Language from "../../../types/Language";

const getContentBody = (
  documentation: IDocumentation,
  url: string,
  type: "github" | "iframe" | "fallback",
  homepage: boolean,
  language: Language
) => {
  const mainContent =
    type === "github"
      ? '<div id="readme-content" class="p-4">Loading...</div>'
      : type === "iframe"
      ? `<iframe width="100%" height="100%" src="${url}" frameborder="0" class="bg-white">
        <p>Can't load ${documentation.name}</p>
          </iframe>`
      : `<div class="flex h-screen w-screen flex-col items-center justify-center gap-4">
        <p class="m-0">Failed to load ${
          documentation.name
        } due to the website's security policy.</p>
        <p>You can open it in a browser instead.</p>
        <a id="openBrowser" class="flex w-fit items-center justify-center gap-2 rounded bg-sky-500 p-2 text-slate-50 hover:cursor-pointer hover:bg-sky-400 hover:text-slate-50 hover:no-underline" href="${
          homepage
            ? documentation.homepage.url
            : documentation.documentationPage.url
        }" target="_blank">
          <div class="codicon codicon-browser" aria-label="browser"></div>
          Open in Browser
        </a>
      </div>`;

  return `
    <div class="flex flex-col h-screen">
      <div class="flex-grow overflow-y-auto">
        ${mainContent}
      </div>
      ${
        type === "github" || type === "iframe"
          ? `<div class="flex items-center justify-center gap-4 border-t border-t-sky-200 p-2">
        <p class="m-0">Failed to load ${documentation.name}? Try opening it in a browser.</p>
        <a
          id="openBrowser"
          class="flex w-fit items-center justify-center gap-2 rounded bg-sky-500 p-2 text-slate-50 hover:cursor-pointer hover:bg-sky-400 hover:text-slate-50 hover:no-underline"
          href="${url}"
          target="_blank"
        >
          <div class="codicon codicon-browser" aria-label="browser"></div>
          Open in Browser
        </a>
      </div>`
          : ""
      }
    </div>`;
};

export default getContentBody;

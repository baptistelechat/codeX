import L10n from "../l10n/l10n";

const html = document.documentElement;
const lang = html.lang;
// @ts-ignore
const l10n = new L10n(lang, l10nPath);

const checkIframeSupport = async (url: string) => {
  try {
    const response = await fetch(url, {
      method: "HEAD",
    });

    const xFrameOptions = response.headers.get("X-Frame-Options");

    if (xFrameOptions) {
      // console.log(`X-Frame-Options: ${xFrameOptions}`);
      return false;
    }

    return true;
  } catch (error) {
    // console.error("Error fetching the URL:", error);
    return false;
  }
};

// @ts-ignore
window.replaceBodyContent = async (href: string) => {
  if (href.includes("github.com")) {
    const url = href.split("https://github.com/");
    const ownerRepo = url[1].split("/");
    const owner = ownerRepo[0];
    const repo = ownerRepo[1].split("#")[0];

    getReadmeContent(owner, repo)
      .then((content) => {
        // @ts-ignore
        const htmlContent = marked.parse(content);
        const readmeContentDiv = document.getElementById("readme-content");
        if (readmeContentDiv) {
          readmeContentDiv.innerHTML = htmlContent;
        }
      })
      .catch((error) => {
        console.error("Error fetching README:", error);
        const readmeContentDiv = document.getElementById("readme-content");
        if (readmeContentDiv) {
          readmeContentDiv.innerHTML = l10n.translate(
            "Error fetching README. Please check the console for details."
          );
        }
      });
  } else {
    document.documentElement.style.padding = "0";
    document.documentElement.style.height = "100vh";
    document.body.style.height = "100vh";
    document.body.style.padding = "0";

    const canBeIframe = await checkIframeSupport(href);

    if (canBeIframe) {
      document.body.innerHTML = `
        <div class="flex flex-col h-screen">
          <div class="flex-1 overflow-auto">
            <iframe width="100%" height="100%" src="${href}" frameborder="0" class="bg-white">
              <p>${l10n.translate("Can't load")} ${href}</p>
            </iframe>
          </div>
          <div class="flex items-center justify-center gap-4 border-t border-t-sky-200 p-2">
            <p class="m-0">${l10n.translate(
              "Failed to load ? Try opening this page in a browser."
            )}</p>
            <a
              id="openBrowser"
              class="flex w-fit items-center justify-center gap-2 rounded bg-sky-500 p-2 text-slate-50 hover:cursor-pointer hover:bg-sky-400 hover:text-slate-50  hover:no-underline"
              href="${href}"
              target="_blank"
            >
              <div class="codicon codicon-browser" aria-label="browser"></div>${l10n.translate(
                "Open in Browser"
              )}</a
            >
          </div>
        </div>`;
    } else {
      document.body.innerHTML = `
        <div class="flex h-screen w-screen flex-col items-center justify-center gap-4">
          <p class="m-0 text-center">${l10n.translate(
            "Failed to load page due to the website's security policy."
          )}</p>
          <p class="m-0 text-center">${l10n.translate(
            "You can open it in a browser instead."
          )}</p>
          <a id="openBrowser" class="flex w-fit items-center justify-center gap-2 rounded bg-sky-500 p-2 text-slate-50 hover:cursor-pointer hover:bg-sky-400 hover:text-slate-50 hover:no-underline" href="${href}" target="_blank">
            <div class="codicon codicon-browser" aria-label="browser"></div>
            ${l10n.translate("Open in Browser")}
          </a>
        </div>`;
    }
  }
};

// @ts-ignore
const getReadmeContent = async (owner, repo) => {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/readme`,
    {
      headers: {
        Accept: "application/vnd.github.v3.raw",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const content = await response.text();
  return content;
};

// @ts-ignore
const renderer = new marked.Renderer();

// @ts-ignore
renderer.link = (link) => {
  const href = link.href;
  const text = link.text.split("](")[0].replace("![", "");

  return `<a href="#" onclick="replaceBodyContent('${href}')">${text}</a>`;
};

// @ts-ignore
marked.use({ renderer });

window.onload = () => {
  // @ts-ignore
  getReadmeContent(owner, repo)
    .then((content) => {
      // @ts-ignore
      const htmlContent = marked.parse(content);
      const readmeContentDiv = document.getElementById("readme-content");
      if (readmeContentDiv) {
        readmeContentDiv.innerHTML = htmlContent;
      }
    })
    .catch((error) => {
      console.error("Error fetching README:", error);
      const readmeContentDiv = document.getElementById("readme-content");
      if (readmeContentDiv) {
        readmeContentDiv.innerHTML = l10n.translate(
          "Error fetching README. Please check the console for details."
        );
      }
    });
};

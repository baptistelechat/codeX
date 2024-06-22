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

const replaceBodyContent = (href) => {
  if (href.includes("github.com")) {
    const url = href.split("https://github.com/");
    const ownerRepo = url[1].split("/");
    const owner = ownerRepo[0];
    const repo = ownerRepo[1].split("#")[0];

    getReadmeContent(owner, repo)
      .then((content) => {
        const htmlContent = marked.parse(content);
        document.getElementById("readme-content").innerHTML = htmlContent;
      })
      .catch((error) => {
        console.error("Error fetching README:", error);
        document.getElementById("readme-content").innerText =
          "Error fetching README. Please check the console for details.";
      });
  } else {
    document.documentElement.style.padding = 0;
    document.documentElement.style.height = "100vh";
    document.body.style.height = "100vh";
    document.body.style.padding = 0;
    document.body.innerHTML = `<div class="flex flex-col h-screen">
          <div class="flex-1 overflow-auto">
            <iframe width="100%" height="100%" src="${href}" frameborder="0" class="bg-white">
              <p>Can't load ${href}</p>
            </iframe>
          </div>
          <div class="flex items-center justify-center gap-4 border-t border-t-sky-200 p-2">
            <p class="m-0">Failed to load ? Try opening this page in a browser.</p>
            <a
              id="openBrowser"
              class="flex w-fit items-center justify-center gap-2 rounded bg-sky-500 p-2 text-slate-50 hover:cursor-pointer hover:bg-sky-400 hover:text-slate-50  hover:no-underline"
              href="${href}"
              target="_blank"
            >
              <div class="codicon codicon-browser" aria-label="browser"></div>
              Open in Browser</a
            >
          </div>
        </div>`;
  }
};

const renderer = new marked.Renderer();
renderer.link = (href, title, text) => {
  return `<a href="#" onclick="replaceBodyContent('${href}')">${text}</a>`;
};

marked.use({ renderer });

window.onload = () => {
  getReadmeContent(owner, repo)
    .then((content) => {
      const htmlContent = marked.parse(content);
      document.getElementById("readme-content").innerHTML = htmlContent;
    })
    .catch((error) => {
      console.error("Error fetching README:", error);
      document.getElementById("readme-content").innerText =
        "❌ Error fetching README. Please check the console for details.";
    });
};

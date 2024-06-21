async function getReadmeContent(owner, repo) {
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
}

function replaceBodyContent(href) {
  if (href.includes("github.com")) {
    const url = href.split("https://github.com/");
    const ownerRepo = url[1].split("/");
    const owner = ownerRepo[0];
    const repo = ownerRepo[1].split("#")[0];

    getReadmeContent(owner, repo)
      .then((content) => {
        const htmlContent = marked.parse(content);
        document.body.innerHTML = htmlContent;
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
    document.body.innerHTML = `<iframe width='100%' height='100%' src=${href} frameborder='0'><p>Can't load ${href}</p></iframe>`;
  }
}

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
        "Error fetching README. Please check the console for details.";
    });
};

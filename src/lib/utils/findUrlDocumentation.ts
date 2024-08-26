import { JSDOM } from "jsdom";
import { fetch } from "undici";

const findUrlDocumentation = async (baseUrl: string): Promise<string> => {
  // Ensure the base URL ends with a '/'
  const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : baseUrl + "/";

  // List of common paths for documentation
  const commonPaths = [
    "docs",
    "documentation",
    "doc",
    "guide",
    "guides",
    "help",
    "support",
    "learn",
    "wiki",
    "quick-start",
    "quickstart",
    "start",
    "started",
    "getting-started",
    "get-started",
    "introduction",
    "tutorial",
    "api",
    "reference",
    "resources",
  ];

  // Function to test if a URL is accessible
  const isUrlAccessible = async (url: string): Promise<boolean> => {
    try {
      const response = await fetch(url, { method: "HEAD" });
      return response.ok;
    } catch {
      return false;
    }
  };

  if (!baseUrl.includes("github")) {
    // Test each common path
    for (const path of commonPaths) {
      const testUrl = `${normalizedBaseUrl}${path}`;
      if (await isUrlAccessible(testUrl)) {
        return testUrl;
      }
    }
  }

  // If no common path worked, try parsing the homepage
  try {
    const response = await fetch(normalizedBaseUrl);
    const html = await response.text();

    const dom = new JSDOM(html);
    const document = dom.window.document;
    const links = document.getElementsByTagName("a");

    for (const link of links) {
      const href = link.getAttribute("href");
      const text = link.textContent?.toLowerCase() || "";

      if (href && commonPaths.some((keyword) => text.includes(keyword))) {
        // Build the full URL if it's a relative path
        const fullUrl = href.startsWith("http")
          ? href
          : new URL(href, normalizedBaseUrl).toString();

        if (!fullUrl.includes("github")) {
          if (await isUrlAccessible(fullUrl)) {
            return fullUrl;
          }
        }
      }
    }
  } catch (error) {
    console.error("Error while parsing the homepage:", error);
  }

  // If no documentation URL was found
  return baseUrl;
};

export default findUrlDocumentation;

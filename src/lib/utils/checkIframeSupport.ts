import { fetch } from "undici";

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

export default checkIframeSupport;

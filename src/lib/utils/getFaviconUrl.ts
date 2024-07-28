const getFaviconUrl = async (homepage: string): Promise<string> => {
  const url = `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${homepage}&size=64`;

  try {
    const response = await fetch(url);

    if (response.ok) {
      return url;
    } else {
      return "error";
    }
  } catch (error) {
    return "error";
  }
};

export default getFaviconUrl;

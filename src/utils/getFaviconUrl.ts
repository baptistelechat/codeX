const getFaviconUrl = (homepage: string): string => {
  return `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${homepage}&size=64`;
};

export default getFaviconUrl;

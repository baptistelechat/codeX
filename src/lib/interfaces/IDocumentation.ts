interface Url {
  url: string;
  canBeIframe: boolean;
}

interface IDocumentation {
  name: string;
  id: string;
  version: string;
  description: string;
  homepage: Url;
  documentationPage: Url;
  icon: string;
  isPinned: boolean;
  isFavorite: boolean;
  isHide: boolean;
  registry: "npm" | "packagist";
}

export default IDocumentation;

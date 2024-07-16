interface Url {
  url: string;
  canBeIframe: boolean;
}

export interface IDocumentation {
  name: string;
  id: string;
  version: string;
  description: string;
  homepage: Url;
  documentationPage: Url;
  icon: string;
  isFavorite: boolean;
  isHide: boolean;
}

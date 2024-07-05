interface IPackageJson {
  name?: string;
  displayName?: string;
  description?: string;
  version?: string;
  license?: string;
  repository?: {
    type: string;
    url: string;
  };
  author?: {
    name?: string;
    email?: string;
    url?: string;
  };
  publisher?: string;
  engines?: {
    vscode?: string;
    [engineName: string]: string | undefined;
  };
  categories?: string[];
  keywords?: string[];
  activationEvents?: string[];
  icon?: string;
  galleryBanner?: {
    color: string;
    theme: string;
  };
  main?: string;
  contributes?: {
    viewsContainers?: {
      [location: string]: {
        id: string;
        title: string;
        icon?: string;
      }[];
    };
    views?: {
      [location: string]: {
        type: string;
        id: string;
        name: string;
      }[];
    };
    commands?: {
      command: string;
      category?: string;
      title: string;
      icon?: string;
    }[];
    menus?: {
      [menu: string]: {
        command: string;
        group?: string;
        when?: string;
      }[];
    };
  };
  scripts?: {
    [key: string]: string;
  };
  dependencies?: {
    [packageName: string]: string;
  };
  devDependencies?: {
    [packageName: string]: string;
  };
  packageManager?: string;
  [key: string]: any; // For custom properties that are not standard
}

export default IPackageJson;

import IPackageInformation from "./IPackageInformation";

export interface IPackageSearchObject {
  package: IPackageInformation;
  flags: {
    insecure: number;
    unstable?: boolean;
  };
  score: {
    final: number;
    detail: {
      quality: number;
      popularity: number;
      maintenance: number;
    };
  };
  searchScore: number;
}

export interface IPackageSearchResponse {
  objects: IPackageSearchObject[];
  total: number;
  time: Date;
}

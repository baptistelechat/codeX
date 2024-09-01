import IPackageInformation from "./IPackageInformation";

interface IPackageSearchObject {
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

interface IPackageSearchResponse {
  objects: IPackageSearchObject[];
  total: number;
  time: Date;
}

export default IPackageSearchResponse;
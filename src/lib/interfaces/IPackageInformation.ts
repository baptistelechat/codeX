interface PackageMaintainer {
  name: string;
  email: string;
}

interface PackageSignature {
  keyid: string;
  sig: string;
}

interface PackageDist {
  integrity: string;
  shasum: string;
  tarball: string;
  fileCount: number;
  unpackedSize: number;
  signatures: PackageSignature[];
  attestations?: {
    url: string;
    provenance: {
      predicateType: string;
    };
  };
}

interface PackageRepository {
  type: string;
  url: string;
}

interface PackageBug {
  url: string;
}

interface PackageScripts {
  [key: string]: string;
}

interface PackageEngines {
  node: string;
}

interface PackageNpmUser {
  name: string;
  email: string;
}

interface PackagePeerDependenciesMeta {
  [key: string]: {
    optional: boolean;
  };
}

interface NpmOperationalInternal {
  tmp: string;
  host: string;
}

interface IPackageInformation {
  name: string;
  version: string;
  description?: string;
  exports?: {
    types: string;
    import: string;
    require: string;
  };
  types?: string;
  scripts?: PackageScripts;
  keywords?: string[];
  author?: PackageMaintainer;
  license: string;
  homepage: string;
  repository: PackageRepository;
  bugs: PackageBug;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  dependencies?: Record<string, string>;
  packageManager?: string;
  _id: string;
  gitHead: string;
  _nodeVersion: string;
  _npmVersion: string;
  dist: PackageDist;
  _npmUser: PackageNpmUser;
  directories?: Record<string, string>;
  maintainers?: PackageMaintainer[];
  engines?: PackageEngines;
  _hasShrinkwrap: boolean;
  peerDependenciesMeta?: PackagePeerDependenciesMeta;
  _npmOperationalInternal?: NpmOperationalInternal;
  [key: string]: any; // For custom properties that are not standard
}

export default IPackageInformation;

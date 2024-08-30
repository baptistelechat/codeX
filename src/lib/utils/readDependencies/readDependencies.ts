import { DocumentationViewProvider } from "../provider/DocumentationViewProvider";
import readDependenciesFile from "./readDependenciesFile";


const readDependencies = (provider: DocumentationViewProvider) => {
  provider._dependencies = [];
  readDependenciesFile(provider, "npm");
  readDependenciesFile(provider, "packagist");
};

export default readDependencies;

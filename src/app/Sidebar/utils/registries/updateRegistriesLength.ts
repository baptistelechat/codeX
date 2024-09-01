import IDocumentation from "../../../../lib/interfaces/IDocumentation";
import { npmLength, packagistLength } from "./dependenciesLength";

const updateRegistriesLength = (
  searchMode: boolean,
  documentations: IDocumentation[],
  searchDocumentations: IDocumentation[]
) => {
  const npmDependencies = document.getElementById("npm-dependencies");
  const packagistDependencies = document.getElementById(
    "packagist-dependencies"
  );

  if (npmDependencies) {
    npmDependencies.innerHTML = String(
      npmLength(searchMode, documentations, searchDocumentations)
    );
  }

  if (packagistDependencies) {
    packagistDependencies.innerHTML = String(
      packagistLength(searchMode, documentations, searchDocumentations)
    );
  }
};
export default updateRegistriesLength;

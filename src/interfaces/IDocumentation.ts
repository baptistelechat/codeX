import { DocumentationLanguage } from "../types/DocumentationLanguage";
import { DocumentationTag } from "../types/DocumentationTag";

export interface IDocumentation {
  name: string;
  id: string;
  description: string;
  url: string;
  icon: string;
  author?: string;
  tags?: DocumentationTag[];
  languages?: DocumentationLanguage[];
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
  dependencies: string[];
}

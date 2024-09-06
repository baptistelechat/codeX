import fr from "./fr";

type Translations = { [key: string]: string };

class L10n {
  private translations: Translations = {};

  constructor(language: string) {
    switch (language) {
      case "fr":
        this.translations = fr;
        break;
      default:
        this.translations = {};
    }
  }

  public translate(key: string): string {
    return this.translations[key] || key;
  }
}

export default L10n;

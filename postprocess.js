const fs = require("fs");
const path = require("path");

const directory = "./out/app"; // Directory where JavaScript files are located

// Fonction récursive pour parcourir tous les fichiers dans un répertoire et ses sous-répertoires
function processFiles(dirPath) {
  fs.readdir(dirPath, (err, files) => {
    if (err) {
      console.error(`Error reading directory ${dirPath}:`, err);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(dirPath, file);

      // Vérifier si c'est un fichier
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error(`Error stating file ${filePath}:`, err);
          return;
        }

        if (stats.isFile() && filePath.endsWith(".js")) {
          // C'est un fichier .js, lire le contenu
          fs.readFile(filePath, "utf8", (err, data) => {
            if (err) {
              console.error(`Error reading file ${filePath}:`, err);
              return;
            }

            // Remplacer les imports sans extension par ceux avec l'extension ".js"
            const updatedContent = data.replace(
              /from ['"](.+)['"]/g,
              (match, importPath) => {
                if (!importPath.endsWith(".js")) {
                  return `from '${importPath}.js'`;
                } else {
                  return match;
                }
              }
            );

            // Écrire le contenu mis à jour dans le fichier
            fs.writeFile(filePath, updatedContent, "utf8", (err) => {
              if (err) {
                console.error(`Error writing to file ${filePath}:`, err);
                return;
              }
              console.log(`File updated: ${filePath}`);
            });
          });
        } else if (stats.isDirectory()) {
          // C'est un répertoire, appeler récursivement la fonction pour traiter ses fichiers
          processFiles(filePath);
        }
      });
    });
  });
}

// Démarrer le traitement du répertoire racine
processFiles(directory);

const fs = require("fs");
const path = require("path");

const directory = "./out/app"; // Directory where JavaScript files are located

// Recursive function to browse all files in a directory and its sub-directories
function processFiles(dirPath) {
  fs.readdir(dirPath, (err, files) => {
    if (err) {
      console.error(`Error reading directory ${dirPath}:`, err);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(dirPath, file);

      // Check if it's a file
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error(`Error stating file ${filePath}:`, err);
          return;
        }

        if (stats.isFile() && filePath.endsWith(".js")) {
          // It's a .js file, read the contents
          fs.readFile(filePath, "utf8", (err, data) => {
            if (err) {
              console.error(`Error reading file ${filePath}:`, err);
              return;
            }

            // Replace imports without extension by those with ".js" extension
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

            // Write the updated content to the file
            fs.writeFile(filePath, updatedContent, "utf8", (err) => {
              if (err) {
                console.error(`Error writing to file ${filePath}:`, err);
                return;
              }
              console.log(`File updated: ${filePath}`);
            });
          });
        } else if (stats.isDirectory()) {
          // It's a directory, recursively call the function to process its files
          processFiles(filePath);
        }
      });
    });
  });
}

// Start root directory processing
processFiles(directory);


/**
 * Script to update package.json with SharePoint build scripts
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name using ES module approach
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageJsonPath = path.resolve(__dirname, '../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Add SharePoint build scripts
packageJson.scripts = {
  ...packageJson.scripts,
  "build:sharepoint": "node scripts/build-sharepoint.js"
};

// Write the updated package.json
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

console.log('Package.json updated with SharePoint build script');
console.log('You can now run: npm run build:sharepoint');

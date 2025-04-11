
/**
 * SharePoint Build Script
 * 
 * This script creates SharePoint-compatible build files.
 * Run with: node scripts/build-sharepoint.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Build the application
console.log('Building application for SharePoint...');
execSync('npm run build', { stdio: 'inherit' });

// Create a SharePoint deployment folder
const deployDir = path.resolve(__dirname, '../sharepoint-deploy');
if (!fs.existsSync(deployDir)) {
  fs.mkdirSync(deployDir);
}

// Copy the necessary files to the deployment folder
console.log('Preparing SharePoint deployment package...');

// Copy main assets
fs.cpSync(path.resolve(__dirname, '../dist'), deployDir, { recursive: true });

// Create a simple README with instructions
const readme = `
# SharePoint Leave Date Manager Deployment

This folder contains all the files needed to deploy the Leave Date Manager app to SharePoint.

## Deployment Steps

1. Upload all files to your SharePoint "Site Assets" library in a folder called "LeaveDateManager"
2. Create a new SharePoint list called "LeaveDates" with the following columns:
   - Title (default)
   - Date (Date and Time)
   - MaxSlots (Number)
   - BookedSlots (Number)
   - BookedBy (Multiple lines of text)
3. Add a Script Editor web part to your SharePoint page and insert:

\`\`\`html
<div id="root"></div>
<script type="text/javascript" src="/sites/YourSiteName/SiteAssets/LeaveDateManager/assets/sharepoint-[hash].js"></script>
<link rel="stylesheet" href="/sites/YourSiteName/SiteAssets/LeaveDateManager/assets/sharepoint-[hash].css">
\`\`\`

Replace [hash] with the actual hash in the filenames, and YourSiteName with your actual SharePoint site name.
`;

fs.writeFileSync(path.resolve(deployDir, 'README.md'), readme);

console.log('SharePoint deployment package created successfully!');
console.log(`Files are ready in: ${deployDir}`);

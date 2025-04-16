
/**
 * GitHub Pages Deploy Script
 * 
 * This script prepares the application for GitHub Pages deployment.
 * Run with: node scripts/deploy-github.js
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('Preparing application for GitHub Pages deployment...');

try {
  // Build the application
  console.log('Building application...');
  execSync('npm run build', { 
    stdio: 'inherit',
    env: { 
      ...process.env,
      // Set base for custom domain
      BASE_URL: '/'
    }
  });
  
  // Create CNAME file for custom domain
  console.log('Creating CNAME file for custom domain...');
  fs.writeFileSync(path.join('dist', 'CNAME'), 'www.swaph.com');
  
  console.log('Build completed successfully!');
  console.log('\nDeployment Instructions:');
  console.log('1. Push the dist folder to your gh-pages branch');
  console.log('2. Or use gh-pages package: npx gh-pages -d dist');
  console.log('3. Configure your GitHub repository settings to use the gh-pages branch');
  console.log('4. Ensure your DNS settings for swaph.com point to GitHub Pages');
  
} catch (error) {
  console.error('Build failed with error:', error.message);
  console.log('\nTROUBLESHOOTING TIPS:');
  console.log('1. Make sure all dependencies are installed: npm install');
  console.log('2. Check for any TypeScript errors in your project');
  process.exit(1);
}

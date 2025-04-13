
/**
 * GitHub Pages Deploy Script
 * 
 * This script prepares the application for GitHub Pages deployment.
 * Run with: node scripts/deploy-github.js
 */

import { execSync } from 'child_process';

console.log('Preparing application for GitHub Pages deployment...');

try {
  // Build the application
  console.log('Building application...');
  execSync('npm run build', { 
    stdio: 'inherit',
    env: { 
      ...process.env,
      // Set base for GitHub Pages (replace with your repo name)
      // If deploying to custom domain or root user page, set to "/"
      BASE_URL: process.env.BASE_URL || '/leave-date-symphony/'
    }
  });
  
  console.log('Build completed successfully!');
  console.log('\nDeployment Instructions:');
  console.log('1. Push the dist folder to your gh-pages branch');
  console.log('2. Or use gh-pages package: npx gh-pages -d dist');
  console.log('3. Configure your GitHub repository settings to use the gh-pages branch');
  
} catch (error) {
  console.error('Build failed with error:', error.message);
  console.log('\nTROUBLESHOOTING TIPS:');
  console.log('1. Make sure all dependencies are installed: npm install');
  console.log('2. Check for any TypeScript errors in your project');
  process.exit(1);
}


/**
 * Netlify Deploy Script
 * 
 * This script prepares the application for Netlify deployment.
 * Run with: node scripts/deploy-netlify.js
 */

import { execSync } from 'child_process';

console.log('Preparing application for Netlify deployment...');

try {
  // Build the application
  console.log('Building application...');
  execSync('npm run build', { 
    stdio: 'inherit',
    env: { ...process.env }
  });
  
  console.log('Build completed successfully!');
  console.log('\nDeployment Instructions:');
  console.log('1. Connect your GitHub repository to Netlify');
  console.log('2. Set the build command to: npm run build');
  console.log('3. Set the publish directory to: dist');
  console.log('4. Deploy!');
  
} catch (error) {
  console.error('Build failed with error:', error.message);
  console.log('\nTROUBLESHOOTING TIPS:');
  console.log('1. Make sure all dependencies are installed: npm install');
  console.log('2. Check for any TypeScript errors in your project');
  process.exit(1);
}

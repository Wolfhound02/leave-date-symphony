
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// SharePoint specific initializations
document.addEventListener('DOMContentLoaded', () => {
  // Ensure we have a root element to mount our app
  const rootElement = document.getElementById('root') || document.createElement('div');
  
  if (!document.getElementById('root')) {
    rootElement.id = 'root';
    document.body.appendChild(rootElement);
  }

  // Initialize the app
  createRoot(rootElement).render(<App />);
});

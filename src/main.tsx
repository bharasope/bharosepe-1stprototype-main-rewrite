
import React from 'react'; // Explicit React import
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Render the app with React.StrictMode to catch potential problems
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

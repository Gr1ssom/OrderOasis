import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import 'tailwindcss/tailwind.css';
import { registerCharts } from './utils/chartRegistration';

// Register required chart components
registerCharts();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
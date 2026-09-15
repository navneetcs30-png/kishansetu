// Ensure window.fetch has both getter and setter in iframe environments to avoid accessor errors
(function ensureFetchSetter() {
  if (typeof window === 'undefined') return;
  try {
    let currentFetch = window.fetch;
    const desc = Object.getOwnPropertyDescriptor(window, 'fetch') ||
      (typeof Window !== 'undefined' ? Object.getOwnPropertyDescriptor(Window.prototype, 'fetch') : undefined);
    
    if (desc && desc.get && !desc.set) {
      Object.defineProperty(window, 'fetch', {
        get() {
          return currentFetch;
        },
        set(val) {
          currentFetch = val;
        },
        configurable: true,
        enumerable: true,
      });
    }
  } catch {
    // Non-blocking fallback
  }
})();

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

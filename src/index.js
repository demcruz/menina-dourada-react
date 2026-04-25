import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { reportWebVitals } from './webVitals';
import { initThirdPartyScripts } from './lib/loadThirdParty';

const rootElement = document.getElementById('root');

// react-snap injeta HTML estático no #root durante o pre-rendering.
// Detectamos isso pelo atributo data-server-rendered que o react-snap adiciona,
// ou verificando se há elementos (não apenas text nodes / noscript) dentro do root.
const hasPrerenderedContent =
  rootElement.hasChildNodes() &&
  Array.from(rootElement.childNodes).some(node => node.nodeType === Node.ELEMENT_NODE);

if (hasPrerenderedContent) {
  // Hydration: reutiliza o HTML pré-renderizado sem re-renderizar do zero
  ReactDOM.hydrateRoot(
    rootElement,
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  // Render normal: sem pre-rendering (dev ou primeira visita sem cache)
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

// Coleta Web Vitals após o render — não bloqueia nada
reportWebVitals();

// Scripts de terceiros (GA) — carregados via requestIdleCallback
initThirdPartyScripts();

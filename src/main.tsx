import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import "@fontsource/scheherazade-new/400.css";
import "@fontsource/scheherazade-new/700.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "./index.css";
import App from "./App.tsx";

// HashRouter (et non BrowserRouter) : choix délibéré.
// GitHub Pages / Netlify statique ne réécrit pas les routes profondes vers
// index.html au rechargement — c'est la cause racine du bug récurrent
// "page blanche au F5 sur /sourate/xx" rencontré sur les 3 précédentes
// tentatives (Lovable, Bolt, AI Studio). Avec HashRouter, l'URL réelle
// demandée au serveur est toujours "/", le routage se fait côté client
// après coup : aucun 404 possible, quel que soit l'hébergeur statique.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
);

if ("serviceWorker" in navigator) {
  // chemin relatif à index.html, cohérent avec base:"./" (vite.config.ts)
  // et fonctionne donc aussi bien à la racine d'un domaine que dans un
  // sous-dossier (GitHub Pages).
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {
      // l'app reste utilisable sans PWA hors-ligne si l'enregistrement échoue
    });
  });
}

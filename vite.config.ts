import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // base relative ("./") plutôt qu'absolue : le build fonctionne tel quel
  // que l'hébergement final soit à la racine d'un domaine (Netlify) ou
  // dans un sous-dossier (GitHub Pages, ex. user.github.io/repo/), sans
  // avoir à reconfigurer/rebuilder selon le choix d'hébergement.
  base: "./",
})

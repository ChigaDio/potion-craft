// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './', // GitHub Pages ならこれが必要
  build: {
    outDir: 'dist',
  },
});

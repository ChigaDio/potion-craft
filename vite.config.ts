// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/potion-craft/',
  build: {
    outDir: 'dist',
    minify: false, // ✅ ← まずはこれを追加
  },
})

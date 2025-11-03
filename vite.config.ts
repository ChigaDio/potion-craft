// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/potion-craft/',
  build: {
    outDir: 'dist',
    rollupOptions: {},
    minify: 'esbuild',
  },
  esbuild: {
    define: {
      __DEFINES__: '{}', // ✅ ダミー置換
    },
  },
})

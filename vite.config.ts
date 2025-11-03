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
  // esbuild.define から __HMR_CONFIG_NAME__ を削除！
  esbuild: {
    define: {
      // __HMR_CONFIG_NAME__: JSON.stringify('dev'),  // ← 削除！
      __DEFINES__: '{}',
    },
  },
})
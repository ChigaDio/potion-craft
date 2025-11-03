// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/potion-craft/',  // 正しい
  build: {
    outDir: 'dist',
    minify: 'esbuild',
    sourcemap: false,  // デバッグ用オフ（HMR漏れ防ぐ）
  },
  esbuild: {
    define: {
      __DEFINES__: '{}',
    },
  },
  server: {
    hmr: false,  // HMR完全無効（テスト用）
  },
  optimizeDeps: {
    force: true,  // 依存最適化強制
  },
})
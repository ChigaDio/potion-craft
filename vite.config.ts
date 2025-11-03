// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/potion-craft/',          // ← ここは正しい
  build: {
    outDir: 'dist',
    minify: 'esbuild',
    sourcemap: false,              // デバッグ用は OFF
    emptyOutDir: true,
  },
  // dev サーバーでも HMR を無効化（テスト用）
  server: { hmr: false },
  // 依存最適化を強制（キャッシュ無視）
  optimizeDeps: { force: true },
})
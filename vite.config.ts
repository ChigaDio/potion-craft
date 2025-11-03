import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/potion-craft/', // ← リポジトリ名 + 末尾スラッシュ
});
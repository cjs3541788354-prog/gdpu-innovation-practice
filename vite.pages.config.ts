import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/postcss';

export default defineConfig({
  base: '/gdpu-innovation-practice/',
  root: path.resolve(__dirname, 'static-site'),
  publicDir: path.resolve(__dirname, 'public'),
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname),
    },
  },
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  build: {
    outDir: path.resolve(__dirname, 'dist-pages'),
    emptyOutDir: true,
    sourcemap: false,
  },
});

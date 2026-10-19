import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// VITE_BASE is set to /marusia/ by the GitHub Pages workflow; locally the site is served from /
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
  server: { host: true },
});

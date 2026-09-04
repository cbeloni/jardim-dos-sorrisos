import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
  // O caminho relativo permite que os assets sejam encontrados no WebView do Capacitor.
  base: './',
});

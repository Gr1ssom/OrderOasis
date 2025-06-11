import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import https from 'https';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://app.apextrading.com',
        changeOrigin: true,
        secure: false,
        timeout: 300000, // Increased to 5 minutes timeout
        proxyTimeout: 300000, // Added proxy timeout of 5 minutes
        agent: new https.Agent({
          keepAlive: true,
          keepAliveMsecs: 30000, // Keep alive for 30 seconds
        }),
      },
    },
  },
});
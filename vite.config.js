import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  preview: {
    allowedHosts: ['glowhub-store.onrender.com'],
    port: process.env.PORT || 4173,
    host: true,
  },
  define: {
    global: 'globalThis',
  },
})

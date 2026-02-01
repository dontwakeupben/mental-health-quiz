import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Any request starting with /webhook will be forwarded
      '/webhook': {
        target: 'https://n8n-production-a007.up.railway.app',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
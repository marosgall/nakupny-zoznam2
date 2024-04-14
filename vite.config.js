import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue()
  ],
  optimizeDeps: {
    include: ['@vue/cli-service']
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://shoppinglist.wezeo.dev/cms/',
        changeOrigin: true
      }
    }
  }
})

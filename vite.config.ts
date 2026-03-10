import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api-fuel': {
        target: 'https://fuelest.ee',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-fuel/, ''),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('Referer', 'https://fuelest.ee/');
            proxyReq.setHeader('Origin', 'https://fuelest.ee');
          });
        },
      },
    },
  },
})

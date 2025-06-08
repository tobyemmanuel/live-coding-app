import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron'
import { resolve } from 'path'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss({
      config: resolve(__dirname, 'tailwind.config.js'), // Explicitly specify config path
    }),
    electron([
      {
        entry: resolve(import.meta.dirname, 'src/main/main.ts'),
        onstart(options) {
          if (options.startup) {
            options.startup()
          }
        },
      },
      {
        entry: resolve(import.meta.dirname, 'src/preload/preload.ts'),
        onstart(options) {
          options.reload()
        },
      },
    ]),
  ],
  root: 'src/renderer',
  base: './',
  build: {
    outDir: '../../dist/renderer',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      // '@': resolve(__dirname, 'src/renderer/src'),
      '@': resolve(import.meta.dirname, 'src/renderer/src'),
    },
  },
  server: {
    port: 5173,
    host: '127.0.0.1',
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => {
          console.log(`Proxying HTTP request: ${path}`)
          return path
        },
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            console.log(
              `Proxy request: ${req.method} ${req.url} to ${proxyReq.path}`
            )
          })
          proxy.on('error', (err) => {
            console.error('Proxy error:', err)
          })
        },
      },
      '/assets': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => {
          console.log(`Proxying assets request: ${path}`)
          return path
        },
      },
    },
  },
})

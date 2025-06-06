import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron'
import { resolve } from 'path'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
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
  },
})

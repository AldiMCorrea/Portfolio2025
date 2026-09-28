import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  build: {
    rollupOptions: {
      // Multi-page build: each HTML entry becomes its own static route on GitHub Pages.
      input: {
        main: resolve(root, 'index.html'),
        aerialexperience: resolve(root, 'aerialexperience/index.html'),
      },
    },
  },
})

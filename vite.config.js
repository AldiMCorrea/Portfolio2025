import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(fileURLToPath(import.meta.url))

// Dev server: send /aerialexperience to /aerialexperience/ like GitHub Pages does,
// otherwise the SPA fallback serves the main portfolio instead.
const aerialTrailingSlash = {
  name: 'aerial-trailing-slash',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url === '/aerialexperience' || req.url?.startsWith('/aerialexperience?')) {
        res.writeHead(301, { Location: req.url.replace('/aerialexperience', '/aerialexperience/') })
        return res.end()
      }
      next()
    })
  },
}

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react(), aerialTrailingSlash],
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

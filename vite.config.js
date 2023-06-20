import { defineConfig } from 'vite'
import { resolve } from 'path'
import handlebars from 'vite-plugin-handlebars'

const fullReloadAlways = {
  handleHotUpdate({ server }) {
    server.ws.send({ type: 'full-reload' })
    return []
  },
}

const middleware = {
  name: 'middleware',
  apply: 'serve',
  configureServer(viteDevServer) {
    return () => {
      viteDevServer.middlewares.use(async (req, res, next) => {
        if (!req.originalUrl.endsWith('.html') && req.originalUrl !== '/') {
          req.url = `/pages/${req.originalUrl}/index.html`
        } else if (req.url === '/index.html') {
          req.url = `/pages/${req.url}`
        }

        next()
      })
    }
  },
}

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  plugins: [
    handlebars({
      partialDirectory: resolve(__dirname, 'src'),
    }),
    fullReloadAlways,
    middleware,
  ],
})

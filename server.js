const config = require('config')
const files = require('serve-static')
const path = require('path')
const cache = require('http-cache-middleware')
const morgan = require('morgan')

// configuration
const distDirectory = config.get('distDirectory') || 'dist/'
const port = config.get('port') || 3000
const cacheEnabled = config.get('cacheEnabled') || true
const cacheControlHeaderValue = config.get('cacheControlHeaderValue') || 'public, no-cache, max-age=604800'
const defaultFile = config.get('defaultFile') || 'index.html'
const logsFormat = config.get('logsFormat') || 'tiny'

// middleware for serving static files
const serve = files(path.join(__dirname, distDirectory), {
  lastModified: false,
  setHeaders: (res) => {
    if (cacheEnabled) {
      res.setHeader('cache-control', cacheControlHeaderValue)
    }
  }
})

module.exports = () => {
  // server bootstrap
  const server = require('restana')({})
  server.use(morgan(logsFormat))
  server.use((req, res, next) => {
    if (req.url === '/') {
      req.url = defaultFile
    }

    return next()
  })
  if (cacheEnabled) {
    server.use(cache())
  }
  server.use(serve)

  return {
    server,
    port
  }
}

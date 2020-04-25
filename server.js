const config = require('config')
const files = require('serve-static')
const path = require('path')
const cache = require('http-cache-middleware')
const morgan = require('morgan')

module.exports = () => {
  // configuration
  const {
    DIST_DIRECTORY,
    PORT,
    CACHE_ENABLED,
    CACHE_CONTROL_HEADER_VALUE,
    DEFALUT_FILE,
    LOGS_FORMAT
  } = process.env

  const distDirectory = DIST_DIRECTORY || config.get('distDirectory') ||
    'dist/'
  const port = PORT || config.get('port') ||
    3000
  const cacheEnabled = isCacheEnabled(CACHE_ENABLED, config)
  const cacheControlHeaderValue = CACHE_CONTROL_HEADER_VALUE || config.get('cacheControlHeaderValue') ||
    'public, no-cache, max-age=604800'
  const defaultFile = DEFALUT_FILE || config.get('defaultFile') ||
    'index.html'
  const logsFormat = LOGS_FORMAT || config.get('logsFormat') ||
    'tiny'

  // middleware for serving static files
  const serve = files(path.join(__dirname, distDirectory), {
    lastModified: false,
    setHeaders: (res) => {
      if (cacheEnabled) {
        res.setHeader('cache-control', cacheControlHeaderValue)
      }
    }
  })

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

function isCacheEnabled (env, config) {
  if (env !== undefined) {
    if (env === 'true') return true
    else return false
  } else {
    return config.get('cacheEnabled') || true
  }
}

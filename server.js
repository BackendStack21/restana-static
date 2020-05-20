const config = require('config')
const files = require('serve-static')
const path = require('path')
const cache = require('http-cache-middleware')
const morgan = require('morgan')
const middlewares = require('./middlewares')

module.exports = () => {
  // configuration
  const {
    DIST_DIRECTORY,
    PORT,
    CACHE_ENABLED,
    CACHE_CONTROL_HEADER_VALUE,
    DEFALUT_FILE,
    LOGS_FORMAT,
    LOGS_ENABLED
  } = process.env

  const distDirectory = DIST_DIRECTORY || config.get('distDirectory') ||
    'dist/'
  const port = PORT || config.get('port') ||
    3000
  const cacheEnabled = isEnabled(CACHE_ENABLED, 'cacheEnabled', config)
  const cacheControlHeaderValue = CACHE_CONTROL_HEADER_VALUE || config.get('cacheControlHeaderValue') ||
    'public, no-cache, max-age=604800'
  const defaultFile = DEFALUT_FILE || config.get('defaultFile') ||
    'index.html'
  const logsEnabled = isEnabled(LOGS_ENABLED, 'logsEnabled', config)
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
  if (logsEnabled) {
    server.use(morgan(logsFormat))
  }
  server.use((req, res, next) => {
    if (req.url === '/') {
      req.url = defaultFile
    }

    return next()
  })

  // supporting custom middlewares
  for (const middleware of middlewares) {
    server.use(middleware())
  }

  // supporting cache
  if (cacheEnabled) {
    server.use(cache())
  }
  server.use(serve)

  return {
    server,
    port
  }
}

function isEnabled (env, configKey, config) {
  if (env !== undefined) {
    if (env === 'true') return true
    else return false
  } else {
    return config.get(configKey) || true
  }
}

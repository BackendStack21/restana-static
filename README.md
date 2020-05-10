# restana-static
Efficiently serve static files using Node.js and Docker containers: https://itnext.io/restana-static-serving-the-frontend-with-node-js-beyond-nginx-e45fdb2e49cb

```Dockerfile
FROM kyberneees/restana-static:latest
RUN rm dist/index.html
RUN echo "Hello World!" >> dist/index.html
```

## Configuration options
restana-static image configuration is manage using the module: https://www.npmjs.com/package/config, so developers can manage multiple envirments if desired.  

The `/restana-static/config` directory should be populated/overwritten during image creation. 

### Default configuration: 
```json
{
    "port": 3000,
    "cacheEnabled": true, 
    "cacheControlHeaderValue": "public, no-cache, max-age=604800",
    "distDirectory": "dist/",
    "defaultFile": "index.html",
    "logsFormat": "tiny"
}
```
> File location : `/restana-static/config/default.json`

### Environment configuration
Optionally, you can overwrite each configuration entry using corresponding environment variables.
```bash
# port
PORT 
# cacheEnabled
CACHE_ENABLED
# cacheControlHeaderValue
CACHE_CONTROL_HEADER_VALUE
# distDirectory
DIST_DIRECTORY
# defaultFile
DEFALUT_FILE
# logsFormat
LOGS_FORMAT
```

## Adding static files
The `/restana-static/dist` directory should be populated/overwritten during image creation. 
> Please consider that default path will change if you overwrite the `distDirectory` config.

## Log formats
Logs are provided by the module: https://www.npmjs.com/package/morgan  

Allowed `logsFormat` values are described at: https://www.npmjs.com/package/morgan#predefined-formats

## Cache support
Caching is provided by the module: https://www.npmjs.com/package/http-cache-middleware

## Custom middlewares
You can also introduce other features such as authentication, security protections, etc... by using custom middlewares.  
You can just replace the `middlewares.js` file by your own configuration.  

Default:
```js 
// custom middlewares set
// this file is intended to be overwritten by final images
const helmet = require('helmet')

module.exports = [
  helmet
]
```
> Please note that the `helmet` middleware enabled by default. See more details here: https://www.npmjs.com/package/helmet
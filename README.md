# Introduction
[![build images](https://github.com/BackendStack21/restana-static/actions/workflows/build_images.yaml/badge.svg)](https://github.com/BackendStack21/restana-static/actions/workflows/build_images.yaml)

<img src="docs/restana-static-logo.svg" width="400">  

Efficiently serve static files using Node.js and Docker containers: https://itnext.io/restana-static-serving-the-frontend-with-node-js-beyond-nginx-e45fdb2e49cb

Example Dockerfile:
```Dockerfile
FROM kyberneees/restana-static:latest
RUN rm dist/index.html
RUN echo "Hello World!" >> dist/index.html
```

# More
- Website and documentation: https://static.21no.de
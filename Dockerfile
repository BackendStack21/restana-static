FROM node:16-alpine 
RUN apk add --no-cache tini

RUN mkdir /restana-static
WORKDIR /restana-static

COPY package.json .
COPY index.js .
COPY server.js .
COPY middlewares.js .
COPY config ./config
COPY dist ./dist

RUN npm install --production

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "index.js"]


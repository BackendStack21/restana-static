FROM node:12-alpine 

RUN mkdir /restana-static
WORKDIR /restana-static

COPY package.json .
COPY package-lock.json .
COPY index.js .
COPY server.js .
COPY middlewares.js .
COPY config ./config
COPY dist ./dist

RUN npm install --production

CMD ["node", "index.js"]


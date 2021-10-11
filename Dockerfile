FROM node:dubnium-buster-slim as build
LABEL version="1.0"
LABEL maintaner="jorge.almela@bavenir.eu"
LABEL release-date="11-10-2021"
ARG MY_ENV
RUN apt-get update
RUN apt-get install -y git
RUN npm install -g bower
USER node
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY --chown=node:node vicinityManager/package*.json vicinityManager/bower.json vicinityManager/.bowerrc  /app/
COPY --chown=node:node vicinityManager/app/ /app/dist/
COPY --chown=node:node vicinityManager/environments/env.${MY_ENV}.js /app/dist/env.js
RUN bower install -F
RUN npm ci && npm cache clean --force

FROM nginx:stable
COPY --from=build /app/dist /usr/share/nginx/html/nm
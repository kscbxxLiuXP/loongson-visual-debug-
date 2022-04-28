FROM node:alpine AS builder
LABEL stage=builder
EXPOSE 80
WORKDIR /app

ADD package.json  /app/
ADD package-lock.json  /app/
ADD babel.config.js  /app/
ADD vue.config.js  /app/
ADD ./src /app/src
ADD public /app/public

RUN npm install
RUN npm run build

##### end builder image #####

##### runtime image #####
FROM nginx:stable-alpine

COPY config/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
#
CMD nginx -g 'daemon off;'
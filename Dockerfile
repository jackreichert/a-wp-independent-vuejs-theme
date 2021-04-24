FROM node:lts-alpine3.10

COPY . .

RUN npm install

RUN npm run build

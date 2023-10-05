FROM node:20-alpine

ENV TZ="Europe/Moscow"
RUN date

WORKDIR /home/node/app
COPY package*.json ./
COPY tsconfig.json ./
COPY src ./src
COPY logs ./logs

RUN npm install -gf tsc \
    && npm install -gf concurrently \
    && npm install -gf typescript

RUN npm i

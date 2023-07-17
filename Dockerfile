FROM node:16-alpine

ENV TZ=Asia/Bangkok
RUN apk update
RUN apk upgrade
RUN rm -rf /var/cache/apk/*

ARG mode

WORKDIR /app/Dark-DungeonBE

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN npm run ${mode}

CMD [ "node", "dist/main.js" ]

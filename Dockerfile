FROM node:alpine

WORKDIR /usr/app

COPY package*.json tsconfig.json ./

RUN npm install

COPY . .

CMD npm run start
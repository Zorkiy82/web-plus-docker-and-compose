FROM node:16.15-alpine
WORKDIR /app
COPY package*.json ./

RUN npm i

COPY . ./

ENTRYPOINT ["npm", "run", "start"]
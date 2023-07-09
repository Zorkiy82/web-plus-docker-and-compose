FROM node:16.15-alpine
WORKDIR /app
COPY package*.json ./

RUN npm i

COPY . ./

EXPOSE 5000

ENTRYPOINT ["npm", "run", "start"]
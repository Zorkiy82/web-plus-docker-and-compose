FROM node:16-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . ./

RUN npm run build \
    && rm -rf ./src \
    && rm -rf node ./node_modules

FROM node:16-alpine AS backend
WORKDIR /app
COPY package*.json ./
COPY ./ecosystem.config.js ./
RUN npm ci --omit=dev --no-audit --no-fund && npm i -g pm2
COPY --from=builder /app/dist ./dist

EXPOSE 5000

ENTRYPOINT ["pm2-runtime", "start", "ecosystem.config.js"]
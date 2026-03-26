FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install --production=false

COPY . .
RUN npm run build:server

ENV NODE_ENV=production
CMD ["node", "dist-server/index.js"]

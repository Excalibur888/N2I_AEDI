FROM node:20-alpine AS runner

WORKDIR /app

COPY package.json .
COPY package-lock.json .
COPY server.js .
COPY public/ ./public/

RUN npm install --production

EXPOSE 3000

CMD ["node", "server.js"]
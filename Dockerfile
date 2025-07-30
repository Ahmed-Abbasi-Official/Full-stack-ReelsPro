FROM node:18-alpine

WORKDIR /app

COPY server/ ./server
COPY models/ ./models

WORKDIR /app/server

RUN npm install

EXPOSE 8000

CMD ["npm", "start"]

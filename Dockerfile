FROM node:20.10.0-alpine

WORKDIR /app

COPY . /app

RUN ls /app

RUN npm install

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]

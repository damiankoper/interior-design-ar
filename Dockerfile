FROM node:16-alpine

WORKDIR /app

COPY package*.json .
RUN npm ci 

# rest mounted via volume
COPY vue.config.js .
COPY tsconfig.json .
COPY .eslintrc.js .

EXPOSE 8080

CMD ["npm","run","serve"]

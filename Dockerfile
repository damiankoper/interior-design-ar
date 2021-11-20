FROM node:16-alpine

WORKDIR /app

EXPOSE 8080

# mounted via volume in docker-compose

ENTRYPOINT [ "./entrypoint.sh" ]

CMD ["npm","run","serve"]

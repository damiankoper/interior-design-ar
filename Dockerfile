FROM node:16-alpine

WORKDIR /app

COPY entrypoint.sh .

EXPOSE 8080

ENTRYPOINT [ "./entrypoint.sh" ]

CMD ["npm","run","serve"]

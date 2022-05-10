FROM alpine:3.15.4
RUN apk add --update nodejs npm
COPY . /
RUN npm install
EXPOSE 3000
CMD ["npm", "run", "start"]

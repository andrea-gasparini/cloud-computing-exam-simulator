FROM alpine:3.15.4
RUN apk add --update nodejs npm git
RUN git clone https://github.com/andrea-gasparini/cloud-computing-exam-simulator
WORKDIR cloud-computing-exam-simulator
RUN npm install
EXPOSE 3000
CMD ["npm", "run", "start"]

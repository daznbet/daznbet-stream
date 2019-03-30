FROM node:10-alpine

RUN mkdir -p /usr/src
WORKDIR /usr

COPY package.json /usr

RUN npm install --silent
COPY ./src ./src

EXPOSE 3000
CMD ["npm", "start"]

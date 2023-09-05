FROM node:18

# Create app directory
RUN mkdir -p /dist/src/app
WORKDIR /dist/src/app

# Install app dependencies
COPY package.json /dist/src/app/
RUN npm install

# Bundle app source
COPY . /dist/src/app

EXPOSE 8080
CMD [ "npm", "run", "dev" ]
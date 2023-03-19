FROM node:lts-alpine

WORKDIR /app

COPY . .

# the --only=production flag, installs only the production dependencies, 
# and not the dev dependendecies. this coould avoid security problems also.

RUN npm run install-client --only=production 

# this builds the clients in the public folder on the server.
RUN npm run build --prefix client

RUN npm run install-server --only=production 

# assignig the user to node, avoids the default which is the root user, 
# so it diminish the damage a potential hacker can do.
USER node

# this starts the server, it will be serving the client built in the public folder.
CMD ["npm", "start", "--prefix", "server"]

EXPOSE 8000
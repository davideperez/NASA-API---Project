FROM node:lts-alpine

WORKDIR /app

# asteric is to indicate that we want to copy our package-lock.json too.
# take into account that the package-lock.json from windows, could have issues with alpine linux.

COPY package*.json ./

# the --only=production flag, installs only the production dependencies, 
# and not the dev dependendecies. this coould avoid security problems also.

COPY client/package*.json client/
RUN npm run install-client --only=production 

# this builds the clients in the public folder on the server.
COPY server/package.json server/
RUN npm run install-server --only=production 

COPY client/ client/
RUN npm run build --prefix client

COPY server/ server/

# assignig the user to node, avoids the default which is the root user, 
# so it diminish the damage a potential hacker can do.
USER node

# this starts the server, it will be serving the client built in the public folder.
CMD ["npm", "start", "--prefix", "server"]

EXPOSE 8000
FROM node:20-alpine

RUN apk add --no-cache vips-dev build-base gcc autoconf automake libtool make nasm zlib-dev libpng-dev

WORKDIR /opt/app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

# Set environment for the build process
ARG PUBLIC_URL=http://localhost:3002
ENV PUBLIC_URL=$PUBLIC_URL
ENV NODE_ENV=production 

RUN npm run build

EXPOSE 3002

# We use 'start' to serve the static admin panel we just built
CMD ["npm", "run", "start"]
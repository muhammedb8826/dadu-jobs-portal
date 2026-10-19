# syntax=docker/dockerfile:1

FROM node:20-alpine AS build
RUN apk add --no-cache \
  build-base \
  gcc \
  autoconf \
  automake \
  zlib-dev \
  libpng-dev \
  vips-dev \
  git \
  python3

WORKDIR /opt/app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG PUBLIC_URL=https://jobs-api.bluemoongt.com
ENV PUBLIC_URL=$PUBLIC_URL
ENV NODE_ENV=production

RUN npm run build

FROM node:20-alpine AS runner
RUN apk add --no-cache vips-dev

WORKDIR /opt/app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3016

COPY --from=build /opt/app ./

EXPOSE 3016

CMD ["npm", "run", "start"]

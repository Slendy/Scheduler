FROM node:24 AS build

RUN apt-get update && \
    npm install -g pnpm && \
    apt-get install -y git && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

RUN pnpm build

FROM node:24-alpine AS release

WORKDIR /scheduler

ENV NODE_ENV="production"

COPY --from=build /app/build/ /scheduler

USER scheduler
EXPOSE 3000/tcp
ENTRYPOINT ["pnpm", "run", "start"]

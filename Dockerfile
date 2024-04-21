FROM oven/bun:latest as build

WORKDIR /app

COPY package.json bun.lockb ./

RUN bun install

COPY . .

RUN bun run build

FROM oven/bun:alpine as release

WORKDIR /scheduler

ENV NODE_ENV="production"

COPY --from=build /app/build/ /scheduler

USER bun
EXPOSE 3000/tcp
ENTRYPOINT ["bun", "run", "start"]

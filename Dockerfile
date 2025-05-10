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

ENV USER_ID=1000
ENV GROUP_ID=1000
ENV USER_NAME=scheduler
ENV GROUP_NAME=scheduler

RUN addgroup -g $GROUP_ID $GROUP_NAME && \
    adduser --shell /sbin/nologin --disabled-password \
    --no-create-home --uid $USER_ID --ingroup $GROUP_NAME $USER_NAME

USER $USER_NAME

EXPOSE 3000/tcp
ENTRYPOINT ["pnpm", "run", "start"]

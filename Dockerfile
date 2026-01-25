FROM node:25-alpine3.23

RUN ["apk", "add", "--no-cache", "curl"]

RUN ["apk", "add", "--no-cache", "openjdk17"]

WORKDIR /app

COPY ./package*.json .

RUN ["npm", "install", "-g", "pnpm"]

RUN ["pnpm", "install"]

COPY . .

EXPOSE 5173

RUN ["pnpm", "generate"]

ENTRYPOINT [ "pnpm", "run", "dev" ]
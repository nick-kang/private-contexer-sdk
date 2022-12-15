FROM node:18

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app
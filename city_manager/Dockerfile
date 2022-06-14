FROM docker.io/node:18-alpine as builder

WORKDIR /app

COPY package.json yarn.lock /app/

RUN yarn install --frozen-lockfile

COPY . /app

RUN yarn build

FROM docker.io/node:18-alpine

WORKDIR /app

COPY --from=builder /app /app

RUN yarn install --frozen-lockfile --prod

CMD ["node", "/app/dist/main.js"]

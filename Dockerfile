FROM node:23-alpine AS builder
WORKDIR /app
COPY yarn.lock package.json ./
RUN yarn install --frozen-lockfile --network-timeout 1000000
COPY . .
RUN yarn build

FROM node:23-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["yarn", "preview", "--port", "3000"]

FROM node:20-alpine AS builder
ARG SUPABASE_URL
ARG SUPABASE_SERVICE_ROLE_KEY

ENV VITE_SUPABASE_URL=$SUPABASE_URL
ENV VITE_SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_ROLE_KEY

WORKDIR /app
COPY yarn.lock package.json ./
RUN yarn install --frozen-lockfile --network-timeout 1000000
COPY . .

RUN yarn build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["yarn", "preview", "--port", "3000"]

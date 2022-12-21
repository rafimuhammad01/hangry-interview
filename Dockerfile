# Adapted from https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile
# Install dependencies only when needed
FROM node:16-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:16-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build


FROM node:16-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY prisma ./prisma/  

CMD ["node", "dist/index.js" ]

# FROM --platform=linux/amd64 node:16 as base

# WORKDIR /usr/src/app
# COPY package*.json ./
# COPY prisma ./prisma

# RUN npm ci
# RUN npx prisma generate

# COPY . .
# RUN npm run build


# FROM base
# WORKDIR /usr/src/app
# COPY package*.json ./
# RUN npm ci --production
# COPY --from=base /usr/src/app/dist ./dist

# CMD [ "node", "dist/index.js" ]
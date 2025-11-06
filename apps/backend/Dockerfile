# ---- Base stage ----
FROM oven/bun:canary-alpine AS base

WORKDIR /app

COPY package.json .
RUN bun install
COPY . .

# ---- Build stage ----
FROM base AS build
RUN bun run build

ENV BETTER_AUTH_SECRET=b3798e9fefb5786fdfb6e56c98930f394bc2cabc91466b766586b91110795f42
ENV BETTER_AUTH_URL=http://localhost:8080
ENV DB_URL='postgresql://neondb_owner:npg_gBpMGaL91nYy@ep-plain-heart-adynr2mx-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
ENV GMAIL_USER=
ENV GMAIL_PASS=""
ENV PORT="8080"

# ---- Production stage ----
FROM oven/bun:canary-alpine
WORKDIR /app
ENV BETTER_AUTH_SECRET=b3798e9fefb5786fdfb6e56c98930f394bc2cabc91466b766586b91110795f42
ENV BETTER_AUTH_URL=http://localhost:8080
ENV DB_URL='postgresql://neondb_owner:npg_gBpMGaL91nYy@ep-plain-heart-adynr2mx-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
ENV GMAIL_USER=
ENV GMAIL_PASS=""
ENV PORT="8080"

# Copy built files from the build stage
COPY --from=build /app/dist ./

# Expose the Cloud Run port
EXPOSE 8080

# Cloud Run expects the app to listen on $PORT
ENV PORT=8080

CMD ["bun", "index.js"]

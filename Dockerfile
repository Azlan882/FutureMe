# Production Dockerfile for FutureMe Express Backend + Web App
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./
RUN npm ci

# Copy source and build web assets + backend bundle
COPY . .
RUN npm run build

# Runner stage
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy compiled frontend and bundled server from builder
COPY --from=builder /app/dist ./dist

# Default port for Cloud Run is 8080 (can be overridden via PORT env var)
ENV PORT=8080
EXPOSE 8080

CMD ["node", "dist/server.cjs"]

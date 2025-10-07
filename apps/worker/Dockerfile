# Use the official Node.js image as base
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Copy package files for dependency installation
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/ ./packages/
COPY apps/ ./apps/
COPY tooling/ ./tooling/

# Install pnpm and dependencies
RUN npm install -g pnpm
RUN pnpm install

# Build stage
FROM base AS build

# Source code is already copied in base stage

# Build the worker application
WORKDIR /app
RUN pnpm run --filter worker build

# Production stage
FROM node:18-alpine AS production

# Create app user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 workeruser

# Set working directory
WORKDIR /app

# Copy built application
COPY --from=build --chown=workeruser:nodejs /app/apps/worker/dist ./dist

# Copy package.json for runtime dependencies
COPY --from=build --chown=workeruser:nodejs /app/apps/worker/package.json ./package.json

# Install only production dependencies
RUN npm install -g pnpm
RUN pnpm install --production

# Switch to non-root user
USER workeruser

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "console.log('Worker is running')" || exit 1

# Start the worker
CMD ["node", "dist/worker.js"]

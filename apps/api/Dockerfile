# Use the official Bun image as base
FROM oven/bun:1.1.0-alpine AS base

# Set working directory
WORKDIR /app

# Copy package files for dependency installation
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/ ./packages/
COPY apps/api/package.json ./apps/api/

# Install dependencies
RUN bun install --frozen-lockfile

# Build stage
FROM base AS build

# Copy source code
COPY apps/api/ ./apps/api/
COPY packages/ ./packages/

# Build the application
WORKDIR /app/apps/api
RUN bun run build

# Production stage
FROM oven/bun:1.1.0-alpine AS production

# Create app user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 bunuser

# Set working directory
WORKDIR /app

# Copy built application
COPY --from=build --chown=bunuser:nodejs /app/apps/api/dist/server ./server

# Copy package.json for runtime dependencies
COPY --from=build --chown=bunuser:nodejs /app/apps/api/package.json ./package.json

# Install only production dependencies
RUN bun install --frozen-lockfile --production

# Switch to non-root user
USER bunuser

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD bun run --silent -e "fetch('http://localhost:8000/').then(r => r.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"

# Start the application
CMD ["./server"]

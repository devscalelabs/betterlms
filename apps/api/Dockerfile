# Production build for API backend
FROM node:18-alpine

# Install pnpm and dotenv-cli for migrations
RUN npm install -g pnpm dotenv-cli

# Create workspace structure
RUN mkdir -p /workspace/apps/api /workspace/packages /workspace/tooling
WORKDIR /workspace

# Copy workspace files needed for migrations and dependencies
COPY ./package.json ./pnpm-lock.yaml ./pnpm-workspace.yaml ./
COPY ./packages/database ./packages/database
COPY ./packages/core ./packages/core
COPY ./packages/email ./packages/email
COPY ./packages/storages ./packages/storages
COPY ./tooling/typescript ./tooling/typescript

# Install dependencies for database package
RUN pnpm install --no-frozen-lockfile

# Copy API package.json
COPY ./apps/api/package.json ./apps/api/package.json

# Install API app dependencies using pnpm
RUN cd apps/api && CI=true pnpm install --no-frozen-lockfile --prod

# Copy built application
COPY ./apps/api/dist ./apps/api/dist

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership
RUN chown -R nodejs:nodejs /workspace
USER nodejs

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"

# Run database migrations and start the application
CMD sh -c "echo 'Running database migrations...' && pnpm --filter @betterlms/database db:migrate && echo 'Starting API server...' && cd apps/api && exec node dist/server.cjs"

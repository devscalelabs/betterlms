# Use the official Node.js image as base
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Copy package files for dependency installation
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/ ./packages/
COPY apps/admin/package.json ./apps/admin/

# Install pnpm and dependencies
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Build stage
FROM base AS build

# Copy source code
COPY apps/admin/ ./apps/admin/
COPY packages/ ./packages/

# Build the admin application
WORKDIR /app/apps/admin
RUN pnpm run build

# Production stage
FROM nginx:alpine AS production

# Copy built application
COPY --from=build /app/apps/admin/dist /usr/share/nginx/html

# Copy nginx configuration
COPY apps/admin/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

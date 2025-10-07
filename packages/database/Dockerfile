# Use the official Node.js image as base
FROM node:18-alpine

# Install PostgreSQL client
RUN apk add --no-cache postgresql-client

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/database/package.json ./packages/database/

# Install pnpm and dependencies
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Copy database package
COPY packages/database/ ./packages/database/

# Make migration script executable
RUN chmod +x ./packages/database/migrate.sh

# Set working directory to database package
WORKDIR /app/packages/database

# Default command
CMD ["./migrate.sh"]

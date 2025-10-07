# Use the official Node.js image as base
FROM node:18-alpine

# Install PostgreSQL client
RUN apk add --no-cache postgresql-client

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/ ./packages/
COPY apps/ ./apps/
COPY tooling/ ./tooling/

# Install pnpm and dependencies
RUN npm install -g pnpm
RUN pnpm install

# Make migration script executable
RUN chmod +x ./packages/database/migrate.sh

# Set working directory to database package
WORKDIR /app/packages/database

# Default command
CMD ["./migrate.sh"]

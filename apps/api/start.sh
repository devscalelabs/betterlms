#!/bin/sh

# Exit on any error
set -e

echo "Running database migrations..."
# Run migration from current directory (workspace root is /app)
pnpm --filter @betterlms/database db:migrate

echo "Starting API server..."
# Start the server from apps/api directory
exec node apps/api/dist/server.cjs

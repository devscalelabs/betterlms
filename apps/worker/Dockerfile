# Production build for worker app
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy built application
COPY ./apps/worker/dist ./dist

# Copy package.json for any runtime dependencies
COPY ./apps/worker/package.json ./

# Install only production dependencies if needed
RUN npm install --only=production || true

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership
RUN chown -R nodejs:nodejs /app
USER nodejs

# Start the worker
CMD ["node", "dist/worker.js"]

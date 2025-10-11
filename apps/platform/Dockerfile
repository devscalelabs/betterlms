# Production build for React platform app
FROM nginx:alpine

# Copy built assets
COPY ./apps/platform/dist /usr/share/nginx/html

# Copy nginx configuration
COPY ./apps/platform/.docker/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 3000

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

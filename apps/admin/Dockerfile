# Production build for React admin app
FROM nginx:alpine

# Copy built assets
COPY ./apps/admin/dist /usr/share/nginx/html

# Copy nginx configuration
COPY ./apps/admin/.docker/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 4000

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

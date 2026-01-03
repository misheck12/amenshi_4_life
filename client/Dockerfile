# Amenshi 4 Life Frontend - Production Dockerfile
# Multi-stage build for optimized React/Vite application with Nginx

# ===== BUILD STAGE =====
# Use Node.js Alpine for building the React application
FROM node:18-alpine AS builder

# Set working directory for build process
WORKDIR /app

# Copy configuration files first for better Docker layer caching
# This allows dependency installation to be cached if configs haven't changed
COPY package*.json ./
COPY vite.config.js ./
COPY tailwind.config.js ./
COPY postcss.config.js ./

# Install all dependencies (including dev dependencies for building)
RUN npm ci

# Copy all source code for building
COPY . .

# Cache bust argument - passed from GitHub Actions workflow
# This ensures fresh builds when needed
ARG CACHEBUST=1

# Environment variables for build process
# API URL is configured for production backend
ARG VITE_API_URL=https://amenshi4lifebackend.livingii.com/api
ENV VITE_API_URL=$VITE_API_URL

# Build the React application for production
# Output will be in /app/dist directory
RUN echo "Cache bust: $CACHEBUST, API: $VITE_API_URL" && npm run build

# ===== PRODUCTION STAGE =====
# Use lightweight Nginx Alpine for serving static files
FROM nginx:alpine

# Copy built React application from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose standard HTTP port
EXPOSE 80

# Health check to ensure Nginx is serving content
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

# Start Nginx in foreground mode
CMD ["nginx", "-g", "daemon off;"]
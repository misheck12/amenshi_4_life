# Amenshi 4 Life Backend - Production Dockerfile
# This builds a secure, optimized Node.js container for the Express API server

# Use official Node.js Alpine image for smaller size and better security
FROM node:18-alpine

# Set working directory inside container
WORKDIR /app

# Copy package files first for better Docker layer caching
# This allows npm install to be cached if dependencies haven't changed
COPY package*.json ./

# Install only production dependencies for smaller image size
# Using npm ci for faster, reliable, reproducible builds
RUN npm ci --only=production

# Copy application source code
COPY . .

# Create non-root user for security best practices
# Running as non-root reduces security risks
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Set proper file permissions for the nodejs user
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose the port the app runs on
EXPOSE 3005

# Health check to ensure container is healthy
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3005/health', (r) => {if(r.statusCode!==200)throw new Error()})"

# Start the application
CMD ["node", "server.js"]
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy application source
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Set permissions
RUN chown -R nodejs:nodejs /app
USER nodejs

EXPOSE 3002

CMD ["node", "server.js"]
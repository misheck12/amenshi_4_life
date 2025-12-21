# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY vite.config.js ./
COPY tailwind.config.js ./
COPY postcss.config.js ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Cache bust argument - passed from workflow
ARG CACHEBUST=1

# Environment variables for build
ARG VITE_API_URL=https://amenshi4lifebackend.livingii.com/api
ENV VITE_API_URL=$VITE_API_URL

# Build application
RUN echo "Cache bust: $CACHEBUST, API: $VITE_API_URL" && npm run build

# Production stage
FROM nginx:alpine

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
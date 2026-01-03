#!/bin/bash

echo "🧹 Cleaning up conflicting containers..."

# Stop and remove all amenshi and sync containers
docker stop amenshi_backend amenshi_frontend sync_backend sync_frontend 2>/dev/null || true
docker rm amenshi_backend amenshi_frontend sync_backend sync_frontend 2>/dev/null || true

# Remove any containers using the same names
docker ps -a --filter "name=amenshi" --format "{{.ID}}" | xargs -r docker rm -f 2>/dev/null || true
docker ps -a --filter "name=sync" --format "{{.ID}}" | xargs -r docker rm -f 2>/dev/null || true

# Clean up networks
docker network rm sync_network amenshi_network 2>/dev/null || true

echo "✅ Cleanup completed!"
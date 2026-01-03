#!/bin/bash

# Amenshi 4 Life - Container Cleanup Script
# This script removes all existing containers and networks to prevent conflicts
# during deployment. It handles both old and new naming conventions.

echo "🧹 Starting comprehensive container cleanup..."

# ===== STOP AND REMOVE CONTAINERS =====
# Stop containers gracefully first, then force remove
echo "Stopping containers..."
docker stop amenshi_backend amenshi_frontend sync_backend sync_frontend 2>/dev/null || true

echo "Removing containers..."
docker rm amenshi_backend amenshi_frontend sync_backend sync_frontend 2>/dev/null || true

# ===== CLEANUP BY NAME PATTERN =====
# Remove any containers that match our naming patterns
echo "Cleaning up containers by name pattern..."
docker ps -a --filter "name=amenshi" --format "{{.ID}}" | xargs -r docker rm -f 2>/dev/null || true
docker ps -a --filter "name=sync" --format "{{.ID}}" | xargs -r docker rm -f 2>/dev/null || true

# ===== CLEANUP NETWORKS =====
# Remove custom networks to prevent conflicts
echo "Cleaning up networks..."
docker network rm sync_network amenshi_network 2>/dev/null || true

# ===== CLEANUP UNUSED RESOURCES =====
# Remove dangling images and unused volumes
echo "Cleaning up unused Docker resources..."
docker image prune -f 2>/dev/null || true
docker volume prune -f 2>/dev/null || true

echo "✅ Container cleanup completed successfully!"
echo "📊 Current Docker status:"
docker ps -a --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
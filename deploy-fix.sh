#!/bin/bash
set -e

echo "🔧 Applying Backend-Frontend Communication Fix..."
echo "================================================"

# Navigate to project directory
cd ~/amenshi-app || cd /home/Misheck/amenshi-app || { echo "❌ Project directory not found"; exit 1; }

echo "📍 Current directory: $(pwd)"

# Backup current .env
echo "💾 Backing up current .env..."
cp server/.env server/.env.backup.$(date +%Y%m%d_%H%M%S)

# Update CLIENT_URL
echo "🔄 Updating CLIENT_URL..."
sed -i 's|CLIENT_URL=.*|CLIENT_URL=https://amenshi4life.livingii.com|' server/.env

# Verify change
echo "✅ New CLIENT_URL:"
grep CLIENT_URL server/.env

# Pull latest changes
echo "📥 Pulling latest code..."
git pull origin main || echo "⚠️  Git pull failed or no changes"

# Rebuild backend
echo "🏗️  Rebuilding backend container..."
docker-compose -f docker-compose.prod.yml build backend

# Restart backend
echo "🚀 Restarting backend..."
docker-compose -f docker-compose.prod.yml up -d backend

# Wait for container to start
echo "⏳ Waiting for backend to start..."
sleep 5

# Check status
echo "📊 Container status:"
docker ps | grep amenshi

# Test health check
echo "🏥 Testing health check..."
curl -s http://localhost:3010/health || echo "⚠️  Health check failed"

echo ""
echo "✅ Deployment complete!"
echo "================================================"
echo "Next steps:"
echo "1. Test frontend: https://amenshi4life.livingii.com"
echo "2. Test API: https://amenshi4lifebackend.livingii.com/api/projects"
echo "3. Check logs: docker logs amenshi_backend -f"

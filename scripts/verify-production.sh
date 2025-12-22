#!/bin/bash

# Production Backend-Frontend Communication Verification Script
# Run this on your production server after deployment

echo "🔍 Verifying Production Setup..."
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check 1: Backend Health (Direct)
echo "1️⃣  Checking Backend Health (Direct)..."
HEALTH_RESPONSE=$(curl -s http://localhost:3010/health)
if echo "$HEALTH_RESPONSE" | grep -q "UP"; then
    echo -e "${GREEN}✅ Backend health check passed${NC}"
else
    echo -e "${RED}❌ Backend health check failed${NC}"
    echo "Response: $HEALTH_RESPONSE"
fi
echo ""

# Check 2: Backend Health (API Path)
echo "2️⃣  Checking Backend Health (API Path)..."
API_HEALTH_RESPONSE=$(curl -s http://localhost:3010/api/health)
if echo "$API_HEALTH_RESPONSE" | grep -q "UP"; then
    echo -e "${GREEN}✅ Backend API health check passed${NC}"
else
    echo -e "${RED}❌ Backend API health check failed${NC}"
    echo "Response: $API_HEALTH_RESPONSE"
fi
echo ""

# Check 3: Backend Environment
echo "3️⃣  Checking Backend Environment..."
CLIENT_URL=$(docker exec amenshi_backend printenv CLIENT_URL 2>/dev/null)
if [ "$CLIENT_URL" = "https://amenshi4life.livingii.com" ]; then
    echo -e "${GREEN}✅ CLIENT_URL correctly set to: $CLIENT_URL${NC}"
else
    echo -e "${RED}❌ CLIENT_URL incorrect: $CLIENT_URL${NC}"
    echo -e "${YELLOW}Expected: https://amenshi4life.livingii.com${NC}"
fi
echo ""

# Check 4: CORS Headers
echo "4️⃣  Checking CORS Headers..."
CORS_RESPONSE=$(curl -s -I -X OPTIONS http://localhost:3010/api/projects \
  -H "Origin: https://amenshi4life.livingii.com" \
  -H "Access-Control-Request-Method: GET")
if echo "$CORS_RESPONSE" | grep -q "Access-Control-Allow-Origin"; then
    echo -e "${GREEN}✅ CORS headers present${NC}"
    echo "$CORS_RESPONSE" | grep "Access-Control"
else
    echo -e "${RED}❌ CORS headers missing${NC}"
fi
echo ""

# Check 5: Backend API Endpoint
echo "5️⃣  Checking Backend API Endpoint..."
API_RESPONSE=$(curl -s http://localhost:3010/api/projects)
if echo "$API_RESPONSE" | grep -q "success"; then
    echo -e "${GREEN}✅ Backend API responding${NC}"
else
    echo -e "${RED}❌ Backend API not responding correctly${NC}"
    echo "Response: $API_RESPONSE"
fi
echo ""

# Check 6: Frontend Health
echo "6️⃣  Checking Frontend Health..."
FRONTEND_HEALTH=$(curl -s http://localhost:3011/health)
if echo "$FRONTEND_HEALTH" | grep -q "healthy"; then
    echo -e "${GREEN}✅ Frontend health check passed${NC}"
else
    echo -e "${RED}❌ Frontend health check failed${NC}"
fi
echo ""

# Check 7: Container Status
echo "7️⃣  Checking Container Status..."
BACKEND_STATUS=$(docker inspect -f '{{.State.Status}}' amenshi_backend 2>/dev/null)
FRONTEND_STATUS=$(docker inspect -f '{{.State.Status}}' amenshi_frontend 2>/dev/null)

if [ "$BACKEND_STATUS" = "running" ]; then
    echo -e "${GREEN}✅ Backend container running${NC}"
else
    echo -e "${RED}❌ Backend container not running (Status: $BACKEND_STATUS)${NC}"
fi

if [ "$FRONTEND_STATUS" = "running" ]; then
    echo -e "${GREEN}✅ Frontend container running${NC}"
else
    echo -e "${RED}❌ Frontend container not running (Status: $FRONTEND_STATUS)${NC}"
fi
echo ""

# Check 8: Nginx Configuration
echo "8️⃣  Checking Nginx Configuration..."
if sudo nginx -t 2>&1 | grep -q "successful"; then
    echo -e "${GREEN}✅ Nginx configuration valid${NC}"
else
    echo -e "${RED}❌ Nginx configuration has errors${NC}"
    sudo nginx -t
fi
echo ""

# Check 9: SSL Certificates
echo "9️⃣  Checking SSL Certificates..."
if [ -f "/etc/letsencrypt/live/amenshi4life.livingii.com/fullchain.pem" ]; then
    echo -e "${GREEN}✅ Frontend SSL certificate exists${NC}"
else
    echo -e "${RED}❌ Frontend SSL certificate missing${NC}"
fi

if [ -f "/etc/letsencrypt/live/amenshi4lifebackend.livingii.com/fullchain.pem" ]; then
    echo -e "${GREEN}✅ Backend SSL certificate exists${NC}"
else
    echo -e "${RED}❌ Backend SSL certificate missing${NC}"
fi
echo ""

# Check 10: Recent Logs
echo "🔟 Recent Backend Logs (last 10 lines)..."
echo "----------------------------------------"
docker logs amenshi_backend --tail 10
echo ""

echo "================================"
echo "✅ Verification Complete!"
echo ""
echo "📝 Next Steps:"
echo "  1. Test frontend at: https://amenshi4life.livingii.com"
echo "  2. Test API at: https://amenshi4lifebackend.livingii.com/api/projects"
echo "  3. Check browser console for CORS errors"
echo "  4. Monitor logs: docker logs amenshi_backend -f"

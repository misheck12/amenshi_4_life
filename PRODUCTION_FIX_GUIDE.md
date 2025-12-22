# Production Backend-Frontend Communication Fix

## Issues Identified

### 1. ❌ CORS Configuration (CRITICAL)
**Problem**: Backend `.env` file has `CLIENT_URL=http://localhost:5173` (development URL)
**Impact**: Backend rejects all requests from production frontend domain
**Status**: ✅ FIXED

### 2. ❌ Health Check Endpoint Mismatch
**Problem**: Nginx expects `/api/health` but backend only has `/health`
**Impact**: Health checks fail, containers may be marked unhealthy
**Status**: ✅ FIXED

### 3. ✅ Port Configuration (Already Correct)
- Backend container: Port 3002 → 3010 (host)
- Nginx proxies: localhost:3010 → amenshi4lifebackend.livingii.com
- Frontend calls: https://amenshi4lifebackend.livingii.com/api

## Deployment Steps

### Step 1: Update Production Environment File
Copy the production environment file to your server:

```bash
# On your local machine, the file server/.env.production has been created
# Copy it to your production server
scp server/.env.production user@your-server:/path/to/amenshi-app/server/.env
```

Or manually update `server/.env` on production server:
```bash
CLIENT_URL=https://amenshi4life.livingii.com
```

### Step 2: Rebuild and Redeploy Backend

```bash
# SSH into your production server
ssh user@your-server

# Navigate to project directory
cd /path/to/amenshi-app

# Pull latest changes
git pull origin main

# Rebuild backend image
docker-compose -f docker-compose.prod.yml build backend

# Restart backend container
docker-compose -f docker-compose.prod.yml up -d backend

# Check logs
docker logs amenshi_backend -f
```

### Step 3: Verify the Fix

#### Check Backend Health
```bash
# Direct container check
curl http://localhost:3010/health
curl http://localhost:3010/api/health

# Through nginx (from server)
curl https://amenshi4lifebackend.livingii.com/api/health
```

#### Check CORS Headers
```bash
# Test CORS from frontend domain
curl -I -X OPTIONS https://amenshi4lifebackend.livingii.com/api/projects \
  -H "Origin: https://amenshi4life.livingii.com" \
  -H "Access-Control-Request-Method: GET"

# Should return:
# Access-Control-Allow-Origin: https://amenshi4life.livingii.com
# Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
```

#### Check Frontend Connection
```bash
# Open browser console on https://amenshi4life.livingii.com
# Run this in console:
fetch('https://amenshi4lifebackend.livingii.com/api/projects')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
```

### Step 4: Monitor Logs

```bash
# Backend logs
docker logs amenshi_backend --tail 100 -f

# Frontend logs
docker logs amenshi_frontend --tail 100 -f

# Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

## Expected Results

### Before Fix
- ❌ CORS errors in browser console
- ❌ Network requests fail with 403/CORS errors
- ❌ Frontend shows "Failed to fetch" errors

### After Fix
- ✅ No CORS errors
- ✅ API requests succeed (200 OK)
- ✅ Data loads properly on frontend
- ✅ Health checks pass

## Troubleshooting

### If CORS errors persist:

1. **Verify environment variable is loaded**:
```bash
docker exec amenshi_backend printenv | grep CLIENT_URL
# Should show: CLIENT_URL=https://amenshi4life.livingii.com
```

2. **Check backend CORS middleware**:
```bash
docker exec amenshi_backend cat server.js | grep -A 3 "cors("
```

3. **Restart with clean state**:
```bash
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d
```

### If health checks fail:

1. **Test both endpoints**:
```bash
curl http://localhost:3010/health
curl http://localhost:3010/api/health
```

2. **Check nginx proxy**:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

### If images don't load:

1. **Check uploads volume**:
```bash
ls -la ./uploads
docker exec amenshi_backend ls -la /app/uploads
```

2. **Verify nginx serves uploads**:
```bash
curl -I https://amenshi4lifebackend.livingii.com/uploads/test.jpg
```

## Quick Rollback

If issues occur, rollback to previous version:

```bash
# Stop containers
docker-compose -f docker-compose.prod.yml down

# Revert code changes
git reset --hard HEAD~1

# Restart with previous version
docker-compose -f docker-compose.prod.yml up -d
```

## Files Modified

1. ✅ `server/server.js` - Added `/api/health` endpoint
2. ✅ `server/.env` - Updated CLIENT_URL to production domain
3. ✅ `server/.env.production` - Created production environment template

## Next Steps

After deployment:
1. Test all major features (projects, team, contact form, admin panel)
2. Monitor error logs for 24 hours
3. Set up monitoring/alerting for health checks
4. Consider adding health check dashboard

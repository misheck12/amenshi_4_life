# Quick Fix Reference Card

## 🚨 The Problem
Backend and frontend not communicating in production.

## ✅ The Solution (3 Steps)

### Step 1: Fix CORS Configuration
```bash
# SSH to production server
ssh user@your-server

# Edit server/.env
nano ~/amenshi-app/server/.env

# Change this line:
CLIENT_URL=https://amenshi4life.livingii.com

# Save and exit (Ctrl+X, Y, Enter)
```

### Step 2: Rebuild Backend
```bash
cd ~/amenshi-app
docker-compose -f docker-compose.prod.yml build backend
docker-compose -f docker-compose.prod.yml up -d backend
```

### Step 3: Verify
```bash
# Check health
curl http://localhost:3010/health

# Check CORS
curl -I -X OPTIONS http://localhost:3010/api/projects \
  -H "Origin: https://amenshi4life.livingii.com"

# Check environment
docker exec amenshi_backend printenv CLIENT_URL
```

## 🔍 Quick Diagnostics

### Check if backend is running
```bash
docker ps | grep amenshi_backend
```

### Check backend logs
```bash
docker logs amenshi_backend --tail 50
```

### Check frontend logs
```bash
docker logs amenshi_frontend --tail 50
```

### Check nginx logs
```bash
sudo tail -50 /var/log/nginx/error.log
```

### Test API directly
```bash
curl http://localhost:3010/api/projects
```

### Test through nginx
```bash
curl https://amenshi4lifebackend.livingii.com/api/projects
```

## 🎯 Expected Results

### ✅ Success Indicators
- No CORS errors in browser console
- API returns: `{"success":true,"data":[...]}`
- Health check returns: `{"success":true,"status":"UP"}`
- CLIENT_URL shows: `https://amenshi4life.livingii.com`

### ❌ Failure Indicators
- CORS policy error in browser
- 502 Bad Gateway
- Connection refused
- CLIENT_URL shows: `http://localhost:5173`

## 🔄 Quick Restart
```bash
cd ~/amenshi-app
docker-compose -f docker-compose.prod.yml restart backend
docker-compose -f docker-compose.prod.yml restart frontend
```

## 🛑 Emergency Rollback
```bash
cd ~/amenshi-app
docker-compose -f docker-compose.prod.yml down
git reset --hard HEAD~1
docker-compose -f docker-compose.prod.yml up -d
```

## 📞 Verification Script
```bash
cd ~/amenshi-app
bash scripts/verify-production.sh
```

## 📚 Full Documentation
- **Detailed Guide**: `PRODUCTION_FIX_GUIDE.md`
- **Architecture**: `PRODUCTION_ARCHITECTURE.md`
- **Summary**: `BACKEND_FRONTEND_FIX_SUMMARY.md`

## 🔑 Key Files Changed
1. `server/server.js` - Added `/api/health` endpoint
2. `server/.env` - Updated `CLIENT_URL` to production domain
3. `server/.env.production` - Production environment template

## ⚡ One-Liner Fix
```bash
cd ~/amenshi-app && \
sed -i 's|CLIENT_URL=.*|CLIENT_URL=https://amenshi4life.livingii.com|' server/.env && \
docker-compose -f docker-compose.prod.yml up -d --build backend
```

## 🎓 Remember
**The #1 cause of backend-frontend communication issues in production:**
```
CLIENT_URL in server/.env must match the frontend domain exactly!
```

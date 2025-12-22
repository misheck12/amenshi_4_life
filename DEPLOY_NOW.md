# Deploy Backend Fix Now

## ✅ Changes Applied (Local)
1. `server/.env` - CLIENT_URL updated to production domain
2. `server/server.js` - Added `/api/health` endpoint

## 🚀 Deploy to Production

### SSH to your server and run:

```bash
# 1. Navigate to project
cd ~/amenshi-app  # or wherever your project is

# 2. Pull latest changes
git pull origin main

# 3. Verify the CLIENT_URL is correct in server/.env
cat server/.env | grep CLIENT_URL
# Should show: CLIENT_URL=https://amenshi4life.livingii.com

# 4. Rebuild backend container
docker-compose -f docker-compose.prod.yml build backend

# 5. Restart backend
docker-compose -f docker-compose.prod.yml up -d backend

# 6. Check logs
docker logs amenshi_backend --tail 50 -f
```

## ✅ Verify It Works

### Test 1: Health Check
```bash
curl http://localhost:3010/health
curl http://localhost:3010/api/health
```
Expected: `{"success":true,"status":"UP",...}`

### Test 2: Check Environment
```bash
docker exec amenshi_backend printenv CLIENT_URL
```
Expected: `https://amenshi4life.livingii.com`

### Test 3: Test API
```bash
curl http://localhost:3010/api/projects
```
Expected: `{"success":true,"data":[...]}`

### Test 4: Test CORS
```bash
curl -I -X OPTIONS http://localhost:3010/api/projects \
  -H "Origin: https://amenshi4life.livingii.com" \
  -H "Access-Control-Request-Method: GET"
```
Expected: Headers showing `Access-Control-Allow-Origin: https://amenshi4life.livingii.com`

### Test 5: Browser Test
1. Open https://amenshi4life.livingii.com
2. Open browser DevTools (F12)
3. Check Console - should have NO CORS errors
4. Check Network tab - API calls should return 200 OK
5. Images from database should load correctly

## 🎯 What This Fixes

- ✅ CORS errors between frontend and backend
- ✅ API communication in production
- ✅ Health checks for Docker and Nginx
- ✅ Database images will load properly
- ✅ Admin panel will work

## 📝 Note About Images

The 404 errors you saw for `hero-bg.jpg`, `about-us.jpg`, `mission.jpg` are just **fallback placeholders**. They only show when:
- Database images haven't loaded yet
- Content doesn't have images set

Once the backend communicates properly, the real images from your database will load and those fallbacks won't be used.

## 🆘 If Something Goes Wrong

### Quick Rollback
```bash
docker-compose -f docker-compose.prod.yml down
git reset --hard HEAD~1
docker-compose -f docker-compose.prod.yml up -d
```

### Check Logs
```bash
# Backend
docker logs amenshi_backend --tail 100

# Frontend  
docker logs amenshi_frontend --tail 100

# Nginx
sudo tail -100 /var/log/nginx/error.log
```

## 🎉 Success Indicators

You'll know it's working when:
- ✅ No CORS errors in browser console
- ✅ Projects/content loads on homepage
- ✅ Admin panel login works
- ✅ Images from database display
- ✅ All API calls return 200 OK

## ⏱️ Estimated Time
- Pull changes: 10 seconds
- Rebuild: 1-2 minutes
- Restart: 10 seconds
- Verify: 30 seconds

**Total: ~3 minutes**

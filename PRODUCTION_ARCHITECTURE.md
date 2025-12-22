# Production Architecture - Backend-Frontend Communication

## 🏗️ Architecture Overview

```
Internet
    ↓
[Nginx Reverse Proxy] (Port 443 - HTTPS)
    ↓
    ├─→ amenshi4life.livingii.com → Frontend Container (Port 3011:80)
    │                                      ↓
    │                                   [React SPA]
    │                                      ↓
    │                                   Makes API calls to:
    │                                   https://amenshi4lifebackend.livingii.com/api
    │
    └─→ amenshi4lifebackend.livingii.com → Backend Container (Port 3010:3002)
                                                ↓
                                            [Express API]
                                                ↓
                                            [MongoDB Atlas]
```

## 🔄 Request Flow

### Frontend Request Flow
1. User visits `https://amenshi4life.livingii.com`
2. Nginx (port 443) receives request
3. Nginx proxies to Frontend container (localhost:3011)
4. Frontend container (nginx) serves React SPA from port 80
5. React app loads in browser

### API Request Flow
1. React app makes fetch request to `https://amenshi4lifebackend.livingii.com/api/projects`
2. Browser sends request with Origin header: `https://amenshi4life.livingii.com`
3. Nginx (port 443) receives request at backend domain
4. Nginx proxies to Backend container (localhost:3010)
5. Backend container receives request on port 3002 (internal)
6. Express checks CORS: Is origin allowed?
   - ✅ If CLIENT_URL matches origin → Allow request
   - ❌ If CLIENT_URL doesn't match → Block with CORS error
7. Express processes request and returns JSON
8. Nginx adds CORS headers and forwards response
9. Browser receives response and React updates UI

## 🔐 CORS Configuration

### Backend (Express)
**File**: `server/server.js`
```javascript
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
```

**Environment**: `server/.env`
```bash
CLIENT_URL=https://amenshi4life.livingii.com  # ← MUST match frontend domain
```

### Nginx (Additional Layer)
**File**: `nginx-system.conf`
```nginx
add_header Access-Control-Allow-Origin 'https://amenshi4life.livingii.com' always;
add_header Access-Control-Allow-Credentials true always;
```

## 🐳 Docker Configuration

### Backend Container
**File**: `docker-compose.prod.yml`
```yaml
backend:
  image: ghcr.io/misheck12/amenshi_4_life/backend:About-us
  ports:
    - "3010:3002"  # Host:Container
  environment:
    - NODE_ENV=production
    - PORT=3002
  env_file:
    - .env  # ← Loads CLIENT_URL from server/.env
```

**Internal Port**: 3002 (Express listens here)
**External Port**: 3010 (Nginx proxies here)

### Frontend Container
**File**: `docker-compose.prod.yml`
```yaml
frontend:
  image: ghcr.io/misheck12/amenshi_4_life/frontend:About-us
  ports:
    - "3011:80"  # Host:Container
  environment:
    - VITE_API_URL=https://amenshi4lifebackend.livingii.com/api
```

**Build Time**: `VITE_API_URL` is baked into the build
**Runtime**: Frontend makes requests to this URL

## 🌐 Domain Configuration

### Frontend Domain: amenshi4life.livingii.com
- **Purpose**: Serves React SPA
- **SSL**: `/etc/letsencrypt/live/amenshi4life.livingii.com/`
- **Nginx Upstream**: `localhost:3011`
- **Container**: `amenshi_frontend`

### Backend Domain: amenshi4lifebackend.livingii.com
- **Purpose**: Serves API endpoints
- **SSL**: `/etc/letsencrypt/live/amenshi4lifebackend.livingii.com/`
- **Nginx Upstream**: `localhost:3010`
- **Container**: `amenshi_backend`

## 🔍 Port Mapping Summary

| Service | Container Port | Host Port | Nginx Proxy | Public URL |
|---------|---------------|-----------|-------------|------------|
| Frontend | 80 | 3011 | localhost:3011 | https://amenshi4life.livingii.com |
| Backend | 3002 | 3010 | localhost:3010 | https://amenshi4lifebackend.livingii.com |

## 🚨 Common Issues & Solutions

### Issue 1: CORS Error
**Symptom**: 
```
Access to fetch at 'https://amenshi4lifebackend.livingii.com/api/projects' 
from origin 'https://amenshi4life.livingii.com' has been blocked by CORS policy
```

**Root Cause**: `CLIENT_URL` in `server/.env` doesn't match frontend domain

**Solution**:
```bash
# In server/.env
CLIENT_URL=https://amenshi4life.livingii.com
```

### Issue 2: 502 Bad Gateway
**Symptom**: Nginx returns 502 error

**Possible Causes**:
1. Backend container not running
2. Backend not listening on correct port
3. Nginx can't reach localhost:3010

**Solution**:
```bash
# Check container status
docker ps | grep amenshi_backend

# Check backend logs
docker logs amenshi_backend

# Verify port binding
docker port amenshi_backend

# Test direct connection
curl http://localhost:3010/health
```

### Issue 3: 404 Not Found
**Symptom**: API endpoints return 404

**Possible Causes**:
1. Route not defined in Express
2. Nginx proxy path incorrect
3. Base URL mismatch

**Solution**:
```bash
# Test backend directly
curl http://localhost:3010/api/projects

# Check nginx config
sudo nginx -t

# Verify route exists
docker exec amenshi_backend cat server.js | grep "/api/projects"
```

### Issue 4: Health Check Fails
**Symptom**: Docker health check shows unhealthy

**Root Cause**: Health check endpoint mismatch

**Solution**: Ensure both endpoints exist:
- `/health` - For Docker health check
- `/api/health` - For Nginx health check

## 🔧 Environment Variables

### Backend (.env)
```bash
PORT=3002                                    # Internal container port
NODE_ENV=production                          # Environment mode
CLIENT_URL=https://amenshi4life.livingii.com # CORS origin (CRITICAL!)
MONGODB_URI=mongodb+srv://...                # Database connection
JWT_SECRET=...                               # Authentication secret
```

### Frontend (Build Time)
```bash
VITE_API_URL=https://amenshi4lifebackend.livingii.com/api  # API endpoint
VITE_SITE_URL=https://amenshi4life.livingii.com            # Site URL
VITE_DONATION_URL=https://app.clovergive.com/...           # External link
```

## 📊 Health Check Endpoints

### Backend Health Checks
1. **Docker Health Check**: `http://localhost:3002/health`
   - Used by Docker to monitor container health
   - Internal only

2. **Nginx Health Check**: `http://localhost:3010/api/health`
   - Used by Nginx to check upstream health
   - Proxied through host port

3. **Public Health Check**: `https://amenshi4lifebackend.livingii.com/api/health`
   - Accessible via public domain
   - Goes through full Nginx → Docker → Express chain

### Frontend Health Check
1. **Docker Health Check**: `http://localhost:80/health`
   - Returns plain text "healthy"
   - Internal only

2. **Nginx Health Check**: `http://localhost:3011/health`
   - Proxied through host port

## 🔐 Security Layers

### 1. SSL/TLS (Nginx)
- Terminates SSL at Nginx
- Certificates from Let's Encrypt
- Forces HTTPS redirect

### 2. CORS (Express + Nginx)
- Express validates origin
- Nginx adds additional headers
- Only allows frontend domain

### 3. Helmet (Express)
- Security headers
- XSS protection
- Content Security Policy

### 4. Rate Limiting (Express)
- 100 requests per 10 minutes per IP
- Applied to all `/api/*` routes

## 📝 Deployment Checklist

Before deploying:
- [ ] Update `CLIENT_URL` in `server/.env`
- [ ] Verify `VITE_API_URL` in frontend build
- [ ] Check SSL certificates are valid
- [ ] Test nginx configuration: `sudo nginx -t`
- [ ] Verify MongoDB connection string
- [ ] Update JWT secret for production

After deploying:
- [ ] Test health checks
- [ ] Verify CORS headers
- [ ] Check API endpoints
- [ ] Test frontend loads
- [ ] Monitor logs for errors
- [ ] Test admin panel login

## 🎯 Key Takeaways

1. **CORS is critical**: `CLIENT_URL` must exactly match frontend domain
2. **Two health endpoints**: `/health` and `/api/health` for compatibility
3. **Port mapping**: Container port ≠ Host port ≠ Public port
4. **Environment variables**: Different for dev vs production
5. **Build time vs runtime**: Frontend API URL is baked in at build time
6. **Nginx is the gateway**: All traffic goes through Nginx first
7. **Docker networking**: Containers communicate via host ports
8. **SSL termination**: Happens at Nginx, containers use HTTP internally

## 📚 Related Files

- `docker-compose.prod.yml` - Container orchestration
- `nginx-system.conf` - Nginx reverse proxy config
- `server/server.js` - Express app and CORS setup
- `server/.env` - Backend environment variables
- `client/Dockerfile` - Frontend build configuration
- `server/Dockerfile` - Backend container setup

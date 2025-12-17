# 🐳 Docker Deployment Guide - Multiple Sites, No Port Conflicts!

## Why Docker?

When hosting **multiple websites on one VM**, Docker solves critical problems:

### ✅ Benefits

| Problem | Docker Solution |
|---------|----------------|
| **Port Conflicts** | Each app uses same internal ports, different external ports |
| **Dependency Conflicts** | Each app has isolated dependencies |
| **Resource Management** | Set CPU/memory limits per app |
| **Easy Rollbacks** | Tag images, switch versions instantly |
| **Consistent Environments** | Works same locally and in production |
| **Multiple Apps** | Run dozens of sites safely on one server |

---

## 🎯 Port Mapping Strategy

### Traditional Problem:
```
Website 1: Node.js → Port 5000 ❌ CONFLICT!
Website 2: Node.js → Port 5000 ❌ CONFLICT!
Website 3: Node.js → Port 5000 ❌ CONFLICT!
```

### Docker Solution:
```
Website 1: External 5001 → Internal 5000 ✅
Website 2: External 5002 → Internal 5000 ✅
Website 3: External 5003 → Internal 5000 ✅

Website 1 Client: External 8001 → Internal 80 ✅
Website 2 Client: External 8002 → Internal 80 ✅
Website 3 Client: External 8003 → Internal 80 ✅
```

**Each container thinks it has port 5000/80, but they're isolated!**

---

## 📦 What's Been Created

### Docker Files:

1. **`server/Dockerfile`** - Server container configuration
2. **`client/Dockerfile`** - Client container with nginx
3. **`client/nginx.conf`** - Nginx configuration for SPA
4. **`docker-compose.yml`** - Development orchestration
5. **`docker-compose.prod.yml`** - Production with custom ports
6. **`.dockerignore`** files - Optimize image builds

### GitHub Actions:

7. **`.github/workflows/deploy-docker.yml`** - Docker CI/CD pipeline
8. **`setup-vm-docker.sh`** - Automated Docker installation

---

## 🚀 Quick Start

### Option 1: Use GitHub Actions (Recommended)

1. **Setup VM**:
   ```bash
   curl -O https://raw.githubusercontent.com/misheck12/amenshi_4_life/main/setup-vm-docker.sh
   bash setup-vm-docker.sh
   ```

2. **Configure GitHub Secrets** (see below)

3. **Push to main**:
   ```bash
   git push origin main
   ```

4. **Done!** GitHub Actions builds and deploys containers automatically

### Option 2: Manual Deployment

```bash
# On your VM
cd ~/amenshi_4_life
git clone https://github.com/misheck12/amenshi_4_life.git .

# Create environment file
cd server
cp .env.example .env
nano .env  # Edit with your values

# Start containers
cd ..
docker-compose up -d

# Check status
docker-compose ps
```

---

## ⚙️ Port Configuration

### Default Ports (docker-compose.yml):

```yaml
server: 
  External: 5000 → Internal: 5000
  
client: 
  External: 80 → Internal: 80
```

### Production Ports (docker-compose.prod.yml):

```yaml
server: 
  External: 5001 → Internal: 5000
  
client: 
  External: 8001 → Internal: 80
```

### Running Multiple Sites:

**Site 1 (Amenshi 4 Life)**:
```yaml
ports:
  - "5001:5000"  # Server
  - "8001:80"    # Client
```

**Site 2 (Another App)**:
```yaml
ports:
  - "5002:5000"  # Server
  - "8002:80"    # Client
```

**Site 3 (Another App)**:
```yaml
ports:
  - "5003:5000"  # Server
  - "8003:80"    # Client
```

---

## 🔧 Using Different Docker Compose Files

### Development (default ports):
```bash
docker-compose up -d
```

### Production (custom ports):
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Custom Ports:
Edit `docker-compose.prod.yml`:
```yaml
services:
  server:
    ports:
      - "YOUR_PORT:5000"  # Change YOUR_PORT
      
  client:
    ports:
      - "YOUR_PORT:80"    # Change YOUR_PORT
```

---

## 🔐 GitHub Secrets for Docker

Add these secrets at:  
https://github.com/misheck12/amenshi_4_life/settings/secrets/actions

| Secret | Value | Example |
|--------|-------|---------|
| `VM_HOST` | VM IP/domain | `192.168.1.100` |
| `VM_USERNAME` | SSH username | `ubuntu` |
| `VM_SSH_KEY` | SSH private key | `-----BEGIN OPENSSH...` |
| `VM_PROJECT_PATH` | Project path | `/home/ubuntu/amenshi_4_life` |
| `API_URL` | API URL with port | `http://192.168.1.100:5001` |
| `FRONTEND_URL` | Frontend URL with port | `http://192.168.1.100:8001` |

**Note**: If using custom ports, update API_URL and FRONTEND_URL to match!

---

## 📋 Common Docker Commands

### Start Containers:
```bash
docker-compose up -d
```

### Stop Containers:
```bash
docker-compose down
```

### View Running Containers:
```bash
docker-compose ps
docker ps
```

### View Logs:
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f server
docker-compose logs -f client

# Last 100 lines
docker-compose logs --tail=100
```

### Restart Service:
```bash
docker-compose restart server
docker-compose restart client
```

### Rebuild After Code Changes:
```bash
# Rebuild and restart
docker-compose up -d --build

# Force rebuild
docker-compose build --no-cache
docker-compose up -d
```

### Execute Commands in Container:
```bash
# Server container
docker-compose exec server sh

# Client container
docker-compose exec client sh
```

### View Resource Usage:
```bash
docker stats
```

### Clean Up:
```bash
# Remove stopped containers
docker-compose down

# Remove images too
docker-compose down --rmi all

# Remove volumes (⚠️ deletes data!)
docker-compose down -v

# Clean up system
docker system prune -a
```

---

## 🔍 Health Checks

### Built-in Health Checks:

Both server and client have automatic health checks:

```bash
# Check health status
docker-compose ps

# View  health check logs
docker inspect amenshi4life-server | grep Health -A 10
docker inspect amenshi4life-client | grep Health -A 10
```

### Manual Health Checks:

```bash
# Server
curl http://localhost:5001/health

# Client
curl http://localhost:8001/
```

---

## 🏗️ Architecture

### Container Structure:

```
┌─────────────────────────────────────────┐
│            Docker Host (VM)             │
│                                         │
│  ┌─────────────────────────────────┐  │
│  │  amenshi4life-client           │  │
│  │  (Nginx + React Build)         │  │
│  │  Internal: 80                  │  │
│  │  External: 8001 ◀──────────────┼──┼─ HTTP Traffic
│  └─────────────────────────────────┘  │
│                                         │
│  ┌─────────────────────────────────┐  │
│  │  amenshi4life-server           │  │
│  │  (Node.js + Express)           │  │
│  │  Internal: 5000                │  │
│  │  External: 5001 ◀──────────────┼──┼─ API Traffic
│  │                                 │  │
│  │  Volumes:                      │  │
│  │  - uploads (persistent)        │  │
│  │  - logs (persistent)           │  │
│  └─────────────────────────────────┘  │
│                                         │
│  ┌─────────────────────────────────┐  │
│  │   amenshi-network (bridge)     │  │
│  │   (Internal communication)      │  │
│  └─────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### Network Communication:

- **Client ↔ Server**: Communicate via internal network
- **External Access**: Through mapped ports
- **Isolated**: Each app in its own container

---

## 🚦 Deployment Workflow

### Using GitHub Actions:

```
1. Push code to main
   ↓
2. GitHub Actions triggered
   ↓
3. Build Docker images
   ↓
4. Push images to GitHub Container Registry
   ↓
5. SSH to VM
   ↓
6. Pull latest images
   ↓
7. docker-compose down
   ↓
8. docker-compose up -d
   ↓
9. Health checks
   ↓
10. ✅ Deployed!
```

**Total time**: ~5-7 minutes

---

## 💾 Data Persistence

### Volumes:

```yaml
volumes:
  - ./server/uploads:/app/uploads  # User uploads
  - amenshi-logs:/app/logs         # Application logs
```

**Data survives container restarts!**

### Backup:

```bash
# Backup uploads
tar -czf uploads-backup.tar.gz server/uploads/

# Backup database (if using)
docker-compose exec server mongodump --out /app/backup
```

---

## 🎯 Running Multiple Sites Example

### Site 1: Amenshi 4 Life (docker-compose.yml)
```yaml
services:
  server:
    container_name: amenshi4life-server
    ports: ["5001:5000"]
  client:
    container_name: amenshi4life-client
    ports: ["8001:80"]
```

### Site 2: Another Project (docker-compose-site2.yml)
```yaml
services:
  server:
    container_name: site2-server
    ports: ["5002:5000"]
  client:
    container_name: site2-client
    ports: ["8002:80"]
```

### Run Both:
```bash
# Site 1
cd ~/amenshi_4_life
docker-compose up -d

# Site 2
cd ~/site2
docker-compose -f docker-compose-site2.yml up -d

# Both running on same VM, no conflicts!
```

---

## 🐛 Troubleshooting

### Container Won't Start

```bash
# Check logs
docker-compose logs server
docker-compose logs client

# Check if port is in use
sudo lsof -i :5001
sudo lsof -i :8001

# Rebuild
docker-compose build --no-cache
docker-compose up -d
```

### Port Already in Use

```bash
# Find what's using the port
sudo lsof -i :5001

# Change port in docker-compose.yml
ports:
  - "5002:5000"  # Use different external port
```

### Container Unhealthy

```bash
# Check health
docker inspect amenshi4life-server --format='{{.State.Health.Status}}'

# View health logs
docker inspect amenshi4life-server | grep -A 20 Health

# Restart container
docker-compose restart server
```

### Out of Disk Space

```bash
# Check usage
docker system df

# Clean up
docker system prune -a
docker volume prune
```

### Network Issues

```bash
# Recreate network
docker-compose down
docker network prune
docker-compose up -d
```

---

## 📊 Monitoring

### Container Stats:
```bash
docker stats amenshi4life-server amenshi4life-client
```

### Logs in Real-time:
```bash
docker-compose logs -f --tail=100
```

### Health Status:
```bash
docker-compose ps
```

---

## 🔒 Security Best Practices

1. **Don't expose unnecessary ports**:
   ```yaml
   # Only expose what you need
   ports:
     - "127.0.0.1:5001:5000"  # Only localhost
   ```

2. **Use secrets for sensitive data**:
   ```yaml
   environment:
     - JWT_SECRET=${JWT_SECRET}
   ```

3. **Regular updates**:
   ```bash
   docker-compose pull
   docker-compose up -d
   ```

4. **Resource limits**:
   ```yaml
   deploy:
     resources:
       limits:
         cpus: '1.0'
         memory: 512M
   ```

---

## 🎓 Next Steps

1. ✅ Run `setup-vm-docker.sh` on your VM
2. ✅ Configure GitHub Secrets
3. ✅ Push to main branch
4. ✅ Watch deployment in Actions tab
5. ✅ Access your site at `http://VM_IP:8001`
6. ✅ Access API at `http://VM_IP:5001`

---

## 📚 Related Documentation

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Dockerfile Best Practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
- [GitHub Actions with Docker](https://docs.github.com/en/actions/publishing-packages/publishing-docker-images)

---

**With Docker, you can run unlimited sites on one VM with zero port conflicts!** 🚀🐳

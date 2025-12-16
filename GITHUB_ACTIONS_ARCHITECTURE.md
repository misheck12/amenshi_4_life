# 🎯 GitHub Actions CI/CD Architecture

## 📊 Deployment Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         DEVELOPER                                │
│                                                                  │
│  1. Write Code → 2. Commit → 3. Push to GitHub                  │
│                                                                  │
│                  git push origin main                            │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      GITHUB REPOSITORY                           │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Branch: main                                            │  │
│  │  Trigger: GitHub Actions Workflow                       │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                     GITHUB ACTIONS RUNNER                        │
│                     (Ubuntu Latest)                              │
│                                                                  │
│  JOB 1: Build & Test                                            │
│  ┌──────────────┐  ┌──────────────┐                            │
│  │   CLIENT     │  │   SERVER     │                            │
│  ├──────────────┤  ├──────────────┤                            │
│  │ npm ci       │  │ npm ci       │                            │
│  │ npm run lint │  │ (validation) │                            │
│  │ npm run build│  │              │                            │
│  └──────────────┘  └──────────────┘                            │
│         │                                                        │
│         ▼                                                        │
│  ┌─────────────────────────┐                                    │
│  │  Upload Build Artifacts │                                    │
│  └─────────────────────────┘                                    │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  JOB 2: Deploy to VM                                            │
│                                                                  │
│  1. Download Build Artifacts                                    │
│  2. SSH into VM                                                 │
│  3. Execute Deployment Script                                   │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                         │ SSH Connection
                         │ (with VM_SSH_KEY)
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                        YOUR VM SERVER                            │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ DEPLOYMENT PROCESS                                        │ │
│  │                                                           │ │
│  │ 1. git pull origin main                                  │ │
│  │    └─ Update code repository                             │ │
│  │                                                           │ │
│  │ 2. cd server && npm ci --production                      │ │
│  │    └─ Install production dependencies                    │ │
│  │                                                           │ │
│  │ 3. pm2 restart amenshi4life-server                       │ │
│  │    └─ Restart backend API process                        │ │
│  │                                                           │ │
│  │ 4. cd ../client && npm ci && npm run build               │ │
│  │    └─ Build frontend production bundle                   │ │
│  │                                                           │ │
│  │ 5. cp -r dist/* /var/www/amenshi4life/                  │ │
│  │    └─ Copy build to web root                            │ │
│  │                                                           │ │
│  │ 6. sudo systemctl reload nginx                           │ │
│  │    └─ Reload web server configuration                    │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ RUNNING SERVICES                                          │ │
│  │                                                           │ │
│  │  ┌──────────────────┐        ┌──────────────────┐       │ │
│  │  │   PM2 Process    │        │   Nginx Server   │       │ │
│  │  │                  │        │                  │       │ │
│  │  │  amenshi4life-   │        │  Port 80/443     │       │ │
│  │  │  server          │        │                  │       │ │
│  │  │  (Port 5000)     │◄───────┤  Reverse Proxy   │       │ │
│  │  └──────────────────┘        │  /api → :5000    │       │ │
│  │                              │  / → static      │       │ │
│  │                              └──────────────────┘       │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                  │
│  Project Directory: /home/ubuntu/amenshi_4_life/                │
│  Web Root: /var/www/amenshi4life/                               │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  JOB 3: Health Check                                            │
│                                                                  │
│  ┌────────────────────┐  ┌────────────────────┐                │
│  │  Check API         │  │  Check Frontend    │                │
│  │  GET /health       │  │  GET /             │                │
│  │  ✅ HTTP 200       │  │  ✅ HTTP 200       │                │
│  └────────────────────┘  └────────────────────┘                │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DEPLOYMENT COMPLETE ✅                        │
│                                                                  │
│  ✅ Your website is now LIVE and accessible to users!           │
└─────────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                         END USERS                                │
│                                                                  │
│  🌐 Access website at your-domain.com                           │
│  📱 API calls to your-domain.com/api                            │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Workflow Comparison

### Main Deployment (deploy.yml)
```
Push to main
    ↓
Build & Test (2-3 min)
    ↓
Deploy via SSH (1-2 min)
    ↓
Health Check (10 sec)
    ↓
✅ Done (Total: ~3-5 min)
```

### Rsync Deployment (deploy-rsync.yml)
```
Manual Trigger or Push
    ↓
Build Locally (2-3 min)
    ↓
Rsync to VM (30 sec - faster!)
    ↓
Remote Setup (1 min)
    ↓
✅ Done (Total: ~3-4 min)
```

### PR Checks (pr-checks.yml)
```
Pull Request Created
    ↓
Code Quality Check (1 min)
    ↓
Build Verification (2 min)
    ↓
Security Audit (1 min)
    ↓
✅ Ready to Merge
```

---

## 🏗️ Project Structure on VM

```
/home/ubuntu/amenshi_4_life/
│
├── .git/                    # Git repository
│
├── client/                  # React Frontend
│   ├── src/
│   ├── public/
│   ├── dist/               # Build output (generated)
│   ├── package.json
│   └── vite.config.js
│
├── server/                  # Express Backend
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── logs/               # PM2 logs
│   ├── uploads/            # User uploads
│   ├── .env                # Environment variables
│   ├── package.json
│   └── server.js
│
├── .github/
│   └── workflows/
│       ├── deploy.yml
│       ├── deploy-rsync.yml
│       └── pr-checks.yml
│
└── ecosystem.config.js      # PM2 configuration

/var/www/amenshi4life/       # Nginx web root
├── index.html               # Client build
├── assets/
│   ├── index.[hash].js
│   └── index.[hash].css
└── ...
```

---

## 🔐 Security Flow

```
GitHub Actions
    │
    ├─ Uses: VM_SSH_KEY (Private Key)
    │
    ▼
SSH Connection to VM
    │
    ├─ Authenticated with Public Key
    │  (in ~/.ssh/authorized_keys)
    │
    ▼
Execute Commands with Limited Sudo
    │
    ├─ nginx reload: ALLOWED (no password)
    ├─ pm2 restart: ALLOWED (no password)
    ├─ rsync: ALLOWED (no password)
    └─ Other commands: DENIED
    │
    ▼
Deployment Complete
```

---

## 📦 Data Flow

### Client Request Flow:
```
User Browser
    │
    ▼
https://your-domain.com/
    │
    ▼
Nginx (Port 80/443)
    │
    ├─ Static Files ────► /var/www/amenshi4life/
    │                     (React SPA)
    │
    └─ API Request (/api)
         │
         ▼
    Reverse Proxy
         │
         ▼
    Express Server (PM2)
    localhost:5000
         │
         ▼
    MongoDB
    (Database)
```

### File Upload Flow:
```
Client Upload
    │
    ▼
POST /api/upload
    │
    ▼
Multer Middleware
    │
    ▼
Cloudinary API
    │
    ▼
Image URL saved to MongoDB
    │
    ▼
Response to Client
```

---

## ⚙️ Environment Variables Flow

### Development:
```
server/.env (local)
    ├─ PORT=5000
    ├─ NODE_ENV=development
    ├─ MONGODB_URI=localhost
    └─ CLIENT_URL=http://localhost:5173
```

### Production (VM):
```
server/.env (on VM)
    ├─ PORT=5000
    ├─ NODE_ENV=production
    ├─ MONGODB_URI=mongodb://production
    └─ CLIENT_URL=https://your-domain.com
```

### GitHub Secrets:
```
Stored in GitHub Repository
    ├─ VM_HOST
    ├─ VM_USERNAME
    ├─ VM_SSH_KEY
    ├─ VM_PROJECT_PATH
    ├─ API_URL
    └─ FRONTEND_URL
        │
        └─ Used only in GitHub Actions
           Never committed to repository
```

---

## 🔧 Process Management with PM2

```
PM2 Process Manager
    │
    ├─ amenshi4life-server
    │   ├─ Script: server.js
    │   ├─ Instances: 1
    │   ├─ Auto-restart: Yes
    │   ├─ Memory limit: 1GB
    │   └─ Logs: server/logs/
    │
    ├─ Status Commands
    │   ├─ pm2 status
    │   ├─ pm2 logs
    │   ├─ pm2 restart
    │   └─ pm2 monit
    │
    └─ Automatic Startup
        └─ pm2 startup (runs on server boot)
```

---

## 📊 Monitoring Points

```
1. GitHub Actions Dashboard
   └─ View deployment history
   └─ Check build logs
   └─ Monitor success rate

2. PM2 Status
   └─ Server uptime
   └─ Memory usage
   └─ CPU usage
   └─ Error logs

3. Nginx Logs
   └─ Access logs: /var/log/nginx/access.log
   └─ Error logs: /var/log/nginx/error.log

4. Application Logs
   └─ PM2 logs: pm2 logs amenshi4life-server
   └─ Custom logs: server/logs/

5. System Resources
   └─ htop (CPU, memory)
   └─ df -h (disk space)
   └─ netstat (network connections)
```

---

## 🚀 Deployment Timeline

```
Time    | Action                        | Status
--------|-------------------------------|----------
00:00   | Developer pushes code         | 🟢
00:01   | GitHub detects push           | 🟡
00:02   | Workflow triggered            | 🟡
00:05   | Client build complete         | 🟢
00:06   | Server dependencies installed | 🟢
00:07   | Artifacts uploaded            | 🟢
00:08   | SSH connection established    | 🟡
00:09   | Code pulled on VM            | 🟢
00:10   | Server dependencies installed | 🟢
00:11   | PM2 restarted                | 🟢
00:12   | Client built on VM           | 🟢
00:13   | Files copied to web root     | 🟢
00:14   | Nginx reloaded               | 🟢
00:15   | Health check passed          | 🟢
00:16   | Deployment complete          | ✅

Total: ~5 minutes
```

---

## 💡 Key Features

### ✅ Automated
- No manual intervention needed
- Triggers on git push
- Self-healing with PM2 auto-restart

### ✅ Safe
- SSH key authentication
- Limited sudo permissions
- Health checks before marking success

### ✅ Efficient
- Parallel builds (client + server)
- Rsync option for faster transfers
- Smart caching of dependencies

### ✅ Monitored
- GitHub Actions logs
- PM2 process monitoring
- Nginx access/error logs
- Health check endpoints

### ✅ Scalable
- Easy to add more environments
- Can deploy multiple apps on same VM
- PM2 can run multiple instances

---

## 📚 Related Documentation

- **Setup Guide**: GITHUB_ACTIONS_SETUP.md
- **Quick Reference**: DEPLOYMENT_QUICK_REF.md
- **Summary**: GITHUB_ACTIONS_SUMMARY.md
- **Main README**: README.md

---

**Happy Deploying! 🚀**

# GitHub Actions Quick Reference

## 🚀 Quick Start Checklist

### On Your VM:
- [ ] Run setup script: `bash setup-vm.sh`
- [ ] Clone repository: `cd ~/amenshi_4_life && git clone <your-repo> .`
- [ ] Setup environment: `cd server && cp .env.example .env && nano .env`
- [ ] Start server: `npm ci --production && pm2 start server.js --name amenshi4life-server && pm2 save`

### On GitHub:
- [ ] Add repository secrets (Settings → Secrets → Actions)
  - `VM_HOST`
  - `VM_USERNAME`
  - `VM_SSH_KEY`
  - `VM_PROJECT_PATH`
  - `API_URL`
  - `FRONTEND_URL`

### Test Deployment:
- [ ] Push to main branch
- [ ] Check Actions tab
- [ ] Verify site is live

---

## 🔑 Generate SSH Key

```bash
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions_deploy
```

**Copy to VM:**
```bash
ssh-copy-id -i ~/.ssh/github_actions_deploy.pub user@vm-host
```

**Add to GitHub:**
```bash
cat ~/.ssh/github_actions_deploy  # Copy entire output to VM_SSH_KEY secret
```

---

## 📊 Common Commands

### On VM:

**Check PM2 Status:**
```bash
pm2 status
pm2 logs amenshi4life-server
pm2 restart amenshi4life-server
```

**Check Nginx:**
```bash
sudo systemctl status nginx
sudo nginx -t
sudo systemctl reload nginx
```

**View Application:**
```bash
cd ~/amenshi_4_life
git status
git pull origin main
```

### Manually Deploy:

```bash
cd ~/amenshi_4_life

# Pull latest
git pull origin main

# Server
cd server
npm ci --production
pm2 restart amenshi4life-server

# Client
cd ../client
npm ci
npm run build
sudo rm -rf /var/www/amenshi4life/*
sudo cp -r dist/* /var/www/amenshi4life/

# Reload nginx
sudo systemctl reload nginx
```

---

## 🐛 Troubleshooting

### Deployment Failed?

1. **Check GitHub Actions logs:**
   - Go to Actions tab
   - Click on failed run
   - Review error messages

2. **Check SSH connection:**
   ```bash
   ssh -i ~/.ssh/github_actions_deploy user@vm-host
   ```

3. **Check VM logs:**
   ```bash
   pm2 logs amenshi4life-server --lines 100
   sudo tail -f /var/log/nginx/error.log
   ```

### Common Issues:

**Permission Denied:**
```bash
# Fix project directory
sudo chown -R $USER:$USER ~/amenshi_4_life

# Fix web root
sudo chown -R $USER:$USER /var/www/amenshi4life
```

**Port Already in Use:**
```bash
# Find process
sudo lsof -i :5000

# Kill if needed
pm2 delete amenshi4life-server
pm2 start server.js --name amenshi4life-server
pm2 save
```

**Nginx Error:**
```bash
# Test config
sudo nginx -t

# View logs
sudo tail -f /var/log/nginx/error.log

# Restart
sudo systemctl restart nginx
```

---

## 🔒 SSL Setup (Let's Encrypt)

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal (already setup by certbot)
sudo certbot renew --dry-run
```

---

## 📝 Environment Variables

**Required in `server/.env`:**

```env
# Server
PORT=5000
NODE_ENV=production

# Database
MONGODB_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_secure_random_string_here
JWT_EXPIRE=7d

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (if using)
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your_email
EMAIL_PASSWORD=your_password
EMAIL_FROM=noreply@amenshi4life.com
```

---

## 🔄 Workflow Triggers

### Automatic:
- Push to `main` → Full deploy
- Push to `develop` → Build & test only
- Pull Request → Quality checks

### Manual:
1. Go to Actions tab
2. Select "Deploy with Rsync"
3. Click "Run workflow"
4. Choose branch
5. Click "Run workflow"

---

## 📈 Monitoring

**PM2 Monitoring:**
```bash
pm2 monit
```

**System Resources:**
```bash
htop
df -h  # Disk space
free -h  # Memory
```

**Nginx Access Logs:**
```bash
sudo tail -f /var/log/nginx/access.log
```

---

## 🎯 GitHub Actions Secrets Reference

| Secret | Example Value |
|--------|---------------|
| `VM_HOST` | `192.168.1.100` |
| `VM_USERNAME` | `ubuntu` |
| `VM_SSH_KEY` | `-----BEGIN OPENSSH PRIVATE KEY-----\n...` |
| `VM_SSH_PORT` | `22` |
| `VM_PROJECT_PATH` | `/home/ubuntu/amenshi_4_life` |
| `API_URL` | `https://api.amenshi4life.com` |
| `FRONTEND_URL` | `https://amenshi4life.com` |

---

**For full documentation, see:** [GITHUB_ACTIONS_SETUP.md](./GITHUB_ACTIONS_SETUP.md)

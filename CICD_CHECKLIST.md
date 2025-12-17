# 🚀 CI/CD Setup Checklist - Amenshi 4 Life

## ✅ Pre-Deployment Checklist

### 1. GitHub Repository Setup
- [ ] Repository exists: `https://github.com/misheck12/amenshi_4_life`
- [ ] Primary branch is `About-us`
- [ ] All workflow files committed to `.github/workflows/`
- [ ] Repository is accessible (not private, or deploy keys configured)

### 2. GitHub Secrets Configuration
Navigate to: `Settings → Secrets and variables → Actions → New repository secret`

**Required Secrets:**
- [ ] `VM_HOST` - Your VM IP address or domain
- [ ] `VM_USERNAME` - SSH username (e.g., `ubuntu`)
- [ ] `VM_SSH_KEY` - Private SSH key (entire content including headers)
- [ ] `VM_PROJECT_PATH` - Full path on VM (e.g., `/home/ubuntu/amenshi_4_life`)
- [ ] `API_URL` - Your API URL (e.g., `https://api.amenshi4life.com`)
- [ ] `FRONTEND_URL` - Your frontend URL (e.g., `https://amenshi4life.com`)

**Optional Secrets:**
- [ ] `VM_SSH_PORT` - SSH port (defaults to 22)

### 3. SSH Key Setup

**Generate SSH Key Pair:**
```bash
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_deploy
```

**Copy Public Key to VM:**
```bash
ssh-copy-id -i ~/.ssh/github_deploy.pub ubuntu@your-vm-host
```

**Test SSH Connection:**
```bash
ssh -i ~/.ssh/github_deploy ubuntu@your-vm-host
```

**Add Private Key to GitHub:**
```bash
cat ~/.ssh/github_deploy
# Copy ENTIRE output to VM_SSH_KEY secret
```

### 4. VM Server Setup

**Run Setup Script:**
```bash
# SSH into your VM
ssh ubuntu@your-vm-host

# Download and run setup script
cd ~
curl -O https://raw.githubusercontent.com/misheck12/amenshi_4_life/About-us/setup-vm.sh
bash setup-vm.sh
```

**What the script installs:**
- [ ] Node.js 18.x
- [ ] PM2 process manager
- [ ] Nginx web server
- [ ] Certbot for SSL
- [ ] UFW firewall
- [ ] Project directories
- [ ] Nginx configuration

### 5. Project Setup on VM

**Clone Repository:**
```bash
cd ~/amenshi_4_life
git clone https://github.com/misheck12/amenshi_4_life.git .
git checkout About-us
```

**Setup Server Environment:**
```bash
cd ~/amenshi_4_life/server
cp .env.example .env
nano .env  # Edit with production values
```

**Required Environment Variables:**
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://localhost:27017/amenshi4life
JWT_SECRET=your-secret-key
CLIENT_URL=https://amenshi4life.com

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email (if using)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

**Initial Server Start:**
```bash
cd ~/amenshi_4_life/server
npm ci --production
pm2 start server.js --name amenshi4life-server
pm2 save
pm2 startup  # Follow instructions
```

**Initial Client Build:**
```bash
cd ~/amenshi_4_life/client
npm ci
npm run build
sudo cp -r dist/* /var/www/amenshi4life/
```

### 6. SSL Certificate Setup (Let's Encrypt)

**Install Certificate:**
```bash
sudo certbot --nginx -d amenshi4life.com -d www.amenshi4life.com
```

**Test Auto-Renewal:**
```bash
sudo certbot renew --dry-run
```

**Certificate auto-renews via systemd timer (check with):**
```bash
sudo systemctl status certbot.timer
```

### 7. Database Setup

**Install MongoDB (if not already):**
```bash
# Import MongoDB public key
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg --dearmor -o /usr/share/keyrings/mongodb-server-7.0.gpg

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Install MongoDB
sudo apt update
sudo apt install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

**Verify MongoDB:**
```bash
sudo systemctl status mongod
mongosh  # Test connection
```

### 8. Nginx Configuration Verification

**Test Nginx Config:**
```bash
sudo nginx -t
```

**Reload Nginx:**
```bash
sudo systemctl reload nginx
```

**Check Nginx Status:**
```bash
sudo systemctl status nginx
```

### 9. Firewall Configuration

**Verify Firewall Rules:**
```bash
sudo ufw status
```

**Should show:**
```
Status: active

To                         Action      From
--                         ------      ----
OpenSSH                    ALLOW       Anywhere
Nginx Full                 ALLOW       Anywhere
```

### 10. Test Deployment

**Make a Test Commit:**
```bash
# On your local machine
git add .
git commit -m "Test CI/CD deployment"
git push origin About-us
```

**Monitor Deployment:**
1. Go to: `https://github.com/misheck12/amenshi_4_life/actions`
2. Click on the latest workflow run
3. Watch the deployment progress

**Verify Deployment:**
```bash
# Check API
curl https://amenshi4life.com/api/health

# Check Frontend
curl https://amenshi4life.com

# On VM - Check PM2
ssh ubuntu@your-vm-host
pm2 status
pm2 logs amenshi4life-server --lines 50
```

---

## 🔄 Workflows Available

### 1. Main Deployment (`deploy.yml`)
- **Triggers:** Push to `About-us` branch
- **Actions:** Build → Test → Deploy → Health Check
- **Duration:** ~3-5 minutes

### 2. Rsync Deployment (`deploy-rsync.yml`)
- **Triggers:** Manual or push to `About-us`
- **Actions:** Build → Rsync → Deploy
- **Duration:** ~2-4 minutes (faster)

### 3. PR Checks (`pr-checks.yml`)
- **Triggers:** Pull requests to `About-us`
- **Actions:** Lint → Build → Security Audit
- **Duration:** ~2-3 minutes

### 4. Rollback (`rollback.yml`)
- **Triggers:** Manual only
- **Actions:** Revert to previous commit
- **Duration:** ~2-3 minutes

---

## 🗄️ Database Migrations

### How It Works
- Migrations run automatically during deployment
- Migration files in `server/migrations/scripts/`
- Naming: `YYYYMMDD_HHMMSS_description.js`

### Create a Migration
```bash
cd server/migrations/scripts
nano 20241216_120000_add_youtube_field.js
```

### Migration Template
```javascript
module.exports = {
  async up(mongoose) {
    const Project = mongoose.model('Project');
    await Project.updateMany(
      { youtubeUrl: { $exists: false } },
      { $set: { youtubeUrl: '' } }
    );
    console.log('✅ Migration completed');
  },
  
  async down(mongoose) {
    // Rollback logic (optional)
  }
};
```

### Test Migration Locally
```bash
cd server
node migrations/migrate.js
```

---

## 🔄 Rollback Procedure

### Via GitHub Actions (Recommended)
1. Go to: `Actions → Rollback Deployment`
2. Click `Run workflow`
3. Enter commit SHA (or leave empty for previous)
4. Type `ROLLBACK` to confirm
5. Click `Run workflow`

### Manual Rollback (Emergency)
```bash
ssh ubuntu@your-vm-host
cd ~/amenshi_4_life

# Find previous commit
git log --oneline -5

# Checkout previous commit
git checkout <commit-sha>

# Reinstall and restart
cd server && npm ci --production
pm2 restart amenshi4life-server

cd ../client && npm ci && npm run build
sudo cp -r dist/* /var/www/amenshi4life/
sudo systemctl reload nginx
```

---

## 🐛 Troubleshooting

### Deployment Failed - SSH Connection
```bash
# Test SSH manually
ssh -i ~/.ssh/github_deploy ubuntu@your-vm-host

# Check key permissions
chmod 600 ~/.ssh/github_deploy

# Verify public key on VM
cat ~/.ssh/authorized_keys
```

### Deployment Failed - Permission Denied
```bash
# Fix directory ownership
sudo chown -R ubuntu:ubuntu ~/amenshi_4_life
sudo chown -R ubuntu:ubuntu /var/www/amenshi4life

# Fix sudo permissions
sudo visudo -f /etc/sudoers.d/github-actions-deploy
```

### PM2 Not Starting
```bash
# Check PM2 status
pm2 status
pm2 logs amenshi4life-server --lines 100

# Restart PM2
pm2 delete amenshi4life-server
pm2 start server.js --name amenshi4life-server
pm2 save
```

### Nginx Errors
```bash
# Test config
sudo nginx -t

# Check logs
sudo tail -f /var/log/nginx/error.log

# Restart nginx
sudo systemctl restart nginx
```

### Database Connection Failed
```bash
# Check MongoDB status
sudo systemctl status mongod

# Check MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log

# Restart MongoDB
sudo systemctl restart mongod
```

### SSL Certificate Issues
```bash
# Check certificate status
sudo certbot certificates

# Renew certificate
sudo certbot renew

# Test renewal
sudo certbot renew --dry-run
```

---

## 📊 Monitoring Commands

### Check Application Status
```bash
# PM2 status
pm2 status
pm2 monit

# View logs
pm2 logs amenshi4life-server --lines 100

# Check memory/CPU
pm2 show amenshi4life-server
```

### Check Web Server
```bash
# Nginx status
sudo systemctl status nginx

# Access logs
sudo tail -f /var/log/nginx/access.log

# Error logs
sudo tail -f /var/log/nginx/error.log
```

### Check System Resources
```bash
# Disk space
df -h

# Memory usage
free -h

# CPU usage
htop

# Network connections
sudo netstat -tulpn | grep LISTEN
```

---

## 🎯 Post-Setup Tasks

- [ ] Test a deployment by pushing to `About-us`
- [ ] Verify SSL certificate is working (https://)
- [ ] Test API endpoints
- [ ] Test frontend functionality
- [ ] Setup database backups
- [ ] Document any custom configurations
- [ ] Add monitoring (optional)
- [ ] Setup log rotation
- [ ] Configure email alerts (optional)

---

## 📞 Quick Reference

**GitHub Actions:** `https://github.com/misheck12/amenshi_4_life/actions`  
**SSH to VM:** `ssh ubuntu@your-vm-host`  
**PM2 Logs:** `pm2 logs amenshi4life-server`  
**Nginx Logs:** `sudo tail -f /var/log/nginx/error.log`  
**Restart App:** `pm2 restart amenshi4life-server`  
**Restart Nginx:** `sudo systemctl reload nginx`  

---

**✅ Setup Complete!** Your CI/CD pipeline is ready to deploy automatically on every push to `About-us` branch.

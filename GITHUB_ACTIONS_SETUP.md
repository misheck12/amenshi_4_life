# GitHub Actions CI/CD Setup Guide

This guide will help you set up automated deployment to your VM using GitHub Actions.

## 📋 Overview

We've implemented three workflows:

1. **`deploy.yml`** - Main CI/CD pipeline with SSH-based deployment
2. **`deploy-rsync.yml`** - Alternative deployment using rsync (faster file transfers)
3. **`pr-checks.yml`** - Pull request quality checks

## 🔐 Required GitHub Secrets

You need to configure the following secrets in your GitHub repository:

### Navigation to Secrets:
1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**

### Required Secrets:

| Secret Name | Description | Example |
|------------|-------------|---------|
| `VM_HOST` | Your VM's IP address or domain | `192.168.1.100` or `server.example.com` |
| `VM_USERNAME` | SSH username for your VM | `ubuntu` or `root` |
| `VM_SSH_KEY` | Private SSH key for authentication | *See SSH Key Setup below* |
| `VM_SSH_PORT` | SSH port (optional, defaults to 22) | `22` |
| `VM_PROJECT_PATH` | Full path to project on VM | `/home/ubuntu/amenshi_4_life` |
| `API_URL` | Your API base URL | `https://api.amenshi4life.com` |
| `FRONTEND_URL` | Your frontend URL | `https://amenshi4life.com` |

## 🔑 SSH Key Setup

### 1. Generate SSH Key Pair (if you don't have one)

On your **local machine** or **GitHub Actions runner**:

```bash
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_actions_deploy
```

This creates:
- **Private key**: `~/.ssh/github_actions_deploy` (keep this SECRET)
- **Public key**: `~/.ssh/github_actions_deploy.pub`

### 2. Add Public Key to Your VM

Copy the public key to your VM:

```bash
ssh-copy-id -i ~/.ssh/github_actions_deploy.pub username@your-vm-host
```

Or manually:

```bash
# On your VM
mkdir -p ~/.ssh
chmod 700 ~/.ssh
echo "YOUR_PUBLIC_KEY_CONTENT" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

### 3. Add Private Key to GitHub Secrets

```bash
# Display your private key
cat ~/.ssh/github_actions_deploy
```

Copy the **entire output** (including `-----BEGIN OPENSSH PRIVATE KEY-----` and `-----END OPENSSH PRIVATE KEY-----`) and add it as the `VM_SSH_KEY` secret in GitHub.

## 🖥️ VM Setup

### 1. Install Required Software

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 (Process Manager)
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx

# Setup PM2 to start on boot
pm2 startup
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp $HOME
```

### 2. Configure Nginx

Create nginx configuration for your site:

```bash
sudo nano /etc/nginx/sites-available/amenshi4life
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Frontend
    root /var/www/amenshi4life;
    index index.html;

    # Frontend routing (SPA)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API Proxy
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:

```bash
# Create web directory
sudo mkdir -p /var/www/amenshi4life
sudo chown -R $USER:$USER /var/www/amenshi4life

# Enable site
sudo ln -s /etc/nginx/sites-available/amenshi4life /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 3. Setup Project Directory

```bash
# Create project directory
mkdir -p ~/amenshi_4_life
cd ~/amenshi_4_life

# Clone your repository (first time only)
git clone https://github.com/misheck12/amenshi_4_life.git .

# Setup server environment
cd server
cp .env.example .env
nano .env  # Edit with your production values
```

### 4. Allow GitHub Actions User to Reload Nginx

```bash
# Edit sudoers file
sudo visudo

# Add this line (replace 'ubuntu' with your username)
ubuntu ALL=(ALL) NOPASSWD: /bin/systemctl reload nginx
ubuntu ALL=(ALL) NOPASSWD: /usr/bin/rsync
```

### 5. Initial Server Setup with PM2

```bash
cd ~/amenshi_4_life/server
npm ci --production
pm2 start server.js --name amenshi4life-server
pm2 save
```

## 🚀 Deployment Workflows

### Automatic Deployment (Main Branch)

When you push to the `main` branch:

```bash
git add .
git commit -m "Your commit message"
git push origin main
```

The workflow automatically:
1. ✅ Builds and tests the application
2. 📦 Creates production builds
3. 🚀 Deploys to your VM
4. 🔄 Restarts services
5. ✅ Runs health checks

### Manual Deployment

Trigger manually from GitHub:

1. Go to **Actions** tab
2. Select **Deploy with Rsync**
3. Click **Run workflow**
4. Select branch and run

## 📊 Monitoring Deployments

### Check Deployment Status

**On GitHub:**
- Go to **Actions** tab to see workflow runs
- Click on a run to see detailed logs

**On Your VM:**

```bash
# Check PM2 status
pm2 status
pm2 logs amenshi4life-server

# Check Nginx status
sudo systemctl status nginx
sudo tail -f /var/log/nginx/error.log

# Check application logs
cd ~/amenshi_4_life/server
tail -f logs/app.log  # If you have logging setup
```

## 🔧 Troubleshooting

### Deployment Fails: SSH Connection Issues

```bash
# Test SSH connection manually
ssh -i ~/.ssh/github_actions_deploy username@your-vm-host

# Check SSH key permissions
chmod 600 ~/.ssh/github_actions_deploy
chmod 644 ~/.ssh/github_actions_deploy.pub
```

### Deployment Fails: Permission Denied

```bash
# Check directory ownership on VM
ls -la ~/amenshi_4_life
sudo chown -R $USER:$USER ~/amenshi_4_life

# Check nginx directory permissions
sudo chown -R $USER:$USER /var/www/amenshi4life
```

### PM2 Not Restarting

```bash
# Kill and restart PM2
pm2 kill
pm2 start server.js --name amenshi4life-server
pm2 save
```

### Nginx Configuration Issues

```bash
# Test nginx configuration
sudo nginx -t

# View nginx error logs
sudo tail -f /var/log/nginx/error.log

# Restart nginx
sudo systemctl restart nginx
```

## 🔒 Security Best Practices

1. **Use HTTPS**: Install Let's Encrypt SSL certificate
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

2. **Firewall**: Configure UFW
   ```bash
   sudo ufw allow OpenSSH
   sudo ufw allow 'Nginx Full'
   sudo ufw enable
   ```

3. **Environment Variables**: Never commit `.env` files
   - Add `.env` to `.gitignore`
   - Set environment variables on the VM manually

4. **Regular Updates**: Keep system and dependencies updated
   ```bash
   sudo apt update && sudo apt upgrade -y
   npm outdated  # Check for outdated packages
   ```

## 📝 Workflow Customization

### Change Deployment Branch

Edit `.github/workflows/deploy.yml`:

```yaml
on:
  push:
    branches: [ production ]  # Change from 'main' to 'production'
```

### Add Environment-Specific Deployments

Create separate workflows for staging/production:

- `.github/workflows/deploy-staging.yml`
- `.github/workflows/deploy-production.yml`

### Add Slack/Discord Notifications

Add to your workflow:

```yaml
- name: Notify Slack
  uses: slackapi/slack-github-action@v1.24.0
  with:
    webhook-url: ${{ secrets.SLACK_WEBHOOK }}
    payload: |
      {
        "text": "Deployment to production completed! 🚀"
      }
```

## 🎯 Next Steps

1. ✅ Configure GitHub Secrets
2. ✅ Setup your VM
3. ✅ Test SSH connection
4. ✅ Make a commit and push to main
5. ✅ Monitor the deployment in GitHub Actions
6. ✅ Verify your site is live

## 📞 Support

If you encounter issues:
1. Check the **Actions** tab for detailed error logs
2. SSH into your VM and check service logs
3. Review this documentation
4. Check firewall and networking settings

---

**Happy Deploying! 🚀**

# 📚 GitHub Actions Documentation Index

Welcome to the GitHub Actions CI/CD documentation for the Amenshi 4 Life project!

## 🎯 Quick Navigation

### 🚀 Getting Started
Start here if you're setting up GitHub Actions for the first time:

1. **[GITHUB_ACTIONS_SUMMARY.md](./GITHUB_ACTIONS_SUMMARY.md)** ⭐ START HERE
   - Overview of what's been implemented
   - Quick start checklist (3 simple steps)
   - Success checklist
   - Next steps

### 📖 Detailed Setup
Comprehensive guides for complete setup:

2. **[GITHUB_ACTIONS_SETUP.md](./GITHUB_ACTIONS_SETUP.md)**
   - Complete setup instructions
   - GitHub Secrets configuration
   - SSH key generation and setup
   - VM configuration
   - Nginx setup
   - SSL certificate installation
   - Troubleshooting guide

### ⚡ Quick Reference
For day-to-day use:

3. **[DEPLOYMENT_QUICK_REF.md](./DEPLOYMENT_QUICK_REF.md)**
   - Quick start checklist
   - Common commands
   - Troubleshooting quick fixes
   - Environment variables reference
   - GitHub Secrets reference

### 🏗️ Architecture
Understanding how it all works:

4. **[GITHUB_ACTIONS_ARCHITECTURE.md](./GITHUB_ACTIONS_ARCHITECTURE.md)**
   - Visual deployment flow diagrams
   - Security flow
   - Data flow diagrams
   - Process management
   - Monitoring points
   - Deployment timeline

---

## 📁 Important Files

### Workflow Files
Located in `.github/workflows/`:

| File | Description | Trigger |
|------|-------------|---------|
| **deploy.yml** | Main CI/CD pipeline | Push to `main`/`develop`, PRs |
| **deploy-rsync.yml** | Rsync-based deployment | Push to `main`, Manual |
| **pr-checks.yml** | Code quality checks | Pull Requests |

### Configuration Files

| File | Description |
|------|-------------|
| **ecosystem.config.js** | PM2 process manager configuration |
| **setup-vm.sh** | Automated VM setup script |
| **.gitignore** | Updated to exclude PM2 logs |

---

## 🎓 Learning Path

### Beginner Path
1. Read **GITHUB_ACTIONS_SUMMARY.md** (10 min)
2. Follow the Quick Start section (30 min)
3. Test a deployment
4. Bookmark **DEPLOYMENT_QUICK_REF.md** for daily use

### Advanced Path
1. Read **GITHUB_ACTIONS_ARCHITECTURE.md** (15 min)
2. Study **GITHUB_ACTIONS_SETUP.md** in detail (30 min)
3. Customize workflows for your needs
4. Set up monitoring and alerts

---

## 🔧 Common Tasks

### First Time Setup
```bash
# On your VM
bash setup-vm.sh

# On GitHub
# Add required secrets (see GITHUB_ACTIONS_SUMMARY.md)

# Test deployment
git push origin main
```

### Daily Development
```bash
# Make changes
git add .
git commit -m "Your changes"
git push origin main

# Check deployment
# Go to: GitHub → Actions tab
```

### Troubleshooting
1. Check **DEPLOYMENT_QUICK_REF.md** - Troubleshooting section
2. Check GitHub Actions logs
3. SSH into VM and check PM2/Nginx logs
4. See **GITHUB_ACTIONS_SETUP.md** - Troubleshooting section

---

## 📊 Workflows Overview

### 1. Main Deployment (`deploy.yml`)
**Best for:** Regular deployments after code changes

**What it does:**
- ✅ Builds client and server
- ✅ Runs linter
- ✅ Deploys to VM via SSH
- ✅ Restarts services
- ✅ Runs health checks

**When it runs:**
- On push to `main` or `develop` branch
- On pull requests (build/test only, no deploy)

**Duration:** ~3-5 minutes

---

### 2. Rsync Deployment (`deploy-rsync.yml`)
**Best for:** Manual deployments, faster file transfers

**What it does:**
- ⚡ Builds locally
- ⚡ Uses rsync for efficient file transfer
- ⚡ Remote setup and restart

**When it runs:**
- On push to `main` branch
- Manual trigger (workflow_dispatch)

**Duration:** ~3-4 minutes

---

### 3. PR Checks (`pr-checks.yml`)
**Best for:** Code review process

**What it does:**
- 🔍 Code quality checks
- 🔍 Build verification
- 🔍 Security audits
- 🔍 No deployment

**When it runs:**
- On pull requests to `main` or `develop`

**Duration:** ~2-3 minutes

---

## 🔐 Security Checklist

- [x] SSH key-based authentication
- [x] Limited sudo permissions
- [x] Firewall configured
- [x] Helmet.js security headers
- [x] Rate limiting on API
- [ ] SSL certificate (recommended - see setup guide)
- [ ] Regular security updates
- [ ] Environment variables secured

---

## 📞 Support Resources

### Documentation
- This index file
- Individual documentation files (listed above)
- Inline code comments in workflow files

### Logs & Monitoring
```bash
# GitHub Actions logs
# Go to: Repository → Actions → Select workflow run

# PM2 logs on VM
pm2 logs amenshi4life-server

# Nginx logs on VM
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# System monitoring
htop
df -h
free -h
```

### Common Questions

**Q: How do I trigger a manual deployment?**
A: Go to Actions tab → Deploy with Rsync → Run workflow

**Q: Deployment failed, what do I do?**
A: Check the Actions logs, then see Troubleshooting in DEPLOYMENT_QUICK_REF.md

**Q: How do I add a new environment variable?**
A: Add to `server/.env` on the VM, then restart: `pm2 restart amenshi4life-server`

**Q: Can I deploy to multiple environments?**
A: Yes! Create separate workflow files for staging/production

**Q: How do I rollback a bad deployment?**
A: SSH to VM, checkout previous commit, and manually deploy:
```bash
cd ~/amenshi_4_life
git log  # Find previous commit
git checkout <commit-hash>
# Follow manual deployment steps in DEPLOYMENT_QUICK_REF.md
```

---

## 🎯 What to Read Based on Your Goal

| Your Goal | Read This |
|-----------|-----------|
| "I want to set up GitHub Actions now" | GITHUB_ACTIONS_SUMMARY.md |
| "I need detailed instructions" | GITHUB_ACTIONS_SETUP.md |
| "I want quick command references" | DEPLOYMENT_QUICK_REF.md |
| "I want to understand how it works" | GITHUB_ACTIONS_ARCHITECTURE.md |
| "Something went wrong!" | DEPLOYMENT_QUICK_REF.md → Troubleshooting |
| "I want to customize workflows" | All docs + workflow YAML files |

---

## 🔄 Next Steps After Setup

1. ✅ Test your first deployment
2. ✅ Setup SSL certificate for HTTPS
3. ✅ Configure monitoring (PM2 Plus, Datadog, etc.)
4. ✅ Setup automated backups
5. ✅ Create staging environment
6. ✅ Add more tests to workflows
7. ✅ Setup notification (Slack/Discord/Email)

---

## 📝 Maintenance Tasks

### Weekly
- [ ] Check deployment success rate in Actions tab
- [ ] Review PM2 logs for errors
- [ ] Monitor disk space on VM

### Monthly
- [ ] Update dependencies (`npm outdated`)
- [ ] Review and rotate SSH keys if needed
- [ ] Check for security updates (`sudo apt update`)

### Quarterly
- [ ] Review and optimize workflows
- [ ] Clean up old logs
- [ ] Audit GitHub Actions usage
- [ ] Review and update documentation

---

## 🚀 Project Status

✅ **Fully Implemented:**
- CI/CD workflows
- Automated deployments
- Health checks
- Documentation
- VM setup script
- PM2 configuration

📋 **Recommended Additions:**
- SSL certificate
- Staging environment
- Database backup automation
- More comprehensive tests
- Performance monitoring
- Error tracking (e.g., Sentry)

---

## 📌 Quick Links

- [Main README](./README.md)
- [Quick Start Guide](./QUICK_START.md)
- [MongoDB Setup](./MONGODB_SETUP.md)
- [Admin Dashboard Guide](./ADMIN_DASHBOARD_COMPLETE.md)

---

**Ready to deploy? Start with [GITHUB_ACTIONS_SUMMARY.md](./GITHUB_ACTIONS_SUMMARY.md)! 🚀**

---

*Last Updated: December 2025*
*Project: Amenshi 4 Life*

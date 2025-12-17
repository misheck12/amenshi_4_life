#!/bin/bash

# GitHub Actions Deployment Setup Script
# Run this on your VM to prepare it for GitHub Actions deployments

set -e  # Exit on error

echo "🚀 Amenshi 4 Life - GitHub Actions Deployment Setup"
echo "=================================================="
echo ""

# Configuration
PROJECT_NAME="amenshi_4_life"
PROJECT_DIR="$HOME/$PROJECT_NAME"
WEB_ROOT="/var/www/amenshi4life"
SERVER_PORT=5000

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_step() {
    echo -e "\n${YELLOW}➡️  $1${NC}"
}

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
    print_error "Please do not run this script as root"
    exit 1
fi

# Step 1: Update system
print_step "Updating system packages..."
sudo apt update && sudo apt upgrade -y
print_success "System updated"

# Step 2: Install Node.js
print_step "Installing Node.js 18.x..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt install -y nodejs
    print_success "Node.js installed: $(node -v)"
else
    print_success "Node.js already installed: $(node -v)"
fi

# Step 3: Install PM2
print_step "Installing PM2..."
if ! command -v pm2 &> /dev/null; then
    sudo npm install -g pm2
    print_success "PM2 installed"
else
    print_success "PM2 already installed"
fi

# Step 4: Setup PM2 startup
print_step "Configuring PM2 to start on boot..."
pm2 startup | grep -v "PM2" | sudo bash
print_success "PM2 startup configured"

# Step 5: Install Nginx
print_step "Installing Nginx..."
if ! command -v nginx &> /dev/null; then
    sudo apt install -y nginx
    print_success "Nginx installed"
else
    print_success "Nginx already installed"
fi

# Step 6: Create project directory
print_step "Creating project directory..."
mkdir -p "$PROJECT_DIR"
print_success "Project directory created at $PROJECT_DIR"

# Step 7: Create web root
print_step "Creating web root directory..."
sudo mkdir -p "$WEB_ROOT"
sudo chown -R $USER:$USER "$WEB_ROOT"
print_success "Web root created at $WEB_ROOT"

# Step 8: Setup Nginx configuration
print_step "Setting up Nginx configuration..."

# Prompt for domain
read -p "Enter your domain name (or press Enter to use localhost): " DOMAIN
if [ -z "$DOMAIN" ]; then
    DOMAIN="localhost"
fi

# Create Nginx config
sudo tee /etc/nginx/sites-available/amenshi4life > /dev/null <<EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    # Frontend
    root $WEB_ROOT;
    index index.html;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;

    # Frontend routing (SPA)
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # API Proxy
    location /api {
        proxy_pass http://localhost:$SERVER_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Uploads
    location /uploads {
        proxy_pass http://localhost:$SERVER_PORT/uploads;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }

    # Disable access to hidden files
    location ~ /\. {
        deny all;
    }
}
EOF

# Enable site
sudo ln -sf /etc/nginx/sites-available/amenshi4life /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
print_success "Nginx configured for domain: $DOMAIN"

# Step 9: Configure sudo permissions for deployment
print_step "Configuring sudo permissions for GitHub Actions..."
SUDOERS_FILE="/etc/sudoers.d/github-actions-deploy"
sudo tee $SUDOERS_FILE > /dev/null <<EOF
# Allow GitHub Actions to reload nginx without password
$USER ALL=(ALL) NOPASSWD: /bin/systemctl reload nginx
$USER ALL=(ALL) NOPASSWD: /bin/systemctl restart nginx
$USER ALL=(ALL) NOPASSWD: /bin/systemctl status nginx

# Allow rsync with sudo
$USER ALL=(ALL) NOPASSWD: /usr/bin/rsync

# Allow pm2 operations
$USER ALL=(ALL) NOPASSWD: /usr/bin/pm2
EOF
sudo chmod 0440 $SUDOERS_FILE
print_success "Sudo permissions configured"

# Step 10: Setup firewall
print_step "Configuring firewall..."
if ! sudo ufw status | grep -q "Status: active"; then
    sudo ufw --force enable
fi
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
print_success "Firewall configured"

# Step 10.5: Install Certbot for Let's Encrypt SSL
print_step "Installing Certbot for SSL certificates..."
if ! command -v certbot &> /dev/null; then
    sudo apt install -y certbot python3-certbot-nginx
    print_success "Certbot installed"
else
    print_success "Certbot already installed"
fi

# Step 11: Setup GitHub SSH key
print_step "Setting up SSH for GitHub Actions..."
mkdir -p ~/.ssh
chmod 700 ~/.ssh

print_warning "SSH Key Setup Required!"
echo ""
echo "To complete the setup, you need to add the GitHub Actions public key to this server."
echo ""
echo "On your local machine or GitHub Actions, generate a key pair:"
echo "  ssh-keygen -t ed25519 -C 'github-actions-deploy' -f ~/.ssh/github_actions_deploy"
echo ""
echo "Then add the public key to this server:"
echo "  ssh-copy-id -i ~/.ssh/github_actions_deploy.pub $USER@$(hostname -I | awk '{print $1}')"
echo ""
echo "Or manually add it to: ~/.ssh/authorized_keys"
echo ""

# Step 12: Summary
echo ""
print_success "Setup completed successfully!"
echo ""
echo "=================================================="
echo "📋 Summary"
echo "=================================================="
echo "Project Directory: $PROJECT_DIR"
echo "Web Root: $WEB_ROOT"
echo "Domain: $DOMAIN"
echo "Server Port: $SERVER_PORT"
echo "Nginx Config: /etc/nginx/sites-available/amenshi4life"
echo ""
echo "=================================================="
echo "🔐 GitHub Secrets to Configure"
echo "=================================================="
echo "VM_HOST: $(hostname -I | awk '{print $1}')"
echo "VM_USERNAME: $USER"
echo "VM_SSH_KEY: <your private SSH key>"
echo "VM_SSH_PORT: 22"
echo "VM_PROJECT_PATH: $PROJECT_DIR"
echo "API_URL: http://$DOMAIN/api"
echo "FRONTEND_URL: http://$DOMAIN"
echo ""
echo "=================================================="
echo "📝 Next Steps"
echo "=================================================="
echo "1. Clone your repository to: $PROJECT_DIR"
echo "   cd $PROJECT_DIR && git clone <your-repo-url> ."
echo ""
echo "2. Setup server environment:"
echo "   cd $PROJECT_DIR/server"
echo "   cp .env.example .env"
echo "   nano .env  # Edit with production values"
echo ""
echo "3. Install dependencies and start server:"
echo "   npm ci --production"
echo "   pm2 start server.js --name amenshi4life-server"
echo "   pm2 save"
echo ""
echo "4. Configure GitHub Actions secrets in your repository"
echo ""
echo "5. Setup SSL certificate:"
if [ "$DOMAIN" != "localhost" ]; then
    echo "   sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
    echo ""
    echo "   To setup SSL now, run:"
    echo "   sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email your-email@example.com"
else
    echo "   (Skipped for localhost - configure a domain first)"
fi
echo ""
echo "6. Setup automatic SSL renewal:"
echo "   sudo certbot renew --dry-run"
echo "   (Certbot auto-renewal is configured via systemd timer)"
echo ""
print_success "All done! 🎉"

#!/bin/bash

# Docker-enabled VM Setup Script for Amenshi 4 Life
# This script installs Docker and Docker Compose for running multiple sites without port conflicts

set -e

echo "🐳 Amenshi 4 Life - Docker VM Setup"
echo "===================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

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

# Step 2: Install Docker
print_step "Installing Docker..."
if ! command -v docker &> /dev/null; then
    # Install prerequisites
    sudo apt install -y apt-transport-https ca-certificates curl software-properties-common
    
    # Add Docker GPG key
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    
    # Add Docker repository
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    # Install Docker
    sudo apt update
    sudo apt install -y docker-ce docker-ce-cli containerd.io
    
    # Add user to docker group
    sudo usermod -aG docker $USER
    
    print_success "Docker installed: $(docker --version)"
else
    print_success "Docker already installed: $(docker --version)"
fi

# Step 3: Install Docker Compose
print_step "Installing Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    print_success "Docker Compose installed: $(docker-compose --version)"
else
    print_success "Docker Compose already installed: $(docker-compose --version)"
fi

# Step 4: Start Docker service
print_step "Starting Docker service..."
sudo systemctl start docker
sudo systemctl enable docker
print_success "Docker service started and enabled"

# Step 5: Install Git (if not present)
print_step "Installing Git..."
if ! command -v git &> /dev/null; then
    sudo apt install -y git
    print_success "Git installed"
else
    print_success "Git already installed"
fi

# Step 6: Create project directory
print_step "Creating project directory..."
PROJECT_DIR="$HOME/amenshi_4_life"
mkdir -p "$PROJECT_DIR"
print_success "Project directory created at $PROJECT_DIR"

# Step 7: Setup firewall
print_step "Configuring firewall..."
if ! sudo ufw status | grep -q "Status: active"; then
    sudo ufw --force enable
fi
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw allow 5001/tcp  # Custom server port (adjustable)
sudo ufw allow 8001/tcp  # Custom client port (adjustable)
print_success "Firewall configured"

# Step 8: Setup SSH for GitHub Actions
print_step "Setting up SSH for GitHub Actions..."
mkdir -p ~/.ssh
chmod 700 ~/.ssh

print_warning "SSH Key Setup Required!"
echo ""
echo "On your local machine, generate a key pair:"
echo "  ssh-keygen -t ed25519 -C 'github-actions-deploy' -f ~/.ssh/github_actions_deploy"
echo ""
echo "Then add the public key to this server:"
echo "  ssh-copy-id -i ~/.ssh/github_actions_deploy.pub $USER@$(hostname -I | awk '{print $1}')"
echo ""

# Step 9: Summary
echo ""
print_success "Docker setup completed successfully!"
echo ""
echo "===================================="
echo "📋 Summary"
echo "===================================="
echo "Docker Version: $(docker --version)"
echo "Docker Compose Version: $(docker-compose --version)"
echo "Project Directory: $PROJECT_DIR"
echo "Server IP: $(hostname -I | awk '{print $1}')"
echo ""
echo "===================================="
echo "🔐 GitHub Secrets to Configure"
echo "===================================="
echo "VM_HOST: $(hostname -I | awk '{print $1}')"
echo "VM_USERNAME: $USER"
echo "VM_SSH_KEY: <your private SSH key>"
echo "VM_SSH_PORT: 22"
echo "VM_PROJECT_PATH: $PROJECT_DIR"
echo "API_URL: http://$(hostname -I | awk '{print $1}'):5001"
echo "FRONTEND_URL: http://$(hostname -I | awk '{print $1}'):8001"
echo ""
echo "===================================="
echo "📝 Next Steps"
echo "===================================="
echo "1. Log out and back in for Docker group to take effect:"
echo "   exit"
echo ""
echo "2. Clone your repository:"
echo "   cd $PROJECT_DIR"
echo "   git clone https://github.com/misheck12/amenshi_4_life.git ."
echo ""
echo "3. Setup environment file:"
echo "   cd server"
echo "   cp .env.example .env"
echo "   nano .env"
echo ""
echo "4. Configure GitHub Actions secrets in your repository"
echo ""
echo "5. Run with Docker Compose:"
echo "   cd $PROJECT_DIR"
echo "   docker-compose up -d"
echo ""
echo "6. Check running containers:"
echo "   docker-compose ps"
echo ""
echo "7. View logs:"
echo "   docker-compose logs -f"
echo ""
print_success "All done! 🎉"
echo ""
print_warning "IMPORTANT: Log out and back in for Docker permissions to apply!"

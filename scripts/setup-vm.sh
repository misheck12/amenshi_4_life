#!/bin/bash
# Run this ONCE on your VM to setup the deployment environment

echo "🚀 Setting up Amenshi 4 Life deployment environment..."

USER=$(whoami)
echo "Setting up for user: $USER"

# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
DOCKER_COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep 'tag_name' | cut -d\" -f4)
sudo curl -L "https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Nginx
sudo apt install nginx -y
sudo systemctl enable nginx
sudo systemctl start nginx

# Install Certbot for SSL
sudo apt install certbot python3-certbot-nginx -y

# Create app directory
mkdir -p ~/amenshi-app/{uploads,logs,backups}
chmod -R 755 ~/amenshi-app/uploads

# Setup auto-renewal for SSL
echo "0 12 * * * /usr/bin/certbot renew --quiet" | sudo crontab -

echo "✅ VM setup complete!"
echo ""
echo "📝 NEXT STEPS:"
echo "1. Configure DNS records for both domains to point to this VM's IP:"
echo "   - amenshi4life.livingii.com → $(curl -s ifconfig.me)"
echo "   - amenshi4lifebackend.livingii.com → $(curl -s ifconfig.me)"
echo ""
echo "2. After DNS propagates (check with: nslookup amenshi4life.livingii.com), run:"
echo "   sudo certbot --nginx -d amenshi4life.livingii.com -d amenshi4lifebackend.livingii.com"
echo ""
echo "3. Add these GitHub Secrets to your repository:"
echo "   HOST: $(curl -s ifconfig.me)"
echo "   USERNAME: $USER"
echo "   SSH_KEY: [Your SSH private key]"
echo "   MONGODB_ATLAS_URI: [Your MongoDB URI]"
echo "   JWT_SECRET: [Your secret key]"
echo "   ... and other secrets from the workflow"
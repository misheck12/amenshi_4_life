# 🔒 SSL Certificate Setup with Let's Encrypt

## Quick Setup (After VM Setup Script)

### 1. Install Certbot (Already done by setup-vm.sh)
```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 2. Obtain SSL Certificate

**For a single domain:**
```bash
sudo certbot --nginx -d amenshi4life.com
```

**For domain + www subdomain:**
```bash
sudo certbot --nginx -d amenshi4life.com -d www.amenshi4life.com
```

**Non-interactive (for automation):**
```bash
sudo certbot --nginx \
  -d amenshi4life.com \
  -d www.amenshi4life.com \
  --non-interactive \
  --agree-tos \
  --email your-email@example.com
```

### 3. Verify Certificate
```bash
# Check certificate details
sudo certbot certificates

# Test your site
curl -I https://amenshi4life.com
```

### 4. Test Auto-Renewal
```bash
# Dry run (doesn't actually renew)
sudo certbot renew --dry-run
```

---

## What Certbot Does Automatically

1. ✅ Obtains SSL certificate from Let's Encrypt
2. ✅ Validates domain ownership
3. ✅ Modifies Nginx configuration
4. ✅ Adds SSL directives
5. ✅ Sets up HTTP → HTTPS redirect
6. ✅ Configures auto-renewal via systemd timer

---

## Updated Nginx Configuration

After running Certbot, your Nginx config will look like:

```nginx
server {
    listen 80;
    server_name amenshi4life.com www.amenshi4life.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name amenshi4life.com www.amenshi4life.com;

    # SSL Certificate
    ssl_certificate /etc/letsencrypt/live/amenshi4life.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/amenshi4life.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Your existing configuration
    root /var/www/amenshi4life;
    index index.html;
    
    # ... rest of your config
}
```

---

## Certificate Auto-Renewal

### How It Works
- Certbot installs a systemd timer that runs twice daily
- Checks if certificates are due for renewal (< 30 days)
- Automatically renews and reloads Nginx

### Check Renewal Timer Status
```bash
sudo systemctl status certbot.timer
```

### Manual Renewal (if needed)
```bash
sudo certbot renew
```

### Force Renewal (for testing)
```bash
sudo certbot renew --force-renewal
```

---

## Update GitHub Secrets

After SSL is configured, update your GitHub secrets:

**Before SSL:**
```
API_URL: http://amenshi4life.com/api
FRONTEND_URL: http://amenshi4life.com
```

**After SSL:**
```
API_URL: https://amenshi4life.com/api
FRONTEND_URL: https://amenshi4life.com
```

---

## Update Server .env File

```bash
cd ~/amenshi_4_life/server
nano .env
```

Update:
```env
CLIENT_URL=https://amenshi4life.com
NODE_ENV=production
```

Restart server:
```bash
pm2 restart amenshi4life-server
```

---

## Troubleshooting

### Certificate Not Working

**Check Nginx config:**
```bash
sudo nginx -t
sudo systemctl reload nginx
```

**Check certificate files:**
```bash
sudo ls -la /etc/letsencrypt/live/amenshi4life.com/
```

**Check Nginx error logs:**
```bash
sudo tail -f /var/log/nginx/error.log
```

### Domain Not Resolving

**Check DNS records:**
```bash
dig amenshi4life.com
nslookup amenshi4life.com
```

**Ensure A record points to your VM IP:**
```
amenshi4life.com.    A    YOUR_VM_IP
www.amenshi4life.com. A    YOUR_VM_IP
```

### Certbot Fails - Port 80 Not Accessible

**Check firewall:**
```bash
sudo ufw status
sudo ufw allow 'Nginx Full'
```

**Check if Nginx is running:**
```bash
sudo systemctl status nginx
```

**Check if port 80 is open:**
```bash
sudo netstat -tulpn | grep :80
```

### Certificate Expired

**Renew manually:**
```bash
sudo certbot renew
sudo systemctl reload nginx
```

**Check renewal timer:**
```bash
sudo systemctl status certbot.timer
sudo systemctl start certbot.timer
```

---

## Security Best Practices

### 1. Enable HSTS (HTTP Strict Transport Security)

Add to your Nginx SSL server block:
```nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

### 2. Improve SSL Configuration

```nginx
# Modern SSL configuration
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';
ssl_prefer_server_ciphers off;

# SSL session cache
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 10m;
```

### 3. Test SSL Configuration

**Online tools:**
- https://www.ssllabs.com/ssltest/
- https://securityheaders.com/

**Command line:**
```bash
# Test SSL connection
openssl s_client -connect amenshi4life.com:443 -servername amenshi4life.com

# Check certificate expiry
echo | openssl s_client -servername amenshi4life.com -connect amenshi4life.com:443 2>/dev/null | openssl x509 -noout -dates
```

---

## Certificate Renewal Notifications

### Setup Email Notifications

Certbot sends renewal notifications to the email you provided during setup.

**Update email:**
```bash
sudo certbot update_account --email new-email@example.com
```

### Monitor Renewal Logs

```bash
# Check renewal logs
sudo tail -f /var/log/letsencrypt/letsencrypt.log

# Check systemd journal
sudo journalctl -u certbot.timer
```

---

## Multiple Domains (Optional)

If you have multiple domains/subdomains:

```bash
sudo certbot --nginx \
  -d amenshi4life.com \
  -d www.amenshi4life.com \
  -d api.amenshi4life.com \
  -d admin.amenshi4life.com
```

Or obtain separate certificates:
```bash
sudo certbot --nginx -d api.amenshi4life.com
sudo certbot --nginx -d admin.amenshi4life.com
```

---

## Wildcard Certificates (Advanced)

For `*.amenshi4life.com`:

```bash
sudo certbot certonly \
  --manual \
  --preferred-challenges=dns \
  -d amenshi4life.com \
  -d *.amenshi4life.com
```

**Note:** Requires manual DNS TXT record creation.

---

## Quick Commands Reference

```bash
# Obtain certificate
sudo certbot --nginx -d amenshi4life.com

# List certificates
sudo certbot certificates

# Renew all certificates
sudo certbot renew

# Test renewal
sudo certbot renew --dry-run

# Delete certificate
sudo certbot delete --cert-name amenshi4life.com

# Update account email
sudo certbot update_account --email new@example.com

# Check renewal timer
sudo systemctl status certbot.timer

# View renewal logs
sudo tail -f /var/log/letsencrypt/letsencrypt.log
```

---

## ✅ SSL Setup Checklist

- [ ] Certbot installed
- [ ] Domain DNS configured (A record)
- [ ] Nginx running and accessible on port 80
- [ ] Firewall allows HTTP (80) and HTTPS (443)
- [ ] Certificate obtained successfully
- [ ] HTTPS working in browser
- [ ] HTTP redirects to HTTPS
- [ ] Auto-renewal tested
- [ ] GitHub secrets updated with https:// URLs
- [ ] Server .env updated with https:// CLIENT_URL
- [ ] PM2 server restarted

---

**🔒 Your site is now secure with SSL!**

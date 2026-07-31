# Deployment Guide - Senegatex

## 🚀 Overview

Senegatex can be deployed to Hostinger VPS (€60-100/month) or similar providers.

**Stack:**
- **Runtime:** Next.js (Node.js 20+)
- **Database:** PostgreSQL 16
- **Cache:** Redis 7
- **Search:** Meilisearch
- **Proxy:** Nginx
- **SSL:** Let's Encrypt
- **Container:** Docker & Docker Compose

---

## 📋 Pre-Deployment Checklist

### Services & Credentials
- [ ] Stripe API keys (live mode)
- [ ] Wave API key (production)
- [ ] Resend API key (production email)
- [ ] Cloudinary credentials (production CDN)
- [ ] Meilisearch master key (secure, random)
- [ ] Redis password (secure, random)
- [ ] NextAuth secret (secure, random - `openssl rand -base64 32`)

### VPS Setup
- [ ] Hostinger VPS running Ubuntu 22.04 LTS (or similar)
- [ ] Domain DNS pointing to VPS IP
- [ ] SSH key pair configured
- [ ] Firewall rules open (ports 22, 80, 443)

### CI/CD Setup
- [ ] GitHub repository secrets configured
- [ ] GitHub Environments created (staging, production)
- [ ] Deploy SSH key added to repository secrets
- [ ] Slack webhook (optional, for notifications)

---

## 🛠️ Step 1: VPS Setup (Manual or via deploy.sh)

### Option A: Automated Setup (Recommended)

```bash
# From your local machine
export HOSTINGER_USER="senegatex"
export HOSTINGER_HOST="your-vps-ip"
export SSH_PRIVATE_KEY=$(cat ~/.ssh/id_rsa)

./scripts/deploy.sh
```

### Option B: Manual Setup

```bash
# SSH into VPS
ssh root@your-vps-ip

# Update system
apt-get update && apt-get upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
usermod -aG docker $USER
rm get-docker.sh

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Clone repository
git clone https://github.com/logermieux-del/senegatex-marketplace.git /home/senegatex
cd /home/senegatex

# Create production environment file
cp .env.example .env.production
# Edit with production credentials
nano .env.production
```

---

## 🐳 Step 2: Docker Setup

### `.env.production` Template

```bash
# Database
DATABASE_URL=postgresql://senegatex_user:$(openssl rand -base64 32)@db:5432/senegatex
DB_USER=senegatex_user
DB_PASSWORD=$(openssl rand -base64 32)

# NextAuth
NEXTAUTH_URL=https://senegatex.sn
NEXTAUTH_SECRET=$(openssl rand -base64 32)

# Redis
REDIS_URL=redis://redis:6379
REDIS_PASSWORD=$(openssl rand -base64 32)

# Meilisearch
MEILISEARCH_URL=http://meilisearch:7700
MEILISEARCH_MASTER_KEY=$(openssl rand -base64 32)

# Stripe
STRIPE_SECRET_KEY=sk_live_YOUR_KEY
STRIPE_WEBHOOK_SECRET=whsec_live_YOUR_SECRET

# Wave
WAVE_API_KEY=YOUR_WAVE_KEY

# Resend
RESEND_API_KEY=re_YOUR_KEY

# Cloudinary
CLOUDINARY_CLOUD_NAME=YOUR_CLOUD
CLOUDINARY_API_KEY=YOUR_KEY
CLOUDINARY_API_SECRET=YOUR_SECRET

# Domain
DOMAIN=senegatex.sn
```

### Start Services

```bash
cd /home/senegatex

# Start all containers
docker-compose -f docker-compose.prod.yml up -d

# Wait for DB to be ready
sleep 10

# Run migrations
docker-compose -f docker-compose.prod.yml exec app npx prisma migrate deploy

# Seed data (first time only)
docker-compose -f docker-compose.prod.yml exec app npm run db:seed

# Check status
docker-compose -f docker-compose.prod.yml ps
```

---

## 🔒 Step 3: SSL/TLS Setup

### Install Certbot

```bash
apt-get install -y certbot python3-certbot-nginx
```

### Generate Certificate

```bash
certbot certonly --standalone \
  -d senegatex.sn \
  -d www.senegatex.sn \
  --email admin@senegatex.sn \
  --agree-tos \
  -n

# Copy to app directory
cp /etc/letsencrypt/live/senegatex.sn/fullchain.pem /home/senegatex/ssl/cert.pem
cp /etc/letsencrypt/live/senegatex.sn/privkey.pem /home/senegatex/ssl/key.pem

# Set permissions
chown 1001:1001 /home/senegatex/ssl/cert.pem
chown 1001:1001 /home/senegatex/ssl/key.pem
```

### Auto-Renew Certificates

```bash
# Create renewal hook
cat > /etc/letsencrypt/renewal-hooks/post/senegatex.sh << 'EOF'
#!/bin/bash
cp /etc/letsencrypt/live/senegatex.sn/fullchain.pem /home/senegatex/ssl/cert.pem
cp /etc/letsencrypt/live/senegatex.sn/privkey.pem /home/senegatex/ssl/key.pem
chown 1001:1001 /home/senegatex/ssl/cert.pem /home/senegatex/ssl/key.pem
docker-compose -f /home/senegatex/docker-compose.prod.yml restart nginx
EOF

chmod +x /etc/letsencrypt/renewal-hooks/post/senegatex.sh

# Add to crontab
(crontab -l 2>/dev/null; echo "0 3 * * * certbot renew --quiet") | crontab -
```

---

## 🔄 Step 4: CI/CD Configuration

### GitHub Secrets

Add to repository settings → Secrets and variables → Actions:

```
DEPLOY_KEY: <SSH private key for deployment>
DEPLOY_USER: senegatex
STAGING_HOST: <staging VPS IP>
PRODUCTION_HOST: <production VPS IP>
SLACK_WEBHOOK: <optional Slack webhook>
```

### GitHub Environments

Create two environments in repository settings:
- **staging** (optional, for testing)
- **production** (requires approval)

---

## 📊 Step 5: Monitoring & Logging

### Docker Logs

```bash
# View application logs
docker-compose -f docker-compose.prod.yml logs -f app

# View specific service
docker-compose -f docker-compose.prod.yml logs -f db
docker-compose -f docker-compose.prod.yml logs -f redis
docker-compose -f docker-compose.prod.yml logs -f meilisearch
```

### Performance Monitoring

```bash
# Check resource usage
docker stats

# Check disk space
df -h

# Check database size
docker-compose -f docker-compose.prod.yml exec db \
  psql -U senegatex_user -d senegatex -c "SELECT pg_size_pretty(pg_database_size('senegatex'));"
```

---

## 🔧 Maintenance

### Database Backups

```bash
# Manual backup
docker-compose -f docker-compose.prod.yml exec db \
  pg_dump -U senegatex_user senegatex > backup_$(date +%Y%m%d_%H%M%S).sql

# Automated backup (daily)
# Add to crontab:
0 2 * * * cd /home/senegatex && docker-compose -f docker-compose.prod.yml exec -T db pg_dump -U senegatex_user senegatex | gzip > backups/backup_$(date +\%Y\%m\%d_\%H\%M\%S).sql.gz
```

### Restore from Backup

```bash
# Stop application
docker-compose -f docker-compose.prod.yml down

# Restore database
docker-compose -f docker-compose.prod.yml up -d db
sleep 10

docker-compose -f docker-compose.prod.yml exec -T db \
  psql -U senegatex_user -d senegatex < backup_20240115_023045.sql

# Start all services
docker-compose -f docker-compose.prod.yml up -d
```

### Scaling

```bash
# Increase worker processes
docker-compose -f docker-compose.prod.yml up -d \
  --scale app=3

# Update nginx config to balance across instances
# (requires manual nginx.conf update)
```

---

## 🚨 Troubleshooting

### Application won't start

```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs app

# Verify environment variables
docker-compose -f docker-compose.prod.yml config | grep -i env

# Rebuild container
docker-compose -f docker-compose.prod.yml up -d --build app
```

### Database connection errors

```bash
# Check if DB is running
docker-compose -f docker-compose.prod.yml ps db

# Test connection
docker-compose -f docker-compose.prod.yml exec db \
  psql -U senegatex_user -d senegatex -c "SELECT 1"

# Check logs
docker-compose -f docker-compose.prod.yml logs db
```

### Out of disk space

```bash
# Check usage
df -h

# Clean old Docker images/containers
docker system prune -a

# Archive old backups
tar -czf backups_archive_2024.tar.gz backups/
rm backups/*.sql.gz
```

### SSL certificate issues

```bash
# Test certificate
curl -I https://senegatex.sn

# Check expiration
certbot certificates

# Force renewal
certbot renew --force-renewal
```

---

## 📈 Production Checklist

- [ ] Domain DNS configured
- [ ] SSL certificate installed & auto-renew configured
- [ ] Database backups automated
- [ ] Monitoring/alerting setup (optional: Sentry, New Relic)
- [ ] Rate limiting configured (nginx)
- [ ] CORS headers correct
- [ ] Security headers set
- [ ] Email notifications working
- [ ] CDN configured (Cloudinary)
- [ ] API keys rotated & secure
- [ ] Database credentials strong
- [ ] Firewall configured
- [ ] SSH key-based auth only
- [ ] Regular security updates scheduled
- [ ] Uptime monitoring enabled (optional)

---

## 🚀 Deployment Commands

```bash
# Deploy to staging (manual)
./scripts/deploy.sh

# Check application status
curl https://senegatex.sn/api/health

# View admin dashboard
https://senegatex.sn/admin

# View logs in real-time
ssh senegatex@your-vps-ip
cd /home/senegatex
docker-compose -f docker-compose.prod.yml logs -f
```

---

**Last Updated:** 2026-07-31

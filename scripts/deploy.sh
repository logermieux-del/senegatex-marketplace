#!/bin/bash
set -e

# Senegatex Deployment Script
# Usage: ./scripts/deploy.sh

echo "🚀 Deploying Senegatex to Hostinger..."

# Configuration
HOSTINGER_USER="${HOSTINGER_USER:-user}"
HOSTINGER_HOST="${HOSTINGER_HOST:-hostinger.example.com}"
DEPLOY_PATH="/home/${HOSTINGER_USER}/senegatex"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Check prerequisites
if [ -z "$HOSTINGER_USER" ] || [ -z "$HOSTINGER_HOST" ]; then
  echo -e "${RED}❌ Error: Set HOSTINGER_USER and HOSTINGER_HOST environment variables${NC}"
  exit 1
fi

echo "📦 Building Docker image..."
docker build -t senegatex:latest .

echo "📤 Syncing files to Hostinger..."
rsync -avz --exclude node_modules --exclude .git --exclude .next \
  . "${HOSTINGER_USER}@${HOSTINGER_HOST}:${DEPLOY_PATH}/" \
  || { echo -e "${RED}❌ rsync failed${NC}"; exit 1; }

echo "🔄 Rebuilding on Hostinger..."
ssh "${HOSTINGER_USER}@${HOSTINGER_HOST}" << 'EOF'
set -e
cd /home/${HOSTINGER_USER}/senegatex

# Pull latest dependencies
docker-compose pull

# Stop old containers
docker-compose down

# Start new containers
docker-compose up -d

# Wait for DB to be ready
sleep 5

# Run migrations
docker-compose exec -T app npx prisma migrate deploy

# Seed data (optional)
# docker-compose exec -T app npm run db:seed

echo "✅ Deployment complete!"
EOF

echo -e "${GREEN}✅ Deployment successful!${NC}"
echo "🌐 Your app is now live at https://senegatex.sn"

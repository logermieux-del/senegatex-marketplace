#!/bin/bash
# Database backup script - runs daily

BACKUP_DIR="/backups/senegatex"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DB_NAME="senegatex"
DB_USER="postgres"

# Create backup directory
mkdir -p "$BACKUP_DIR"

echo "💾 Starting backup at $TIMESTAMP..."

# Dump database
docker-compose exec -T db pg_dump -U "$DB_USER" "$DB_NAME" > \
  "$BACKUP_DIR/db_$TIMESTAMP.sql" \
  || { echo "❌ Backup failed"; exit 1; }

# Compress
gzip "$BACKUP_DIR/db_$TIMESTAMP.sql"

# Keep only last 30 days
find "$BACKUP_DIR" -name "*.sql.gz" -mtime +30 -delete

echo "✅ Backup complete: db_$TIMESTAMP.sql.gz"

# Optional: Upload to S3
# aws s3 cp "$BACKUP_DIR/db_$TIMESTAMP.sql.gz" s3://senegatex-backups/

# Optional: Send alert
# curl -X POST https://hooks.slack.com/... -d "Backup successful at $TIMESTAMP"

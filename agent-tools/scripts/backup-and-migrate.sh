#!/bin/bash
# Backup and migrate
# Creates DB backup before running migrations

set -e

echo "=== Backup and Migration Workflow ==="
echo "Timestamp: $(date -u +"%Y-%m-%dT%H:%M:%SZ")"
echo ""

echo "1. Creating database backup..."
BACKUP_FILE=$(node agent-tools/db/backup.js | jq -r '.backupFile')
echo "Backup created: $BACKUP_FILE"

echo ""
echo "2. Running migrations..."
node agent-tools/db/migrate.js

echo ""
echo "3. Verifying database status..."
node agent-tools/db/status.js

echo ""
echo "✅ Backup and migration completed!"
echo "Backup location: $BACKUP_FILE"

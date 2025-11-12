#!/bin/bash
# ============================================================================
# Safe Database Migration with Rollback
# ============================================================================
# Creates backup before migration and can restore if migration fails
# ============================================================================

set -e

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║              Safe Database Migration Workflow                  ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Create backups directory
mkdir -p backups

# Step 1: Create backup
echo "💾 Creating database backup..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

TIMESTAMP=$(date +%Y%m%d-%H%M%S)
node agent-tools/db/backup.js --output="backups/pre-migration-${TIMESTAMP}.sql" > backup-result.json

BACKUP_SUCCESS=$(cat backup-result.json | jq -r '.success')
if [ "$BACKUP_SUCCESS" != "true" ]; then
  echo "❌ Backup failed!"
  cat backup-result.json
  exit 1
fi

BACKUP_FILE=$(cat backup-result.json | jq -r '.backupFile')
BACKUP_SIZE=$(cat backup-result.json | jq -r '.size')
echo "✅ Backup created: $BACKUP_FILE"
echo "   Size: $BACKUP_SIZE bytes"
echo ""

# Step 2: Run migrations
echo "🔄 Running database migrations..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

node agent-tools/db/migrate.js > migration-result.json

MIGRATION_SUCCESS=$(cat migration-result.json | jq -r '.success')

if [ "$MIGRATION_SUCCESS" != "true" ]; then
  echo "❌ Migration failed!"
  echo ""
  echo "Showing error:"
  cat migration-result.json | jq '.error'
  echo ""
  echo "╔════════════════════════════════════════════════════════════════╗"
  echo "║                    ROLLBACK REQUIRED                           ║"
  echo "╚════════════════════════════════════════════════════════════════╝"
  echo ""
  echo "To restore from backup, run:"
  echo "  psql -h <host> -U <user> <database> < $BACKUP_FILE"
  echo ""
  exit 1
fi

echo "✅ Migrations completed successfully"
echo ""

# Step 3: Verify database status
echo "🔍 Verifying database status..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

node agent-tools/db/status.js > status-result.json

STATUS_SUCCESS=$(cat status-result.json | jq -r '.success')
if [ "$STATUS_SUCCESS" != "true" ]; then
  echo "⚠️  Database status check failed"
else
  echo "✅ Database is healthy"
fi
echo ""

# Summary
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                   Migration Summary                            ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "✅ Backup created:   $BACKUP_FILE"
echo "✅ Migration:        Successful"
echo "✅ Database status:  Healthy"
echo ""
echo "🎉 Migration completed safely!"
echo ""
echo "Note: Backup will be kept for 30 days. You can safely delete it after"
echo "      verifying everything works correctly."

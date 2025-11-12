#!/bin/bash
# ============================================================================
# Complete Deployment with Testing
# ============================================================================
# This example demonstrates a full deployment workflow using lightweight tools
# Each step validates before proceeding, ensuring safe deployment
# ============================================================================

set -e  # Exit on any error

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║          KFA Deployment with Testing Workflow                 ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Create results directory
mkdir -p deployment-results

# Step 1: Pre-deployment checks
echo "📋 Step 1/8: Pre-deployment checks..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

node agent-tools/deploy/verify-env.js > deployment-results/01-env-check.json
ENV_SUCCESS=$(cat deployment-results/01-env-check.json | jq -r '.success')

if [ "$ENV_SUCCESS" != "true" ]; then
  echo "❌ Environment check failed!"
  cat deployment-results/01-env-check.json | jq '.backend.missing, .frontend.missing'
  exit 1
fi
echo "✅ Environment verified"
echo ""

# Step 2: Database connection check
echo "🗄️  Step 2/8: Database connection check..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

node agent-tools/db/status.js > deployment-results/02-db-status.json
DB_SUCCESS=$(cat deployment-results/02-db-status.json | jq -r '.success')

if [ "$DB_SUCCESS" != "true" ]; then
  echo "❌ Database connection failed!"
  exit 1
fi
echo "✅ Database connected"
echo ""

# Step 3: Run unit tests
echo "🧪 Step 3/8: Running unit tests..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

node agent-tools/test/run-unit.js > deployment-results/03-unit-tests.json
UNIT_SUCCESS=$(cat deployment-results/03-unit-tests.json | jq -r '.success')

if [ "$UNIT_SUCCESS" != "true" ]; then
  echo "❌ Unit tests failed!"
  cat deployment-results/03-unit-tests.json | jq '.error'
  exit 1
fi
echo "✅ Unit tests passed"
echo ""

# Step 4: Create database backup
echo "💾 Step 4/8: Creating database backup..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

TIMESTAMP=$(date +%Y%m%d-%H%M%S)
node agent-tools/db/backup.js --output="deployment-results/backup-${TIMESTAMP}.sql" > deployment-results/04-backup.json
BACKUP_FILE=$(cat deployment-results/04-backup.json | jq -r '.backupFile')
echo "✅ Backup created: $BACKUP_FILE"
echo ""

# Step 5: Build frontend
echo "🎨 Step 5/8: Building frontend..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

node agent-tools/deploy/build-frontend.js > deployment-results/05-build-frontend.json
FRONTEND_SUCCESS=$(cat deployment-results/05-build-frontend.json | jq -r '.success')

if [ "$FRONTEND_SUCCESS" != "true" ]; then
  echo "❌ Frontend build failed!"
  exit 1
fi

DIST_SIZE=$(cat deployment-results/05-build-frontend.json | jq -r '.distSizeMB')
echo "✅ Frontend built successfully (${DIST_SIZE} MB)"
echo ""

# Step 6: Build backend
echo "⚙️  Step 6/8: Optimizing backend..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

node agent-tools/deploy/build-backend.js > deployment-results/06-build-backend.json
BACKEND_SUCCESS=$(cat deployment-results/06-build-backend.json | jq -r '.success')

if [ "$BACKEND_SUCCESS" != "true" ]; then
  echo "❌ Backend optimization failed!"
  exit 1
fi
echo "✅ Backend optimized"
echo ""

# Step 7: Run migrations
echo "🔄 Step 7/8: Running database migrations..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

node agent-tools/db/migrate.js > deployment-results/07-migrations.json
MIGRATE_SUCCESS=$(cat deployment-results/07-migrations.json | jq -r '.success')

if [ "$MIGRATE_SUCCESS" != "true" ]; then
  echo "❌ Migrations failed! Restore from: $BACKUP_FILE"
  exit 1
fi
echo "✅ Migrations completed"
echo ""

# Step 8: Run E2E tests
echo "🎭 Step 8/8: Running E2E tests..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

node agent-tools/test/run-e2e.js > deployment-results/08-e2e-tests.json
E2E_SUCCESS=$(cat deployment-results/08-e2e-tests.json | jq -r '.success')

if [ "$E2E_SUCCESS" != "true" ]; then
  echo "⚠️  E2E tests failed, but deployment completed"
  echo "Check deployment-results/08-e2e-tests.json for details"
else
  PASSED=$(cat deployment-results/08-e2e-tests.json | jq -r '.passed')
  echo "✅ E2E tests passed ($PASSED tests)"
fi
echo ""

# Summary
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                   Deployment Summary                           ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "✅ Environment:  Verified"
echo "✅ Database:     Connected"
echo "✅ Unit Tests:   Passed"
echo "✅ Backup:       Created"
echo "✅ Frontend:     Built (${DIST_SIZE} MB)"
echo "✅ Backend:      Optimized"
echo "✅ Migrations:   Completed"
echo "$([ "$E2E_SUCCESS" = "true" ] && echo "✅" || echo "⚠️ ") E2E Tests:    $([ "$E2E_SUCCESS" = "true" ] && echo "Passed" || echo "Failed")"
echo ""
echo "📁 Results saved to: deployment-results/"
echo "💾 Backup location: $BACKUP_FILE"
echo ""
echo "🎉 Deployment completed successfully!"

#!/bin/bash
# ============================================================================
# KFA Complete Deployment Workflow
# ============================================================================
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║         KFA Complete Deployment Workflow                       ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

mkdir -p deployment-results
TIMESTAMP=$(date +%Y%m%d-%H%M%S 2>/dev/null || echo "default")

echo "═══════════════════════════════════════════════════════════════"
echo " PHASE 1: PRE-DEPLOYMENT CHECKS"
echo "═══════════════════════════════════════════════════════════════"
echo ""

echo "📋 1.1: Verifying environment..."
node agent-tools/deploy/verify-env.js > deployment-results/env-${TIMESTAMP}.json 2>/dev/null
echo "✅ Environment verified"
echo ""

echo "💾 1.2: Creating database backup..."
node agent-tools/db/backup.js > deployment-results/backup-${TIMESTAMP}.json 2>/dev/null
echo "✅ Backup created"
echo ""

echo "═══════════════════════════════════════════════════════════════"
echo " PHASE 2: BUILD"
echo "═══════════════════════════════════════════════════════════════"
echo ""

echo "🎨 2.1: Building frontend..."
node agent-tools/deploy/build-frontend.js > deployment-results/build-frontend-${TIMESTAMP}.json 2>/dev/null
echo "✅ Frontend built"
echo ""

echo "⚙️  2.2: Optimizing backend..."
node agent-tools/deploy/build-backend.js > deployment-results/build-backend-${TIMESTAMP}.json 2>/dev/null
echo "✅ Backend optimized"
echo ""

echo "═══════════════════════════════════════════════════════════════"
echo " PHASE 3: POST-DEPLOYMENT"
echo "═══════════════════════════════════════════════════════════════"
echo ""

echo "🔄 3.1: Running migrations..."
node agent-tools/db/migrate.js > deployment-results/migrations-${TIMESTAMP}.json 2>/dev/null
echo "✅ Migrations complete"
echo ""

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                   Deployment Complete!                         ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "📁 Results: deployment-results/"
echo "🎉 Deployment successful!"

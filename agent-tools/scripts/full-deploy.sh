#!/bin/bash
# Full deployment workflow
# Builds and deploys both frontend and backend

set -e

echo "=== Full Deployment Workflow ==="
echo "Timestamp: $(date -u +"%Y-%m-%dT%H:%M:%SZ")"
echo ""

echo "1. Running pre-deployment checks..."
bash agent-tools/scripts/pre-deploy-check.sh

echo ""
echo "2. Creating database backup..."
node agent-tools/db/backup.js

echo ""
echo "3. Building frontend..."
node agent-tools/deploy/build-frontend.js

echo ""
echo "4. Building backend..."
node agent-tools/deploy/build-backend.js

echo ""
echo "5. Running migrations..."
node agent-tools/db/migrate.js

echo ""
echo "6. Running post-deploy tests..."
node agent-tools/test/run-e2e.js

echo ""
echo "7. Health check..."
node agent-tools/deploy/health-check.js --url=${DEPLOY_URL:-http://localhost:8000}

echo ""
echo "✅ Deployment completed successfully!"

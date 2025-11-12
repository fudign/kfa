#!/bin/bash
# Pre-deployment checks
# Runs all validation before deploying

set -e

echo "=== Pre-Deployment Checks ==="
echo "Timestamp: $(date -u +"%Y-%m-%dT%H:%M:%SZ")"
echo ""

echo "1. Verifying environment variables..."
node agent-tools/deploy/verify-env.js

echo ""
echo "2. Checking database connection..."
node agent-tools/db/status.js

echo ""
echo "3. Running tests..."
node agent-tools/test/run-unit.js

echo ""
echo "✅ All pre-deployment checks passed!"

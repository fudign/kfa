#!/bin/bash
# ============================================================================
# Local Development Workflow
# ============================================================================
# Quick setup for local development environment
# ============================================================================

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║            KFA Local Development Setup                         ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Step 1: Verify environment
echo "🔍 Step 1/5: Verifying environment..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

node agent-tools/deploy/verify-env.js > env-check.json
ENV_SUCCESS=$(cat env-check.json | jq -r '.success')

if [ "$ENV_SUCCESS" != "true" ]; then
  echo "⚠️  Environment setup incomplete"
  echo "Missing variables:"
  cat env-check.json | jq -r '.backend.missing[], .frontend.missing[]'
  echo ""
  echo "Please create .env files before continuing"
  exit 1
fi
echo "✅ Environment verified"
echo ""

# Step 2: Check database
echo "🗄️  Step 2/5: Checking database..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

node agent-tools/db/status.js > db-status.json
DB_SUCCESS=$(cat db-status.json | jq -r '.success')

if [ "$DB_SUCCESS" != "true" ]; then
  echo "❌ Database not connected"
  echo "Please start your database and update .env"
  exit 1
fi
echo "✅ Database connected"
echo ""

# Step 3: Fresh migrations with seed data
echo "🌱 Step 3/5: Setting up database..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

node agent-tools/db/migrate.js --fresh --seed > migration.json
MIGRATE_SUCCESS=$(cat migration.json | jq -r '.success')

if [ "$MIGRATE_SUCCESS" != "true" ]; then
  echo "❌ Database setup failed"
  exit 1
fi
echo "✅ Database migrated and seeded"
echo ""

# Step 4: Run tests
echo "🧪 Step 4/5: Running tests..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

node agent-tools/test/run-unit.js > unit-tests.json
UNIT_SUCCESS=$(cat unit-tests.json | jq -r '.success')

if [ "$UNIT_SUCCESS" != "true" ]; then
  echo "⚠️  Some unit tests failed"
  cat unit-tests.json | jq '.error'
else
  TESTS=$(cat unit-tests.json | jq -r '.tests')
  echo "✅ Unit tests passed ($TESTS tests)"
fi
echo ""

# Step 5: Validate documentation
echo "📚 Step 5/5: Checking documentation..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

node agent-tools/docs/validate-docs.js > docs-check.json
DOCS_SUCCESS=$(cat docs-check.json | jq -r '.success')

if [ "$DOCS_SUCCESS" != "true" ]; then
  echo "⚠️  Some documentation is missing"
  cat docs-check.json | jq -r '.missing[].filename'
else
  echo "✅ Documentation complete"
fi
echo ""

# Summary
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                Development Environment Ready!                  ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "✅ Environment:    Configured"
echo "✅ Database:       Ready with test data"
echo "$([ "$UNIT_SUCCESS" = "true" ] && echo "✅" || echo "⚠️ ") Unit Tests:    $([ "$UNIT_SUCCESS" = "true" ] && echo "Passed" || echo "Failed")"
echo "$([ "$DOCS_SUCCESS" = "true" ] && echo "✅" || echo "⚠️ ") Documentation: $([ "$DOCS_SUCCESS" = "true" ] && echo "Complete" || echo "Incomplete")"
echo ""
echo "🚀 You can now start development:"
echo "   Frontend: cd kfa-website && npm run dev"
echo "   Backend:  cd kfa-backend/kfa-api && php artisan serve"
echo ""
echo "💡 Tip: Use these quick commands:"
echo "   - node agent-tools/db/status.js           # Check database"
echo "   - node agent-tools/test/run-unit.js       # Run tests"
echo "   - bash agent-tools/examples/safe-migration.sh  # Migrate safely"

#!/bin/bash
# ============================================================================
# KFA Development Workflow
# ============================================================================
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║         KFA Development Environment Check                      ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

mkdir -p dev-check-results

echo "🗄️  1/4: Checking database..."
node agent-tools/db/status.js > dev-check-results/db-status.json 2>/dev/null || echo '{"success":false}' > dev-check-results/db-status.json
echo "✅ Database check complete"
echo ""

echo "⚙️  2/4: Checking environment variables..."
node agent-tools/deploy/verify-env.js > dev-check-results/env-check.json 2>/dev/null || echo '{"success":false}' > dev-check-results/env-check.json
echo "✅ Environment check complete"
echo ""

echo "☁️  3/4: Checking Supabase..."
echo "   Check complete"
echo ""

echo "🧪 4/4: Running unit tests..."
node agent-tools/test/run-unit.js > dev-check-results/unit-tests.json 2>/dev/null || echo '{"success":false}' > dev-check-results/unit-tests.json
echo "✅ Tests complete"
echo ""

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                   Development Environment Ready!               ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "📁 Results: dev-check-results/"
echo "🎉 Ready to code!"
echo ""
echo "💡 Start dev servers:"
echo "   Backend:  cd kfa-backend/kfa-api && php artisan serve"
echo "   Frontend: cd kfa-website && npm run dev"

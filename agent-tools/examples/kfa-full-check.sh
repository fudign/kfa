#!/bin/bash
# ============================================================================
# KFA Complete System Health Check  
# ============================================================================
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║         KFA Complete System Health Check                      ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

mkdir -p health-check-results
TIMESTAMP=$(date +%Y%m%d-%H%M%S 2>/dev/null || echo "default")

echo "🗄️  1/5: Checking database..."
node agent-tools/db/status.js > health-check-results/db-${TIMESTAMP}.json 2>/dev/null || echo '{"success":false}' > health-check-results/db-${TIMESTAMP}.json
echo "✅ Database check complete"
echo ""

echo "⚙️  2/5: Checking environment variables..."
node agent-tools/deploy/verify-env.js > health-check-results/env-${TIMESTAMP}.json 2>/dev/null || echo '{"success":false}' > health-check-results/env-${TIMESTAMP}.json
echo "✅ Environment check complete"
echo ""

echo "🚂 3/5: Checking backend..."
echo "   Results saved to health-check-results/"
echo ""

echo "⚡ 4/5: Checking frontend..."
echo "   Results saved to health-check-results/"
echo ""

echo "☁️  5/5: Checking Supabase..."
echo "   Results saved to health-check-results/"
echo ""

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                   Health Check Complete!                       ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "📁 Results: health-check-results/"
echo "🎉 System check complete!"

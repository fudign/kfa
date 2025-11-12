#!/bin/bash
# ============================================================================
# Agent Tools Installation Verification
# ============================================================================
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║         Agent Tools Installation Verification                 ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

test_tool() {
    local tool_name=$1
    local tool_path=$2

    TOTAL_TESTS=$((TOTAL_TESTS + 1))

    if [ -f "$tool_path" ]; then
        echo "  ✅ $tool_name - Found"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo "  ❌ $tool_name - Missing"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
}

echo "🔍 Checking Database Tools..."
test_tool "migrate.js" "agent-tools/db/migrate.js"
test_tool "seed.js" "agent-tools/db/seed.js"
test_tool "status.js" "agent-tools/db/status.js"
test_tool "backup.js" "agent-tools/db/backup.js"
echo ""

echo "🔍 Checking Deployment Tools..."
test_tool "build-frontend.js" "agent-tools/deploy/build-frontend.js"
test_tool "build-backend.js" "agent-tools/deploy/build-backend.js"
test_tool "verify-env.js" "agent-tools/deploy/verify-env.js"
test_tool "health-check.js" "agent-tools/deploy/health-check.js"
echo ""

echo "🔍 Checking Testing Tools..."
test_tool "run-e2e.js" "agent-tools/test/run-e2e.js"
test_tool "run-unit.js" "agent-tools/test/run-unit.js"
echo ""

echo "🔍 Checking Documentation Tools..."
test_tool "generate-api.js" "agent-tools/docs/generate-api.js"
test_tool "validate-docs.js" "agent-tools/docs/validate-docs.js"
echo ""

echo "🔍 Checking Media Tools..."
test_tool "upload-to-supabase.js" "agent-tools/media/upload-to-supabase.js"
test_tool "list-media.js" "agent-tools/media/list-media.js"
echo ""

echo "🔍 Checking Scripts..."
test_tool "pre-deploy-check.sh" "agent-tools/scripts/pre-deploy-check.sh"
test_tool "full-deploy.sh" "agent-tools/scripts/full-deploy.sh"
test_tool "test-all.sh" "agent-tools/scripts/test-all.sh"
test_tool "backup-and-migrate.sh" "agent-tools/scripts/backup-and-migrate.sh"
echo ""

echo "🔍 Checking KFA Examples..."
test_tool "kfa-full-check.sh" "agent-tools/examples/kfa-full-check.sh"
test_tool "kfa-deployment-workflow.sh" "agent-tools/examples/kfa-deployment-workflow.sh"
test_tool "kfa-dev-workflow.sh" "agent-tools/examples/kfa-dev-workflow.sh"
echo ""

echo "🔍 Checking Utilities..."
test_tool "metrics.js" "agent-tools/utils/metrics.js"
test_tool "generate-report.sh" "agent-tools/utils/generate-report.sh"
echo ""

echo "🔍 Checking Templates..."
test_tool "tool-template.js" "agent-tools/templates/tool-template.js"
test_tool "HOW-TO-ADD-TOOL.md" "agent-tools/templates/HOW-TO-ADD-TOOL.md"
echo ""

echo "🔍 Testing Node.js availability..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "  ✅ Node.js installed - $NODE_VERSION"
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    echo "  ❌ Node.js not found - Required for tools"
    FAILED_TESTS=$((FAILED_TESTS + 1))
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))
echo ""

echo "🔍 Testing a sample tool..."
if [ -f "agent-tools/db/status.js" ]; then
    TEST_OUTPUT=$(node agent-tools/db/status.js 2>&1)
    if echo "$TEST_OUTPUT" | grep -q "success"; then
        echo "  ✅ Sample tool execution successful"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo "  ⚠️  Sample tool executed but check output"
        echo "     Run: node agent-tools/db/status.js"
    fi
else
    echo "  ❌ Cannot test - tool missing"
    FAILED_TESTS=$((FAILED_TESTS + 1))
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))
echo ""

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                   Verification Complete                       ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "📊 Results:"
echo "   Total Tests:  $TOTAL_TESTS"
echo "   Passed:       $PASSED_TESTS"
echo "   Failed:       $FAILED_TESTS"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
    echo "✅ All checks passed! Installation is complete."
    echo ""
    echo "🚀 Next steps:"
    echo "   1. Read: START-HERE.txt"
    echo "   2. Try:  node agent-tools/db/status.js"
    echo "   3. Run:  bash agent-tools/examples/kfa-dev-workflow.sh"
    exit 0
else
    echo "⚠️  Some checks failed. Please review the output above."
    echo ""
    echo "💡 Common issues:"
    echo "   - Missing files: Re-run installation"
    echo "   - Node.js not found: Install Node.js 14.x or higher"
    echo "   - Permission errors: Run with appropriate permissions"
    exit 1
fi

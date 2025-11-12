#!/bin/bash
# ============================================================================
# KFA Development Servers Quick Start
# ============================================================================

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║         KFA Development Servers - Quick Start                  ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Pre-flight check
echo "🔍 Running pre-flight checks..."
echo ""

# Check database
echo -n "  Database connection... "
DB_CHECK=$(node agent-tools/db/status.js 2>&1)
if echo "$DB_CHECK" | grep -q '"success": true'; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
    echo "  Error: Database not connected. Run: bash agent-tools/examples/kfa-dev-workflow.sh"
    exit 1
fi

# Check PHP
echo -n "  PHP version... "
if command -v php &> /dev/null; then
    PHP_VERSION=$(php -v | head -1 | cut -d' ' -f2)
    echo -e "${GREEN}✓${NC} ($PHP_VERSION)"
else
    echo -e "${RED}✗${NC}"
    echo "  Error: PHP not found"
    exit 1
fi

# Check Node.js
echo -n "  Node.js version... "
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓${NC} ($NODE_VERSION)"
else
    echo -e "${RED}✗${NC}"
    echo "  Error: Node.js not found"
    exit 1
fi

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo " Starting Development Servers"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Instructions for manual start
echo "🚀 Start Backend Server:"
echo "   ${YELLOW}cd kfa-backend/kfa-api && php artisan serve${NC}"
echo ""
echo "   Backend will be available at:"
echo "   → http://localhost:8000"
echo ""

echo "🚀 Start Frontend Server:"
echo "   ${YELLOW}cd kfa-website && npm run dev${NC}"
echo ""
echo "   Frontend will be available at:"
echo "   → http://localhost:5173"
echo ""

echo "═══════════════════════════════════════════════════════════════"
echo " Quick Commands"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "  Check environment:     ${YELLOW}bash agent-tools/examples/kfa-dev-workflow.sh${NC}"
echo "  Check database:        ${YELLOW}node agent-tools/db/status.js${NC}"
echo "  Run tests:             ${YELLOW}bash agent-tools/scripts/test-all.sh${NC}"
echo "  View metrics:          ${YELLOW}cat metrics-report.md${NC}"
echo ""

echo "💡 Tip: Open 2 terminal windows to run both servers simultaneously"
echo ""

# Offer to start backend in this terminal
read -p "Start backend server in this terminal? [y/N] " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "Starting Laravel backend..."
    cd kfa-backend/kfa-api
    php artisan serve
fi

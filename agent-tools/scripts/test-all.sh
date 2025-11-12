#!/bin/bash
# Run all tests
# Executes both unit and E2E tests

set -e

echo "=== Running All Tests ==="
echo "Timestamp: $(date -u +"%Y-%m-%dT%H:%M:%SZ")"
echo ""

echo "1. Running unit tests..."
node agent-tools/test/run-unit.js

echo ""
echo "2. Running E2E tests..."
node agent-tools/test/run-e2e.js

echo ""
echo "✅ All tests passed!"

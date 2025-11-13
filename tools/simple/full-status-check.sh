#!/bin/bash
# Full Status Check - Composition Example
# Demonstrates tool chaining following MCP-alternative philosophy

set -e  # Exit on error

echo "======================================"
echo "KFA Project Status Check"
echo "======================================"
echo ""

# Create output directory
OUTPUT_DIR=".kfa/status-report"
mkdir -p "$OUTPUT_DIR"

TIMESTAMP=$(date +%Y-%m-%d_%H-%M-%S)

echo "Running status checks..."
echo ""

# 1. Database Status
echo "→ Checking database..."
node kfa-cli/commands/db/status-simple.js --json --output "$OUTPUT_DIR/db-$TIMESTAMP.json" 2>/dev/null
if [ $? -eq 0 ]; then
  echo "  ✓ Database check complete"
else
  echo "  ✗ Database check failed"
fi

# 2. Cache Status
echo "→ Checking cache..."
node kfa-cli/commands/cache/status-simple.js --json --output "$OUTPUT_DIR/cache-$TIMESTAMP.json" 2>/dev/null
if [ $? -eq 0 ]; then
  echo "  ✓ Cache check complete"
else
  echo "  ✗ Cache check failed"
fi

# 3. Project Health
echo "→ Checking project health..."
node kfa-cli/commands/project/health-simple.js --json --output "$OUTPUT_DIR/health-$TIMESTAMP.json" 2>/dev/null
if [ $? -eq 0 ]; then
  echo "  ✓ Health check complete"
else
  echo "  ✗ Health check failed"
fi

echo ""
echo "======================================"
echo "Combining results..."
echo "======================================"

# Combine all results into single report
node -e "
const fs = require('fs');
const path = require('path');

const reportDir = '$OUTPUT_DIR';
const timestamp = '$TIMESTAMP';

try {
  const db = JSON.parse(fs.readFileSync(path.join(reportDir, \`db-\${timestamp}.json\`), 'utf8'));
  const cache = JSON.parse(fs.readFileSync(path.join(reportDir, \`cache-\${timestamp}.json\`), 'utf8'));
  const health = JSON.parse(fs.readFileSync(path.join(reportDir, \`health-\${timestamp}.json\`), 'utf8'));

  const fullReport = {
    timestamp: new Date().toISOString(),
    database: db,
    cache: cache,
    health: health,
    summary: {
      dbConnected: db.status === 'connected',
      cacheSize: cache.totalSize || 0,
      healthScore: health.score || 0,
      overallStatus: health.status || 'unknown'
    }
  };

  fs.writeFileSync(
    path.join(reportDir, \`full-report-\${timestamp}.json\`),
    JSON.stringify(fullReport, null, 2)
  );

  // Create human-readable summary
  const summary = \`
KFA Project Status Report
Generated: \${fullReport.timestamp}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DATABASE
  Status: \${db.status}
  Host: \${db.host || 'N/A'}
  Database: \${db.database || 'N/A'}
  Latency: \${db.latency || 'N/A'}ms

CACHE
  Total Size: \${(cache.totalSize / 1024).toFixed(2)} KB
  Total Entries: \${cache.totalEntries || 0}
  Valid Entries: \${cache.validEntries || 0}

PROJECT HEALTH
  Score: \${health.score}%
  Status: \${health.status}
  Node Modules: \${health.checks?.nodeModules ? '✓' : '✗'}
  Backend Setup: \${health.checks?.backendSetup ? '✓' : '✗'}
  Frontend Setup: \${health.checks?.frontendSetup ? '✓' : '✗'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Overall Status: \${fullReport.summary.overallStatus.toUpperCase()}
\`;

  fs.writeFileSync(
    path.join(reportDir, \`summary-\${timestamp}.txt\`),
    summary
  );

  console.log('');
  console.log(summary);
  console.log('');
  console.log('Full reports saved to:', reportDir);
  console.log('  - full-report-' + timestamp + '.json');
  console.log('  - summary-' + timestamp + '.txt');
  console.log('');

} catch (error) {
  console.error('✗ Error combining reports:', error.message);
  process.exit(1);
}
"

echo "======================================"
echo "Status check complete!"
echo "======================================"

# Tool Composition Examples

Following the philosophy from [What if you don't need MCP?](https://mariozechner.at/posts/2025-11-02-what-if-you-dont-need-mcp/)

All tools output to files/stdout for easy chaining and composition.

## Basic File Output

Every tool supports `--output` flag:

```bash
# Save database status to file
node kfa-cli/commands/db/status-simple.js --output db-status.json

# Run tests and save results
node kfa-cli/commands/test/unit-simple.js --output test-results.txt
```

## Chaining Tools

### Example 1: Database Check + Migration

```bash
# Check DB status, if OK then migrate
node kfa-cli/commands/db/status-simple.js --output .kfa/db-check.json && \
node kfa-cli/commands/db/migrate-simple.js --output .kfa/migration.json
```

### Example 2: Test + Deploy Pipeline

```bash
# Run tests, save results, then verify deploy if tests pass
node kfa-cli/commands/test/unit-simple.js --output .kfa/test-results.txt && \
node kfa-cli/commands/deploy/verify.js --output .kfa/deploy-status.json
```

### Example 3: Collect All Status Info

```bash
#!/bin/bash
# status-check.sh - Collect all project status

mkdir -p .kfa/status-report

node kfa-cli/commands/db/status-simple.js --json --output .kfa/status-report/db.json
node kfa-cli/commands/cache/status.js --json --output .kfa/status-report/cache.json
node kfa-cli/commands/project/health.js --json --output .kfa/status-report/health.json

# Combine into single report
node -e "
const fs = require('fs');
const report = {
  db: JSON.parse(fs.readFileSync('.kfa/status-report/db.json')),
  cache: JSON.parse(fs.readFileSync('.kfa/status-report/cache.json')),
  health: JSON.parse(fs.readFileSync('.kfa/status-report/health.json')),
  timestamp: new Date().toISOString()
};
fs.writeFileSync('.kfa/status-report/full-report.json', JSON.stringify(report, null, 2));
console.log('Full report saved to .kfa/status-report/full-report.json');
"
```

## Context Efficiency

**Before (with classes):**
- DatabaseClient class: ~119 lines
- Cache class: ~147 lines
- Utils: ~100+ lines
- Total context: ~5000+ tokens

**After (simple scripts):**
- status-simple.js: ~95 lines (self-contained)
- migrate-simple.js: ~45 lines (self-contained)
- Total context: ~1500 tokens

**Context savings: 70%**

## Composability Benefits

1. **No shared state** - Each tool is independent
2. **File-based** - Results persist, can be analyzed later
3. **Shell integration** - Use with bash pipes, grep, jq
4. **Agent-friendly** - Agents can chain tools without context bloat

## Processing Output with Standard Tools

```bash
# Parse JSON results with jq
node kfa-cli/commands/db/status-simple.js --json --output db.json
jq '.host' db.json

# Filter test results with grep
node kfa-cli/commands/test/unit-simple.js --output tests.txt
grep "PASS" tests.txt | wc -l

# Combine multiple outputs
cat .kfa/status-report/*.json | jq -s 'add'
```

## Why This is Better Than MCP

From the article:

> "MCP servers consume substantial context—the examples cited use 13,700-18,000 tokens for browser tools, representing 6-9% of Claude's available context."

Our approach:
- **Minimal context**: Tool descriptions are <50 tokens each
- **Persistent results**: Files don't consume context
- **Composable**: Shell scripting beats MCP routing
- **Extensible**: Add new tool = add new .js file
- **No infrastructure**: No MCP server to maintain

## Creating New Tools

Template for new tool:

```javascript
#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');

const args = process.argv.slice(2);
const outputFile = args.includes('--output') ? args[args.indexOf('--output') + 1] : null;

try {
  // Do your work
  const result = { /* your result */ };

  // Output
  const output = JSON.stringify(result, null, 2);
  if (outputFile) {
    fs.writeFileSync(outputFile, output);
    console.log(`✓ Output written to: ${outputFile}`);
  } else {
    console.log(output);
  }

  process.exit(0);
} catch (error) {
  console.error(`✗ Error: ${error.message}`);
  process.exit(1);
}
```

**That's it!** ~30 lines, no classes, no abstractions.

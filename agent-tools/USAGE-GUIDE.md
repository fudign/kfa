# Agent Tools Usage Guide

Quick start guide for using lightweight CLI tools in your daily workflow.

## Installation

No installation needed! Tools use Node.js built-ins only.

**Requirements:**

- Node.js v20+
- Access to project directory

## Quick Start

### 1. Database Operations

```bash
# Check database connection
node agent-tools/db/status.js

# Run migrations
node agent-tools/db/migrate.js

# Fresh migration with seed data (development)
node agent-tools/db/migrate.js --fresh --seed

# Create backup
node agent-tools/db/backup.js

# Seed database
node agent-tools/db/seed.js
```

### 2. Deployment Tasks

```bash
# Verify environment variables
node agent-tools/deploy/verify-env.js

# Build frontend (React)
node agent-tools/deploy/build-frontend.js

# Optimize backend (Laravel)
node agent-tools/deploy/build-backend.js

# Health check
node agent-tools/deploy/health-check.js --url=https://your-app.com
```

### 3. Testing

```bash
# Run all E2E tests
node agent-tools/test/run-e2e.js

# Run specific E2E test
node agent-tools/test/run-e2e.js --test=login

# Run unit tests
node agent-tools/test/run-unit.js

# Run specific unit test
node agent-tools/test/run-unit.js --filter=UserTest
```

### 4. Documentation

```bash
# Generate API documentation
node agent-tools/docs/generate-api.js

# Validate documentation completeness
node agent-tools/docs/validate-docs.js
```

## Common Workflows

### Morning Development Setup

```bash
# Quick environment check
node agent-tools/deploy/verify-env.js && \
  node agent-tools/db/status.js && \
  echo "✅ Ready to code!"
```

### Before Committing

```bash
# Run tests before commit
node agent-tools/test/run-unit.js > test-results.json

# Check if tests passed
if [ $? -eq 0 ]; then
  git add . && git commit -m "Your message"
else
  echo "❌ Tests failed, fix before committing"
fi
```

### Deployment Workflow

```bash
# Use pre-built workflow
bash agent-tools/scripts/full-deploy.sh

# Or run steps manually
bash agent-tools/scripts/pre-deploy-check.sh && \
  node agent-tools/db/backup.js && \
  node agent-tools/deploy/build-frontend.js && \
  node agent-tools/deploy/build-backend.js && \
  node agent-tools/db/migrate.js && \
  node agent-tools/deploy/health-check.js --url=https://prod.com
```

### Safe Database Migration

```bash
# Use safe migration script
bash agent-tools/examples/safe-migration.sh

# Creates backup, migrates, verifies, with rollback instructions if needed
```

## Output Format

All tools output JSON to stdout:

```json
{
  "success": true,
  "timestamp": "2025-11-11T12:00:00.000Z",
  "data": {
    /* tool-specific data */
  },
  "error": null
}
```

This makes it easy to:

- Parse results with `jq`
- Save to files for later analysis
- Chain commands together
- Integrate with CI/CD

## Saving Results

```bash
# Save to file
node agent-tools/db/status.js > db-status.json

# Save and display
node agent-tools/test/run-e2e.js | tee test-results.json

# Extract specific field
BACKUP_FILE=$(node agent-tools/db/backup.js | jq -r '.backupFile')
echo "Backup saved to: $BACKUP_FILE"
```

## Chaining Commands

```bash
# Sequential execution (stop on error)
node agent-tools/db/backup.js && \
  node agent-tools/db/migrate.js && \
  node agent-tools/test/run-e2e.js

# Continue on error
node agent-tools/test/run-unit.js ; \
  node agent-tools/test/run-e2e.js

# Conditional execution
if node agent-tools/deploy/verify-env.js; then
  bash agent-tools/scripts/full-deploy.sh
else
  echo "Environment check failed!"
fi
```

## Using with NPM Scripts

Add to your `package.json`:

```json
{
  "scripts": {
    "db:status": "node agent-tools/db/status.js",
    "db:migrate": "node agent-tools/db/migrate.js",
    "test:all": "bash agent-tools/scripts/test-all.sh",
    "deploy": "bash agent-tools/scripts/full-deploy.sh"
  }
}
```

Then run:

```bash
npm run db:status
npm run deploy
```

## Integration Examples

### GitHub Actions

See `agent-tools/examples/github-actions.yml` for complete workflow.

Key benefits:

- No heavy MCP initialization
- Fast execution
- Easy debugging
- Simple to modify

### Local Git Hooks

Add to `.git/hooks/pre-commit`:

```bash
#!/bin/bash
# Run tests before commit

node agent-tools/test/run-unit.js > /dev/null
if [ $? -ne 0 ]; then
  echo "❌ Unit tests failed! Fix before committing."
  exit 1
fi

echo "✅ Tests passed!"
```

### Daily Cron Job

```bash
# Add to crontab for daily health check
0 9 * * * cd /path/to/project && node agent-tools/deploy/health-check.js --url=https://prod.com > /var/log/health-check.log
```

## Debugging

### Check Tool Output

```bash
# Run with verbose output
node agent-tools/db/status.js | jq .

# Check for errors
node agent-tools/test/run-e2e.js > results.json
cat results.json | jq '.error'
```

### Verify Paths

All tools use relative paths from project root. Ensure you run from:

```bash
# Correct: from project root
node agent-tools/db/status.js

# Also correct: using npm scripts from agent-tools/
cd agent-tools
npm run db:status
```

## Performance Tips

1. **Use file outputs** - Results saved to files don't consume agent context
2. **Chain operations** - Use `&&` to run multiple tools efficiently
3. **Batch operations** - Run related tools together in scripts
4. **Cache results** - Save outputs to reuse later

## Token Efficiency

| Operation                  | Context Cost |
| -------------------------- | ------------ |
| Load single tool README    | ~50 tokens   |
| Execute tool (file output) | 0 tokens     |
| Chain 5 tools              | ~250 tokens  |
| Full deployment workflow   | ~400 tokens  |

**Compare to MCP**: 13,700+ tokens per server!

## Best Practices

1. ✅ **Always check environment** before deployment
2. ✅ **Create backups** before migrations
3. ✅ **Save results to files** for debugging
4. ✅ **Use pre-built workflows** for common tasks
5. ✅ **Test locally** before CI/CD integration

## Troubleshooting

### Tool not found

```bash
# Ensure you're in project root
pwd
# Should show: /path/to/kfa-6-alpha

# Or use absolute path
node /full/path/to/agent-tools/db/status.js
```

### Permission denied

```bash
# Make scripts executable (Linux/Mac)
chmod +x agent-tools/**/*.js
chmod +x agent-tools/**/*.sh
```

### jq not installed

```bash
# Windows
choco install jq

# Mac
brew install jq

# Linux
sudo apt install jq
```

## Need Help?

- **Quick Reference**: `agent-tools/QUICK-REFERENCE.md`
- **Full Guide**: `AGENT-TOOLS-GUIDE.md`
- **Examples**: `agent-tools/examples/`
- **Tool READMEs**: Each category has its own README

## Context Savings

Using these tools vs traditional MCP:

```
Traditional MCP:  41,700 tokens
Lightweight CLI:     925 tokens
Savings:          97.8% ✅
```

More tokens = more code context = better AI assistance!

---

**Remember**: These tools are designed to be simple, composable, and context-efficient. Keep them under 100 LOC and easy to modify!

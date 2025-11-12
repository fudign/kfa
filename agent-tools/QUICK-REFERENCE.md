# Agent Tools Quick Reference

Fast reference for common operations. All tools output JSON.

## Database Operations

```bash
# Check database connection
node agent-tools/db/status.js

# Run migrations
node agent-tools/db/migrate.js

# Fresh migration with seeding
node agent-tools/db/migrate.js --fresh --seed

# Seed database
node agent-tools/db/seed.js

# Backup database
node agent-tools/db/backup.js
node agent-tools/db/backup.js --output=custom-path.sql
```

## Deployment

```bash
# Verify environment variables
node agent-tools/deploy/verify-env.js

# Build frontend
node agent-tools/deploy/build-frontend.js

# Build backend
node agent-tools/deploy/build-backend.js

# Health check
node agent-tools/deploy/health-check.js --url=https://api.example.com
```

## Testing

```bash
# Run all E2E tests
node agent-tools/test/run-e2e.js

# Run specific test
node agent-tools/test/run-e2e.js --test=login

# Run unit tests
node agent-tools/test/run-unit.js

# Run specific unit test
node agent-tools/test/run-unit.js --filter=UserTest
```

## Documentation

```bash
# Generate API docs
node agent-tools/docs/generate-api.js

# Validate documentation
node agent-tools/docs/validate-docs.js
```

## Composable Scripts

```bash
# Pre-deployment checks
bash agent-tools/scripts/pre-deploy-check.sh

# Full deployment workflow
bash agent-tools/scripts/full-deploy.sh

# Run all tests
bash agent-tools/scripts/test-all.sh

# Backup and migrate
bash agent-tools/scripts/backup-and-migrate.sh
```

## Common Workflows

### Development Workflow

```bash
# Setup database
node agent-tools/db/migrate.js --fresh --seed

# Run tests
bash agent-tools/scripts/test-all.sh

# Verify everything
node agent-tools/db/status.js && \
  node agent-tools/test/run-unit.js
```

### Deployment Workflow

```bash
# Pre-deploy
bash agent-tools/scripts/pre-deploy-check.sh

# Deploy
node agent-tools/db/backup.js && \
  node agent-tools/deploy/build-frontend.js && \
  node agent-tools/deploy/build-backend.js && \
  node agent-tools/db/migrate.js

# Verify
node agent-tools/deploy/health-check.js --url=https://prod.example.com && \
  node agent-tools/test/run-e2e.js
```

### Debugging Workflow

```bash
# Check environment
node agent-tools/deploy/verify-env.js > env-check.json

# Check database
node agent-tools/db/status.js > db-status.json

# Check application health
node agent-tools/deploy/health-check.js --url=http://localhost:8000 > health.json

# Review results
cat env-check.json db-status.json health.json
```

## Output to Files

All tools output JSON, pipe to files for chaining:

```bash
# Save results
node agent-tools/db/status.js > results/db-status.json
node agent-tools/deploy/health-check.js --url=https://api.com > results/health.json

# Chain operations
node agent-tools/db/backup.js > backup.json && \
  node agent-tools/db/migrate.js > migrate.json && \
  echo "Migration successful, backup: $(cat backup.json | jq -r '.backupFile')"
```

## Error Handling

Tools exit with code 1 on error:

```bash
# Stop on error
set -e
node agent-tools/db/migrate.js || echo "Migration failed!"

# Continue on error
node agent-tools/test/run-e2e.js || echo "Tests failed but continuing..."

# Conditional execution
if node agent-tools/deploy/verify-env.js; then
  bash agent-tools/scripts/full-deploy.sh
else
  echo "Environment check failed!"
fi
```

## JSON Parsing

Use `jq` for JSON manipulation:

```bash
# Extract specific field
BACKUP_FILE=$(node agent-tools/db/backup.js | jq -r '.backupFile')
echo "Backup saved to: $BACKUP_FILE"

# Check success
SUCCESS=$(node agent-tools/test/run-e2e.js | jq -r '.success')
if [ "$SUCCESS" = "true" ]; then
  echo "Tests passed!"
fi

# Get test count
PASSED=$(node agent-tools/test/run-e2e.js | jq -r '.passed')
FAILED=$(node agent-tools/test/run-e2e.js | jq -r '.failed')
echo "Tests: $PASSED passed, $FAILED failed"
```

## Context Efficiency

| Operation      | Context Cost              |
| -------------- | ------------------------- |
| Load tool docs | ~50 tokens                |
| Execute tool   | 0 tokens (output to file) |
| Chain 5 tools  | ~250 tokens               |
| Full workflow  | ~400 tokens               |

Compare to MCP: 13,700+ tokens per server!

## Tips

1. **Pipe to files** to save results outside context
2. **Chain with `&&`** for sequential operations
3. **Use `jq`** for JSON parsing and extraction
4. **Check exit codes** for error handling
5. **Keep logs** in `results/` or `logs/` directories

## More Info

- Full guide: `AGENT-TOOLS-GUIDE.md`
- Tool READMEs: `agent-tools/<category>/README.md`
- Sample workflow: `bmad/core/workflows/lightweight-deploy/`
- Optimization report: `CONTEXT-OPTIMIZATION-REPORT.md`

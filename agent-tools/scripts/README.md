# Common Scripts

Composable bash scripts for chaining operations. Each script is simple and outputs to stdout.

## Scripts

### verify-installation.sh

Verify that all agent tools are properly installed and functional.

```bash
bash scripts/verify-installation.sh
```

**What it checks:**

- All 18 CLI tools exist
- All scripts are present
- KFA-specific examples are available
- Node.js is installed and working
- Sample tool execution works

**When to use:**

- After initial setup
- Before starting work
- After updating tools
- When troubleshooting issues

### full-deploy.sh

Complete deployment workflow.

```bash
bash scripts/full-deploy.sh
```

### pre-deploy-check.sh

Run all pre-deployment checks.

```bash
bash scripts/pre-deploy-check.sh
```

### test-all.sh

Run all tests (E2E + unit).

```bash
bash scripts/test-all.sh
```

### backup-and-migrate.sh

Backup DB before running migrations.

```bash
bash scripts/backup-and-migrate.sh
```

## Composability Examples

```bash
# Check, backup, deploy
bash scripts/pre-deploy-check.sh && \
  node db/backup.js && \
  bash scripts/full-deploy.sh

# Test, build, health check
bash scripts/test-all.sh && \
  node deploy/build-frontend.js && \
  node deploy/health-check.js --url=https://kfa-website.vercel.app

# Chain with output
bash scripts/pre-deploy-check.sh > check.json && \
  node db/migrate.js --fresh > migrate.json && \
  node test/run-e2e.js > test.json
```

# Agent Tools Usage Examples

Real-world examples of using lightweight agent tools for common tasks.

## Quick Start

All examples are self-contained scripts you can run directly.

```bash
# Run an example
bash agent-tools/examples/kfa-full-check.sh

# Or on Windows (Git Bash)
bash agent-tools/examples/kfa-full-check.sh
```

## KFA-Specific Examples

### kfa-full-check.sh

Complete system health check for all KFA services.

- Database connection
- Supabase connection and storage buckets
- Railway backend deployment
- Vercel frontend deployment

**Usage:**

```bash
bash agent-tools/examples/kfa-full-check.sh
```

### kfa-deployment-workflow.sh

Complete deployment workflow with pre/post verification.

- Pre-deployment checks
- Build frontend
- Deploy to Vercel
- Post-deployment verification
- Run post-deployment tests

**Usage:**

```bash
bash agent-tools/examples/kfa-deployment-workflow.sh
```

### kfa-dev-workflow.sh

Quick development environment check.

- Database status
- Supabase connection
- Dev servers status
- Unit tests

**Usage:**

```bash
bash agent-tools/examples/kfa-dev-workflow.sh
```

## General Examples

### 1. deploy-with-tests.sh

Complete deployment with testing at each stage.

- Pre-deployment checks
- Database backup
- Build frontend & backend
- Run migrations
- Execute tests
- Health check

### 2. safe-migration.sh

Safe database migration with automatic rollback.

- Create backup
- Run migrations
- Verify success
- Rollback on failure

### 3. daily-health-check.sh

Daily health monitoring script.

- Check database connection
- Verify environment
- Run health checks
- Generate report

### 4. ci-workflow.sh

CI/CD pipeline integration.

- Run tests
- Build application
- Deploy to staging
- Verify deployment

### 5. development-setup.sh

Fresh development environment setup.

- Verify requirements
- Install dependencies
- Setup database
- Seed test data
- Run initial tests

## Integration Examples

### GitHub Actions

See `examples/github-actions.yml`

### GitLab CI

See `examples/gitlab-ci.yml`

### Local Development

See `examples/local-dev-workflow.sh`

## Token Efficiency

Each example consumes minimal context:

- deploy-with-tests: ~400 tokens
- safe-migration: ~150 tokens
- health-check: ~100 tokens

Compare to MCP-based workflows: 15,000+ tokens!

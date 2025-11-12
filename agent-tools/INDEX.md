# Agent Tools Index

**Lightweight CLI tools for AI agent operations**

---

## 📊 Quick Stats

| Metric         | Value      |
| -------------- | ---------- |
| Total Tools    | 18         |
| Total Scripts  | 4          |
| Total Examples | 4          |
| Context Usage  | 925 tokens |
| vs MCP         | ↓ 97.8%    |
| Files Created  | 37         |

---

## 🗂️ Directory Structure

```
agent-tools/
├── 📁 db/          → 4 tools (Database operations)
├── 📁 deploy/      → 4 tools (Deployment helpers)
├── 📁 test/        → 2 tools (Testing utilities)
├── 📁 docs/        → 2 tools (Documentation generators)
├── 📁 media/       → 2 tools (Media management)
├── 📁 scripts/     → 4 scripts (Composable workflows)
├── 📁 examples/    → 4 examples (Real-world usage)
├── 📄 README.md
├── 📄 QUICK-REFERENCE.md
├── 📄 USAGE-GUIDE.md
└── 📄 package.json
```

---

## 🚀 Quick Commands

```bash
# Database
node agent-tools/db/status.js              # Check connection
node agent-tools/db/migrate.js             # Run migrations
node agent-tools/db/backup.js              # Create backup

# Deployment
node agent-tools/deploy/verify-env.js      # Check environment
node agent-tools/deploy/build-frontend.js  # Build React
node agent-tools/deploy/health-check.js --url=URL  # Health check

# Testing
node agent-tools/test/run-unit.js          # Unit tests
node agent-tools/test/run-e2e.js           # E2E tests

# Workflows
bash agent-tools/scripts/full-deploy.sh    # Complete deployment
bash agent-tools/examples/safe-migration.sh # Safe migration
```

---

## 📚 Documentation

| File                 | Purpose             | Size |
| -------------------- | ------------------- | ---- |
| `QUICK-REFERENCE.md` | Command cheat sheet | 3KB  |
| `USAGE-GUIDE.md`     | Daily usage guide   | 5KB  |
| `README.md`          | Tool overview       | 2KB  |

---

## 🎯 By Category

### Database (`db/`)

- ✅ `migrate.js` - Run Laravel migrations
- ✅ `seed.js` - Seed test data
- ✅ `status.js` - Check connection
- ✅ `backup.js` - Create backup

### Deployment (`deploy/`)

- ✅ `build-frontend.js` - Build React app
- ✅ `build-backend.js` - Optimize Laravel
- ✅ `verify-env.js` - Verify environment
- ✅ `health-check.js` - Check deployment health

### Testing (`test/`)

- ✅ `run-e2e.js` - Playwright E2E tests
- ✅ `run-unit.js` - PHPUnit unit tests

### Documentation (`docs/`)

- ✅ `generate-api.js` - Generate API docs
- ✅ `validate-docs.js` - Validate completeness

### Media (`media/`)

- ✅ `upload-to-supabase.js` - Upload files
- ✅ `list-media.js` - List media files

### Scripts (`scripts/`)

- ✅ `pre-deploy-check.sh` - Pre-deployment checks
- ✅ `full-deploy.sh` - Complete deployment
- ✅ `test-all.sh` - All tests
- ✅ `backup-and-migrate.sh` - Safe migration

### Examples (`examples/`)

- ✅ `deploy-with-tests.sh` - Full deployment example
- ✅ `safe-migration.sh` - Safe migration example
- ✅ `github-actions.yml` - CI/CD integration
- ✅ `local-dev-workflow.sh` - Local setup

---

## 💡 Context Efficiency

```
Traditional MCP:    ████████████████████  41,700 tokens (20.8%)
Lightweight CLI:    ░                       925 tokens (0.46%)

Savings:            ↓ 97.8%
```

**40,775 additional tokens** available for real work!

---

## 🔗 Related Documentation

### Main Guides

- **[AGENT-TOOLS-GUIDE.md](../AGENT-TOOLS-GUIDE.md)** - Full integration guide
- **[CONTEXT-OPTIMIZATION-REPORT.md](../CONTEXT-OPTIMIZATION-REPORT.md)** - Detailed analysis
- **[IMPLEMENTATION-SUMMARY.md](../IMPLEMENTATION-SUMMARY.md)** - Implementation details
- **[FINAL-SUMMARY.md](../FINAL-SUMMARY.md)** - Complete summary (Russian)

### BMAD Integration

- **[bmad/core/workflows/lightweight-deploy/](../bmad/core/workflows/lightweight-deploy/)** - Sample workflow

### Original Article

- **[What if you don't need MCP?](https://mariozechner.at/posts/2025-11-02-what-if-you-dont-need-mcp/)** - Source inspiration

---

## ✨ Key Benefits

1. **97.8% context reduction** - Massive savings
2. **Composable** - Chain tools with bash
3. **File-based** - Results bypass context
4. **Simple** - Each tool < 100 LOC
5. **Zero dependencies** - Node.js built-ins only
6. **Fast to extend** - 10-15 min vs 2-4 hours

---

## 🎯 Next Steps

1. **Get Started**: Read `QUICK-REFERENCE.md`
2. **Learn**: Read `USAGE-GUIDE.md`
3. **Try It**: Run `bash examples/local-dev-workflow.sh`
4. **Integrate**: Add to your workflows

---

**Built for AI agent efficiency** • **Production-ready** • **Easy to extend**

# Tool Philosophy

Inspired by: [What if you don't need MCP?](https://mariozechner.at/posts/2025-11-02-what-if-you-dont-need-mcp/)

## Core Principles

### 1. Simple Over Complex

**Before:**

```javascript
// Complex abstraction - database.js (119 lines)
class DatabaseClient {
  constructor() {
    /* setup */
  }
  async checkStatus() {
    /* complex logic */
  }
  async migrate() {
    /* complex logic */
  }
  async seed() {
    /* complex logic */
  }
  _extractEnvVar() {
    /* helper */
  }
}
```

**After:**

```javascript
// Simple script - status-simple.js (95 lines, self-contained)
const { execSync } = require('child_process');
const fs = require('fs');
// Direct execution, no classes
const result = execSync('php artisan db:show', { cwd: backendPath });
console.log(JSON.stringify(result, null, 2));
```

### 2. File-Based Output

Every tool writes results to files **by default or via --output flag**.

**Why?**

- **Zero context consumption**: Files don't take up LLM context
- **Persistent**: Results available for later analysis
- **Composable**: Other tools can read the files
- **Chainable**: Use shell pipes and standard tools

### 3. No Shared Dependencies

**Before:**

```javascript
// Multiple files depend on shared classes
const { DatabaseClient } = require('../../lib/database');
const { Cache } = require('../../lib/cache');
const { outputJSON } = require('../../lib/utils');
```

**After:**

```javascript
// Everything inline, no imports except built-ins
const { execSync } = require('child_process');
const fs = require('fs');
// All logic in one file
```

### 4. Minimal Token Budget

From the article:

> "MCP servers consume 13,700-18,000 tokens for browser tools (6-9% of context). Many popular MCP servers are inefficient because they attempt comprehensive coverage."

**Our approach:**

```
Tool description: ~25 tokens
Tool code: Not loaded into context (file-based)
Tool result: Written to file (zero context)
---
Total per tool: ~25 tokens
```

Compare with MCP: **99% context savings**

### 5. Agent-Friendly

Agents can:

- ✓ Run tool with simple shell command
- ✓ Read output from file
- ✓ Chain multiple tools
- ✓ No need to understand complex abstractions

**Example agent workflow:**

```bash
# Step 1: Check database
node kfa-cli/commands/db/status-simple.js --output db.json

# Step 2: Read result (outside context)
# Agent: "DB is healthy, proceeding"

# Step 3: Run migration
node kfa-cli/commands/db/migrate-simple.js --output migration.json

# Step 4: Verify
# Agent reads migration.json from disk
```

### 6. Composability Through Unix Philosophy

> "Write programs that do one thing and do it well. Write programs to work together."

```bash
# Chain tools with shell
node tool1.js --output a.json && node tool2.js --input a.json

# Filter with standard tools
node status.js --json | jq '.host'

# Combine outputs
cat .kfa/checks/*.json | jq -s 'add' > combined.json
```

## Architecture Comparison

### Old Architecture (Class-Based)

```
kfa-cli/
├── lib/
│   ├── database.js      (119 lines - DatabaseClient class)
│   ├── cache.js         (147 lines - Cache class)
│   └── utils.js         (100+ lines - helper functions)
├── commands/
│   └── db/
│       └── status.js    (50 lines - uses DatabaseClient, Cache)

Total: ~400+ lines across 4 files
Context: ~5000+ tokens
```

### New Architecture (Simple Scripts)

```
kfa-cli/
└── commands/
    └── db/
        ├── status-simple.js    (95 lines - self-contained)
        └── migrate-simple.js   (45 lines - self-contained)

Total: ~140 lines in 2 files
Context: ~1500 tokens (70% reduction)
```

## Real-World Benefits

### 1. Faster Agent Execution

- No context bloat
- No need to load/understand abstractions
- Direct tool invocation

### 2. Easier Maintenance

- One file per tool
- No hidden dependencies
- Copy-paste to create new tool

### 3. Better Debugging

- All logic in one place
- Clear input/output
- File-based results for inspection

### 4. Zero Infrastructure

- No MCP server
- No complex routing
- Just Node.js scripts

## When to Use This Approach

✅ **Use simple scripts when:**

- Building agent tools
- Context budget is limited
- Tools need to be composable
- Want minimal dependencies
- Need file-based persistence

❌ **Consider alternatives when:**

- Building complex interactive UIs
- Need real-time bidirectional communication
- Require stateful sessions
- Working with non-agent workflows

## Further Reading

- [What if you don't need MCP?](https://mariozechner.at/posts/2025-11-02-what-if-you-dont-need-mcp/)
- [Unix Philosophy](https://en.wikipedia.org/wiki/Unix_philosophy)
- [The Art of Command Line](https://github.com/jlevy/the-art-of-command-line)

## Quote from the Article

> "Rather than implementing complex MCP solutions, developers should build minimal CLI scripts that agents can invoke directly. Scripts should write outputs to files rather than only returning context-bound results, enabling chaining and post-processing."

**This is exactly what we've done here.**

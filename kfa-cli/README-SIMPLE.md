# KFA CLI - Simplified Tools

> Following the philosophy: **Simple, Self-Contained, File-Based**
>
> Inspired by: [What if you don't need MCP?](https://mariozechner.at/posts/2025-11-02-what-if-you-dont-need-mcp/)

## Why Simple Tools?

Instead of complex classes and abstractions, we use **simple Node.js scripts** that:
- ✓ Do one thing well
- ✓ Output to files for composition
- ✓ Consume minimal context (~25 tokens per tool)
- ✓ No shared dependencies
- ✓ Easy to understand and modify

## Available Tools

### Database Tools

```bash
# Check database status (with caching)
node kfa-cli/commands/db/status-simple.js
node kfa-cli/commands/db/status-simple.js --json
node kfa-cli/commands/db/status-simple.js --output db-status.json
node kfa-cli/commands/db/status-simple.js --no-cache

# Run migrations
node kfa-cli/commands/db/migrate-simple.js
node kfa-cli/commands/db/migrate-simple.js --fresh
node kfa-cli/commands/db/migrate-simple.js --output migration-log.json
```

### Test Tools

```bash
# Run unit tests
node kfa-cli/commands/test/unit-simple.js
node kfa-cli/commands/test/unit-simple.js --output test-results.txt
```

## Quick Examples

### Check DB and Migrate if OK

```bash
node kfa-cli/commands/db/status-simple.js --output .kfa/db.json && \
node kfa-cli/commands/db/migrate-simple.js --output .kfa/migration.json
```

### Run Tests Before Deploy

```bash
node kfa-cli/commands/test/unit-simple.js --output .kfa/tests.txt && \
echo "✓ Tests passed, ready to deploy"
```

### Collect System Status

```bash
#!/bin/bash
mkdir -p .kfa/status
node kfa-cli/commands/db/status-simple.js --json --output .kfa/status/db.json
echo "Status saved to .kfa/status/"
```

## Context Efficiency

| Approach | Lines of Code | Context Used | Notes |
|----------|--------------|--------------|-------|
| **Old (Classes)** | ~400 lines (4 files) | ~5000 tokens | DatabaseClient, Cache, Utils |
| **New (Simple)** | ~140 lines (2 files) | ~1500 tokens | Self-contained scripts |
| **Savings** | 65% fewer lines | **70% less context** | No abstractions |

## For Agents

Agents can use these tools efficiently:

```javascript
// Agent invokes tool
await exec('node kfa-cli/commands/db/status-simple.js --output db.json');

// Agent reads result from file (outside context window)
const status = JSON.parse(fs.readFileSync('db.json'));

// Agent decides next action
if (status.status === 'connected') {
  await exec('node kfa-cli/commands/db/migrate-simple.js');
}
```

**Benefits:**
- No context bloat from tool code
- Results persist in files
- Easy to chain operations
- Clear separation of concerns

## Adding New Tools

Template:

```javascript
#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');

const args = process.argv.slice(2);
const outputFile = args.includes('--output') ? args[args.indexOf('--output') + 1] : null;

try {
  // Your logic here
  const result = { success: true, data: 'something' };

  const output = JSON.stringify(result, null, 2);
  if (outputFile) {
    fs.writeFileSync(outputFile, output);
    console.log(`✓ Output: ${outputFile}`);
  } else {
    console.log(output);
  }
} catch (error) {
  console.error(`✗ Error: ${error.message}`);
  process.exit(1);
}
```

That's it! No classes, no abstractions, just **~30 lines**.

## Further Reading

- [PHILOSOPHY.md](./PHILOSOPHY.md) - Design principles
- [COMPOSITION-EXAMPLES.md](./COMPOSITION-EXAMPLES.md) - Advanced usage
- [What if you don't need MCP?](https://mariozechner.at/posts/2025-11-02-what-if-you-dont-need-mcp/) - Original article

## Comparison with MCP

| Feature | MCP Server | Simple Scripts |
|---------|-----------|----------------|
| Setup | Complex server infrastructure | Just Node.js |
| Context | 13,700-18,000 tokens per server | ~25 tokens per tool |
| Maintenance | Multiple files, routing logic | One file per tool |
| Composition | Through MCP protocol | Shell pipes & files |
| Learning curve | High (protocol, schema) | Low (just Node.js) |

**Simple scripts win on all fronts for agent tooling.**

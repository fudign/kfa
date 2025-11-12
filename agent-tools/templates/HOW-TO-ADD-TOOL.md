# How to Add a New Tool

Step-by-step guide for adding a new lightweight CLI tool to the agent-tools system.

## Overview

Adding a new tool takes **10-15 minutes** and follows a simple template-based approach.

---

## Step 1: Identify Category

Determine which category your tool belongs to:

- **`db/`** - Database operations (migrations, backups, queries)
- **`deploy/`** - Deployment tasks (builds, env checks, health)
- **`test/`** - Testing utilities (unit, E2E, integration)
- **`docs/`** - Documentation tools (generation, validation)
- **`media/`** - Media management (uploads, optimization)
- **`[new]`** - Create new category if needed

---

## Step 2: Use the Template

Copy the tool template:

```bash
# Copy template to your category
cp agent-tools/templates/tool-template.js agent-tools/[category]/[tool-name].js

# Make it executable (Linux/Mac)
chmod +x agent-tools/[category]/[tool-name].js
```

---

## Step 3: Implement Logic

Edit your new tool file:

### A. Update the header

```javascript
/**
 * [Your Tool Name]
 * [Clear description of what it does]
 *
 * Usage:
 *   node [category]/[tool-name].js [--option=value]
 *
 * Example:
 *   node db/optimize.js --table=users
 */
```

### B. Define arguments

```javascript
const args = process.argv.slice(2);
const tableArg = args.find((a) => a.startsWith('--table='));
const table = tableArg ? tableArg.split('=')[1] : null;
```

### C. Validate inputs

```javascript
if (!table) {
  console.error(
    JSON.stringify(
      {
        success: false,
        error: 'Missing required parameter: --table',
        usage: 'node db/optimize.js --table=users',
      },
      null,
      2,
    ),
  );
  process.exit(1);
}
```

### D. Implement main logic

```javascript
const command = `cd "${backendPath}" && php artisan db:optimize --table=${table}`;

exec(command, (error, stdout, stderr) => {
  const result = {
    success: !error,
    timestamp: new Date().toISOString(),
    table,
    output: stdout,
    error: stderr || null,
  };

  console.log(JSON.stringify(result, null, 2));
  process.exit(error ? 1 : 0);
});
```

### E. Keep it under 100 LOC

```
✅ Current: 87 lines
❌ Too many: 150+ lines (refactor!)
```

---

## Step 4: Test Locally

Test all scenarios:

### Test 1: Valid input

```bash
node agent-tools/[category]/[tool-name].js --option=valid
```

### Test 2: Invalid input

```bash
node agent-tools/[category]/[tool-name].js --option=invalid
```

### Test 3: Missing input

```bash
node agent-tools/[category]/[tool-name].js
```

### Test 4: Output to file

```bash
node agent-tools/[category]/[tool-name].js --option=test > result.json
cat result.json | jq .
```

### Test 5: Chain with other tools

```bash
node agent-tools/db/status.js && \
  node agent-tools/[category]/[tool-name].js --option=test
```

---

## Step 5: Update Documentation

### A. Update category README

Edit `agent-tools/[category]/README.md`:

````markdown
### [tool-name].js

[Brief description]

\```bash
node [category]/[tool-name].js [--option=value]
\```

Output: [Description] JSON

**Example:**
\```bash
node [category]/[tool-name].js --option=test > result.json
\```
````

### B. Update main README

Edit `agent-tools/README.md` if adding a new category.

### C. Update QUICK-REFERENCE.md

Add your tool to the quick reference:

````markdown
## [Category] Operations

\```bash

# [Description]

node agent-tools/[category]/[tool-name].js [options]
\```
````

---

## Step 6: Add NPM Script (Optional)

Edit `agent-tools/package.json`:

```json
{
  "scripts": {
    "[category]:[tool-name]": "node [category]/[tool-name].js"
  }
}
```

Now users can run:

```bash
cd agent-tools
npm run [category]:[tool-name]
```

---

## Step 7: Create Example (Optional)

If your tool solves a common workflow, create an example:

```bash
# Create example script
cat > agent-tools/examples/[workflow-name].sh << 'EOF'
#!/bin/bash
# [Description of workflow]

echo "Running [workflow-name]..."
node agent-tools/[category]/[tool-name].js --option=value > result.json

if [ $? -eq 0 ]; then
  echo "✅ Success!"
else
  echo "❌ Failed!"
  cat result.json | jq '.error'
fi
EOF

chmod +x agent-tools/examples/[workflow-name].sh
```

---

## Complete Example

Let's add a `db/optimize.js` tool:

### 1. Create file

```bash
cp agent-tools/templates/tool-template.js agent-tools/db/optimize.js
```

### 2. Implement

```javascript
#!/usr/bin/env node
/**
 * Database Optimizer
 * Optimizes database tables for better performance
 */

const { exec } = require('child_process');
const path = require('path');

const args = process.argv.slice(2);
const tableArg = args.find((a) => a.startsWith('--table='));
const table = tableArg ? tableArg.split('=')[1] : 'all';

const backendPath = path.join(__dirname, '../../kfa-backend/kfa-api');
const cmd =
  table === 'all' ? `cd "${backendPath}" && php artisan db:optimize` : `cd "${backendPath}" && php artisan db:optimize --table=${table}`;

exec(cmd, (error, stdout, stderr) => {
  const result = {
    success: !error,
    timestamp: new Date().toISOString(),
    table,
    output: stdout,
    error: stderr || null,
  };

  console.log(JSON.stringify(result, null, 2));
  process.exit(error ? 1 : 0);
});
```

### 3. Test

```bash
node agent-tools/db/optimize.js --table=users > optimize.json
cat optimize.json | jq .
```

### 4. Document

Update `agent-tools/db/README.md`:

````markdown
### optimize.js

Optimize database tables for better performance.

\```bash
node db/optimize.js [--table=name]
\```

Output: Optimization results JSON

**Examples:**
\```bash

# Optimize specific table

node db/optimize.js --table=users

# Optimize all tables

node db/optimize.js --table=all
\```
````

### 5. Add NPM script

```json
{
  "scripts": {
    "db:optimize": "node db/optimize.js"
  }
}
```

Done! **~12 minutes**

---

## Best Practices

### ✅ Do

- Keep tools under 100 LOC
- Use consistent JSON output format
- Validate all inputs
- Handle errors gracefully
- Document usage clearly
- Test thoroughly
- Use descriptive names

### ❌ Don't

- Add external dependencies (npm packages)
- Mix multiple responsibilities
- Use complex abstractions
- Forget error handling
- Skip documentation
- Make breaking changes to output format

---

## Checklist

Before committing your new tool:

- [ ] Tool file created in correct category
- [ ] Logic implemented (< 100 LOC)
- [ ] JSON output format consistent
- [ ] All inputs validated
- [ ] Error handling complete
- [ ] Tested with valid input
- [ ] Tested with invalid input
- [ ] Tested with missing input
- [ ] Tested output to file
- [ ] Tested chaining with other tools
- [ ] Category README updated
- [ ] QUICK-REFERENCE.md updated (if applicable)
- [ ] NPM script added (if applicable)
- [ ] Example created (if applicable)

---

## Common Patterns

### Pattern 1: Execute Shell Command

```javascript
const { exec } = require('child_process');
const cmd = 'your-command';

exec(cmd, (error, stdout, stderr) => {
  const result = {
    success: !error,
    timestamp: new Date().toISOString(),
    output: stdout,
    error: stderr || null,
  };
  console.log(JSON.stringify(result, null, 2));
  process.exit(error ? 1 : 0);
});
```

### Pattern 2: Read Environment Variable

```javascript
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '../../backend/.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const getEnv = (key) => {
  const match = envContent.match(new RegExp(`^${key}=(.*)$`, 'm'));
  return match ? match[1].trim() : '';
};

const dbHost = getEnv('DB_HOST');
```

### Pattern 3: File Operations

```javascript
const fs = require('fs');
const path = require('path');

// Check if file exists
if (!fs.existsSync(filePath)) {
  console.error(
    JSON.stringify(
      {
        success: false,
        error: `File not found: ${filePath}`,
      },
      null,
      2,
    ),
  );
  process.exit(1);
}

// Read file
const content = fs.readFileSync(filePath, 'utf8');

// Write file
fs.writeFileSync(outputPath, data, 'utf8');
```

---

## Need Help?

- **Template**: `agent-tools/templates/tool-template.js`
- **Examples**: Look at existing tools in each category
- **Documentation**: `agent-tools/README.md`
- **Questions**: Check `AGENT-TOOLS-GUIDE.md`

---

**Adding a tool is simple and fast** - Follow the template, test thoroughly, document clearly!

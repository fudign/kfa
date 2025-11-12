# [Category Name] Tools

[Brief description of what these tools do]

## Tools

### [tool-name].js

[Brief description of the tool]

```bash
node [category]/[tool-name].js [--option=value]
```

**Options:**

- `--option=value` - [Description]
- `--flag` - [Description]

**Output:** [Description of JSON output]

**Example:**

```bash
node [category]/[tool-name].js --option=test
```

**Output:**

```json
{
  "success": true,
  "timestamp": "2025-11-11T12:00:00.000Z",
  "data": {},
  "error": null
}
```

---

### [another-tool].js

[Brief description]

```bash
node [category]/[another-tool].js [options]
```

**Output:** [Description]

---

## Examples

### Example 1: Basic Usage

```bash
# Run the tool
node [category]/[tool-name].js --option=value

# Save output to file
node [category]/[tool-name].js --option=value > result.json
```

### Example 2: Chain Operations

```bash
# Chain multiple tools
node [category]/tool1.js > r1.json && \
  node [category]/tool2.js --input=$(cat r1.json | jq -r '.field') > r2.json
```

### Example 3: Error Handling

```bash
# Check if tool succeeded
node [category]/[tool-name].js > result.json
if [ $? -eq 0 ]; then
  echo "Success!"
else
  echo "Failed!"
  cat result.json | jq '.error'
fi
```

---

## Common Patterns

### Parse Output with jq

```bash
# Extract specific field
VALUE=$(node [category]/tool.js | jq -r '.field')

# Check success
SUCCESS=$(node [category]/tool.js | jq -r '.success')
if [ "$SUCCESS" = "true" ]; then
  echo "Tool succeeded"
fi
```

### Save and Reuse Results

```bash
# Save result
node [category]/tool.js > result.json

# Use later
FIELD=$(cat result.json | jq -r '.field')
echo "Field value: $FIELD"
```

### Conditional Execution

```bash
# Run tool2 only if tool1 succeeds
if node [category]/tool1.js > r1.json; then
  node [category]/tool2.js --input=$(cat r1.json | jq -r '.output')
else
  echo "Tool1 failed, skipping tool2"
fi
```

---

## Error Codes

| Code | Meaning       |
| ---- | ------------- |
| 0    | Success       |
| 1    | General error |

---

## Output Format

All tools in this category output JSON with this structure:

```json
{
  "success": boolean,
  "timestamp": "ISO 8601 string",
  "error": "error message or null",
  "[tool-specific fields]": "values"
}
```

This format enables:

- ✅ Easy parsing with `jq`
- ✅ Consistent error handling
- ✅ Chainable operations
- ✅ Clear success/failure status

---

## Context Efficiency

| Operation       | Context Cost |
| --------------- | ------------ |
| Load README     | ~[X] tokens  |
| Execute tool    | 0 tokens     |
| Chain [N] tools | ~[X] tokens  |

Results are saved to files, consuming **0 tokens** of agent context!

---

## Tips

1. **Pipe to files** - Save results for later use
2. **Use jq** - Parse JSON outputs easily
3. **Chain commands** - Use `&&` for sequential operations
4. **Check exit codes** - `$?` gives last command's exit code
5. **Read the output** - Each tool documents its output format

---

## Related

- **Main README**: `../README.md`
- **Quick Reference**: `../QUICK-REFERENCE.md`
- **Usage Guide**: `../USAGE-GUIDE.md`
- **Examples**: `../examples/`

---

**[Category Name] tools** - Simple, composable, efficient. Part of the lightweight agent tools system.

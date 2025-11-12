# Documentation Tools

Generate and validate documentation. Output markdown or JSON.

## Tools

### generate-api.js

Generate API documentation from Laravel routes.

```bash
node docs/generate-api.js
```

Output: API docs markdown + route list JSON

### validate-docs.js

Check documentation completeness.

```bash
node docs/validate-docs.js
```

Output: Missing/outdated docs JSON

### generate-schema.js

Generate database schema documentation.

```bash
node docs/generate-schema.js
```

Output: Schema docs markdown + ERD data JSON

## Examples

```bash
# Generate API docs
node docs/generate-api.js > api-docs.md

# Validate documentation
node docs/validate-docs.js > docs-status.json

# Generate schema docs
node docs/generate-schema.js > schema-docs.md
```

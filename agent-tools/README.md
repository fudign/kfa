# Agent Tools

Lightweight CLI tools for KFA project operations. Each tool is composable and outputs to files for chaining.

## Usage

```bash
node agent-tools/<category>/<tool>.js [options] > output.txt
```

## Categories

- **db/** - Database operations (migrate, seed, backup, restore)
- **deploy/** - Deployment helpers (build, verify, rollback)
- **test/** - Testing utilities (run, report, coverage)
- **docs/** - Documentation tools (generate, validate)
- **media/** - Media management (optimize, upload)

## Philosophy

These tools follow the principle: **simple, composable, file-based**.

- No bloated dependencies
- Output to stdout/files for chaining
- Easy to extend and modify
- Minimal context consumption

Each tool is <100 LOC and well-documented.

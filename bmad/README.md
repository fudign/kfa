# BMAD - Simplified Structure

BMAD (Better Model for Agentic Development) - Streamlined for KFA project.

## Active Module

- **kfa/** - KFA-specific workflows

## Archived Modules

Archived modules moved to `_archive/` to reduce context usage:

- core/, bmb/, bmd/, bmm/ (26K tokens saved)

## Recommended Approach

Use **KFA CLI** with Prime Prompts instead of BMAD workflows:

```bash
kfa prime list              # 20 ready-to-use prompts
kfa prime use <name> "<context>"
```

## Benefits

- 99% context reduction (26K → 200 tokens)
- Faster workflow execution
- No YAML configuration needed
- Self-contained prompts

## Context Efficiency

Before: 26,000 tokens (BMAD modules)
After: 200 tokens (KFA CLI)
Improvement: 99.2% reduction

For legacy BMAD workflows, see `_archive/` directory.

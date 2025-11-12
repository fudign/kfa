# KFA BMAD Module

KFA-specific workflows for the Kyrgyz Forensic Association project.

## Quick Start

```bash
# Via BMAD (if using BMAD framework)
/bmad:kfa:workflows:kfa-charter

# Via KFA CLI (recommended)
kfa prime list
kfa prime use <category>/<prompt> "<context>"
```

## Available Workflows

- **kfa-charter** - Generate KFA charter documents

## Integration with KFA CLI

KFA CLI provides 20 prime prompts covering:
- Development (6 prompts)
- Refactoring (4 prompts)
- Testing (4 prompts)
- Debugging (3 prompts)
- Documentation (3 prompts)

Use `kfa prime list` to see all available prompts.

## Context Efficiency

- Total context: ~200 tokens
- Workflows loaded: On-demand only
- Prime prompts: Self-contained

For detailed workflow information, see individual workflow directories.

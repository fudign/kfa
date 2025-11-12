# KFA CLI

Unified command-line interface for KFA project operations.

## Quick Start

```bash
# Database
kfa db status           # Check database status
kfa db migrate          # Run migrations
kfa db seed             # Seed database
kfa db backup           # Create backup

# Testing
kfa test all            # Run all tests

# Deployment
kfa deploy verify       # Verify deployment readiness

# Development
kfa dev check           # Check dev environment

# Cache
kfa cache status        # Show cache statistics
kfa cache clear         # Clear all caches
kfa cache warm          # Warm cache with common queries

# Project
kfa project info        # Show project information
kfa project health      # Check project health

# Prime Prompts (NEW!)
kfa prime list          # List all prompts
kfa prime show <name>   # Show prompt details
kfa prime use <name> "<context>"  # Use prompt with context

# ADW Integration (Python Workflows)
kfa adw check           # Check ADW availability (uv, Python)
kfa adw prompt "..."    # Run ad-hoc Claude Code prompt
kfa adw slash /cmd      # Execute slash command
kfa adw chore "..."     # Run full workflow (plan + implement)
kfa adw status          # Show latest execution status

# Observability & Metrics
kfa project metrics     # Show metrics (today/week/month)
kfa history show        # Show command history
kfa history clear       # Clear old data
```

## Commands

- **db** - Database operations (status, migrate, seed, backup)
- **test** - Testing utilities (all)
- **deploy** - Deployment helpers (verify)
- **dev** - Development tools (check)
- **cache** - Cache management (status, clear, warm)
- **project** - Project information (info, health, metrics) - includes metrics dashboard!
- **prime** - Prime prompts library (list, show, use) - 20 ready-to-use prompts!
- **adw** - Python workflow integration (check, prompt, slash, chore, status) - AI Developer Workflows!
- **agent** - BMAD agent operations (list, run) - redirects to prime prompts
- **history** - Command history (show, clear) - observability & tracking!

## Help

```bash
kfa --help              # Show this help
kfa <command> --help    # Show command help
```

## Context Efficiency

- **Total context:** ~200 tokens (0.1% of budget)
- **Commands loaded:** On-demand only
- **Caching:** 6-hour TTL for repeated operations
- **Output format:** JSON for composition, text for humans

## Features

- Intelligent caching with 6-hour TTL
- File-based results (zero context consumption)
- JSON output for all commands
- Context preservation across calls
- Zero external dependencies (Node.js commands)
- Python workflow integration (ADW via uv)
- Unified interface for all project operations
- Full observability (metrics, logs, history)
- Automatic command tracking and analytics

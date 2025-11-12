# KFA CLI - Quick Start Guide

## Installation

```bash
cd kfa-cli
./install.sh
```

Or local usage:
```bash
node kfa-cli/bin/kfa.js <command>
```

## Essential Commands

### Check Status
```bash
kfa --version
kfa project info
kfa project health
kfa db status
```

### Development
```bash
kfa dev check          # Check dev environment
kfa cache status       # Check cache
kfa cache warm         # Warm cache
```

### Database
```bash
kfa db status          # Check DB (cached 6h)
kfa db migrate         # Run migrations
kfa db seed            # Seed database
kfa db backup          # Create backup
```

### Testing & Deployment
```bash
kfa test all           # Run all tests
kfa deploy verify      # Verify deployment
```

## Features

- **99% context reduction** (25K → 200 tokens)
- **6-hour intelligent caching**
- **JSON output** for all commands
- **Zero dependencies**
- **File-based results** (zero context)

## Help

```bash
kfa --help
kfa <command> --help
```

## Documentation

- README.md - Progressive disclosure overview
- INSTALL.md - Installation guide
- KFA-CLI-PHASE-1-COMPLETE.md - Full summary

Ready to use!

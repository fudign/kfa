# KFA CLI Installation Guide

## Prerequisites

- Node.js >= 14.0.0
- npm or yarn

## Installation Methods

### Method 1: Global Installation (Recommended)

```bash
cd kfa-cli
./install.sh
```

This will install `kfa` command globally.

### Method 2: Local Installation

```bash
cd kfa-cli
npm install
```

Then use: `node bin/kfa.js <command>`

### Method 3: NPM Link (Development)

```bash
cd kfa-cli
npm link
```

This creates a symlink to the local development version.

## Verification

```bash
kfa --version
kfa --help
kfa db status
```

## Uninstallation

```bash
npm unlink kfa-cli
```

## Troubleshooting

### Permission Errors

```bash
sudo chmod +x bin/kfa.js
```

### Command Not Found

Add npm global bin to PATH:

```bash
export PATH="$PATH:$(npm bin -g)"
```

Add to `~/.bashrc` or `~/.zshrc` to make permanent.

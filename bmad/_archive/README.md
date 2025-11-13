# BMAD Modules Archive

This directory contains archived BMAD modules that are not actively used in the KFA project.

## Archived Modules

- **core/** - BMAD Core workflows (brainstorming, party-mode, etc.)
- **bmb/** - BMAD Builder module
- **bmd/** - BMAD Documentation module
- **bmm/** - BMAD Manager module

## Why Archived?

As part of Phase 3 (BMAD Simplification), we focused the project on KFA-specific workflows only, reducing context usage from 26K to 2K tokens (92% reduction).

## Restoration

If you need any of these modules:

1. Copy the module from \_archive/ back to bmad/
2. Update bmad/\_cfg/manifest.yaml
3. Restart your workflow

## Date Archived

2025-11-12

## Active Module

Only **kfa/** module remains active with KFA-specific workflows.

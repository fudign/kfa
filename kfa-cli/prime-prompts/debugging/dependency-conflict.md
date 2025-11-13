# Prime Prompt: Dependency Conflict Resolution

Resolve dependency conflicts and version incompatibilities.

## Usage

```bash
kfa prime use debugging/dependency-conflict "Resolve React version conflict"
```

## Prompt Template

I need to resolve dependency conflicts:

**Context:** {CONTEXT}

### Investigation

- Run `npm ls` or `yarn why`
- Check peer dependency warnings
- Review package.json versions
- Check for duplicate packages
- Review lock file conflicts

### Resolution Strategies

- Update to compatible versions
- Use resolutions (yarn) or overrides (npm)
- Find alternative packages
- Fork and patch if necessary
- Use peer dependency ranges correctly

### Testing After Resolution

- Run all tests
- Test in production-like environment
- Check for breaking changes
- Verify all features work
- Test build process

## Success Criteria

- ✅ No dependency warnings
- ✅ All packages compatible
- ✅ Build succeeds
- ✅ All features work

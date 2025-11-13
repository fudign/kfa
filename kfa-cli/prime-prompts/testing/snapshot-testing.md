# Prime Prompt: Snapshot Testing

Implement snapshot tests for UI components and API responses.

## Usage

```bash
kfa prime use testing/snapshot-testing "Add snapshot tests for components"
```

## Prompt Template

I need snapshot tests for:

**Context:** {CONTEXT}

### Component Snapshots

- Render components with different props
- Test various states (loading, error, success)
- Test responsive layouts
- Test dark/light themes

### API Snapshots

- Capture API response structure
- Test response transformations
- Verify data shapes

### Best Practices

- Keep snapshots small
- Review snapshots in PRs
- Update snapshots intentionally
- Don't snapshot dynamic data (dates, IDs)

## Success Criteria

- ✅ Key components have snapshots
- ✅ Snapshots are readable
- ✅ Changes detected properly

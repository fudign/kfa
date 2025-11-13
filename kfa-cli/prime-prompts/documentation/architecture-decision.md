# Architecture Decision Record Prime Prompt

Document important architectural decisions.

## Usage

```bash
kfa prime use architecture-decision "Choice of state management solution"
```

## Prompt Template

Document architectural decision: {CONTEXT}

## ADR Format

```markdown
# ADR-{number}: {Title}

Date: YYYY-MM-DD
Status: Proposed | Accepted | Deprecated | Superseded

## Context

What is the issue that we're seeing?

## Decision

What is the change that we're proposing?

## Consequences

What becomes easier or more difficult?

### Positive

- ...

### Negative

- ...

## Alternatives Considered

1. Alternative 1: ...
2. Alternative 2: ...

## References

- Link 1
- Link 2
```

## Expected Output

ADR document in docs/adr/

## Success Criteria

- Decision clearly explained
- Rationale documented
- Alternatives considered
- Team aligned

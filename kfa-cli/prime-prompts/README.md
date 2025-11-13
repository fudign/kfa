# Prime Prompts Library

Ready-to-use prompts for common development tasks.

## Quick Start

```bash
kfa prime list                                    # List all prompts
kfa prime show development/feature-implementation # Show prompt details
kfa prime use development/feature-implementation "Add news filtering"
```

## Categories

### Development (6 prompts)

- `feature-implementation` - Complete feature implementation
- `api-endpoint` - Create REST API endpoint
- `database-migration` - Create database migration
- `state-management` - Implement state management
- `form-with-validation` - Create form with validation
- `authentication-flow` - Implement auth flow

### Refactoring (4 prompts)

- `extract-component` - Extract reusable component
- `optimize-performance` - Optimize performance
- `improve-types` - Improve TypeScript types
- `remove-duplication` - Remove code duplication

### Testing (4 prompts)

- `add-unit-tests` - Add unit tests
- `add-e2e-tests` - Add E2E tests
- `fix-flaky-test` - Fix flaky tests
- `test-coverage-analysis` - Analyze test coverage

### Debugging (3 prompts)

- `find-bug-root-cause` - Find bug root cause
- `fix-production-issue` - Handle production issues
- `performance-profiling` - Profile performance

### Documentation (3 prompts)

- `api-documentation` - Document API endpoints
- `architecture-decision` - Document architectural decisions
- `onboarding-guide` - Create onboarding guide

## Total: 20 Prime Prompts

## Usage Pattern

1. **Find prompt**: `kfa prime list`
2. **Review prompt**: `kfa prime show <category>/<name>`
3. **Use prompt**: `kfa prime use <category>/<name> "<your context>"`
4. **Copy output** and use with AI assistant

## Benefits

- **Consistent**: Follow best practices
- **Fast**: No need to write prompts from scratch
- **Comprehensive**: Cover all bases
- **KFA-specific**: Tailored to project architecture

## Adding Custom Prompts

1. Create .md file in appropriate category
2. Follow existing prompt structure
3. Include sections: Usage, Prompt Template, Expected Output, Success Criteria
4. Run `kfa prime list` to see your new prompt

## Context Efficiency

Each prompt is self-contained and includes only necessary context:

- No external dependencies
- Clear instructions
- Expected outputs defined
- Success criteria included

**Result**: AI assistant has everything needed in one prompt!

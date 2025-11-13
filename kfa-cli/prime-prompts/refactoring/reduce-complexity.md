# Prime Prompt: Reduce Code Complexity

Simplify complex code to improve readability and maintainability.

## Usage

```bash
kfa prime use refactoring/reduce-complexity "Simplify handleSubmit function"
```

## Prompt Template

I need you to reduce code complexity:

**Context:** {CONTEXT}

Please simplify by:

### 1. Extract Complex Logic

- Extract nested conditionals to functions
- Break down long functions (<50 lines)
- Extract complex calculations
- Create helper functions with clear names

### 2. Reduce Nesting

- Use early returns (guard clauses)
- Invert conditions when helpful
- Extract nested loops
- Flatten promise chains with async/await

### 3. Simplify Conditionals

- Use lookup tables instead of switch/if-else chains
- Extract boolean expressions to named variables
- Use ternary for simple cases
- Remove redundant conditions

### 4. Improve Readability

- Use descriptive variable names
- Add comments for complex logic
- Remove dead code
- Consistent formatting

### 5. Reduce Cognitive Load

- One level of abstraction per function
- Limit function parameters (<4)
- Use object parameters for many params
- Group related logic

### 6. Metrics to Improve

- Cyclomatic complexity <10
- Max nesting depth: 3
- Function length <50 lines
- Parameter count <4

## Success Criteria

- ✅ Complexity reduced measurably
- ✅ Code is more readable
- ✅ Functions have single purpose
- ✅ All tests pass
- ✅ No bugs introduced

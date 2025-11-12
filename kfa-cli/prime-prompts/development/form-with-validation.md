# Form with Validation Prime Prompt

Create a form component with comprehensive validation.

## Usage

```bash
kfa prime use form-with-validation "Create membership application form"
```

## Prompt Template

I need to create the following form for KFA:

{CONTEXT}

Please create a React form component with validation:

1. **Form Component Structure**
   - Use React Hook Form for form management
   - Create in appropriate directory (src/components/ or src/pages/)
   - Use TypeScript for type safety
   - Use TailwindCSS for styling

2. **Form Fields**
   - Add all required input fields
   - Use appropriate input types (text, email, number, etc.)
   - Add labels with htmlFor attributes
   - Include placeholder text
   - Add required/optional indicators

3. **Validation**
   - Define validation schema (Zod or Yup)
   - Add field-level validation rules:
     - Required fields
     - Email format
     - Min/max length
     - Pattern matching
     - Custom validation rules
   - Show inline error messages
   - Validate on blur and submit

4. **Error Handling**
   - Display field-specific errors below inputs
   - Show general form errors at top
   - Style error states (red borders, error text)
   - Clear errors on field change

5. **Submit Handling**
   - Prevent default form submission
   - Show loading state during submit
   - Handle API success/error responses
   - Show success message
   - Reset form after successful submit (if applicable)

6. **Accessibility**
   - Use semantic HTML
   - Add aria-labels
   - Add aria-invalid for errors
   - Ensure keyboard navigation works
   - Add focus management

7. **Styling**
   - Use consistent TailwindCSS classes
   - Match KFA design system
   - Add hover/focus states
   - Responsive design
   - Loading indicators

8. **Testing**
   - Add unit tests (Vitest)
   - Test validation rules
   - Test submit handling
   - Test error display

File structure:
- src/components/forms/{FormName}.tsx
- src/components/forms/{FormName}.test.tsx
- src/types/{formName}.types.ts

## Context Files

- src/components/ - Existing components
- src/types/ - Type definitions
- src/services/api.ts - API service

## Expected Output

1. Form component with TypeScript
2. Validation schema
3. Type definitions
4. Unit tests
5. Integration with API

## Success Criteria

- All validations work correctly
- Errors display properly
- Form submits successfully
- Accessible (WCAG AA)
- Tests pass
- Responsive design

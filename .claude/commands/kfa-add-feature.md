# Add New Feature to KFA

You are helping add a new feature to the KFA project.

## Context

KFA is a full-stack application for a kickboxing federation:

- **Frontend:** kfa-website (React + TypeScript + Vite + Tailwind)
- **Backend:** kfa-backend (PHP/Laravel API)
- **Database:** Supabase (PostgreSQL)
- **Features:** News, Events, Partners, Settings, Media upload

## Your Task

Follow these steps to add a feature:

### 1. Database Layer

- Create migration SQL file: `CREATE-{FEATURE}-TABLE.sql`
- Include RLS policies for security
- Add proper indexes for performance
- Consider relationships with existing tables

### 2. TypeScript Types

- Add types to `kfa-website/src/types/index.ts`
- Ensure types match database schema exactly
- Include form validation types if needed

### 3. API Layer

- Create API functions in `kfa-website/src/lib/supabase-{feature}.ts`
- Include CRUD operations: fetch, create, update, delete
- Add proper error handling
- Use service role key for admin operations

### 4. Frontend Components

- Create components in `kfa-website/src/components/`
- Follow existing patterns (see NewsSection, PartnersSection)
- Use Tailwind for styling
- Ensure mobile responsiveness

### 5. Dashboard Integration

- Add management page in `kfa-website/src/pages/dashboard/`
- Follow pattern from `NewsManager.tsx` or `PartnersManager.tsx`
- Include create/edit/delete operations
- Add proper loading states and error handling

### 6. Testing

- Create test tool in `agent-tools/test/`
- Test API endpoints
- Verify RLS policies work correctly
- Check mobile responsiveness

### 7. Documentation

- Update relevant README files
- Add usage examples
- Document any environment variables needed

## Existing Patterns to Follow

Check these files for patterns:

- `kfa-website/src/components/sections/NewsSection.tsx` - Section component
- `kfa-website/src/pages/dashboard/NewsManager.tsx` - Dashboard manager
- `kfa-website/src/lib/supabase-news.ts` - API functions
- `supabase-cms-tables.sql` - Database schema

## Testing

After implementation, use these tools:

```bash
# Test database connection
node agent-tools/supabase/test-connection.js

# Test frontend build
node agent-tools/deploy/build-frontend.js

# Run E2E tests
node agent-tools/test/run-e2e.js
```

## Output

Provide:

1. Database migration SQL
2. TypeScript types
3. API functions
4. React components
5. Dashboard page
6. Test script
7. Brief usage guide

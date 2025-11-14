# Fix Database Issues

You are helping with the KFA project database issues.

## Context

KFA uses:

- **Frontend:** kfa-website (React + TypeScript + Vite)
- **Backend:** kfa-backend (PHP/Laravel)
- **Database:** Supabase (PostgreSQL)
- **CMS:** Dashboard for managing content (news, events, partners, settings)

## Your Task

1. **Analyze the issue:**
   - Read the user's description of the database problem
   - Check relevant files in `kfa-website/src/lib/` for API calls
   - Check `supabase-*.sql` files for schema issues
   - Review error messages or logs

2. **Common Issues:**
   - RLS (Row Level Security) policies blocking access
   - Missing columns or tables
   - Permission issues with service role vs anon key
   - Type mismatches between frontend and backend
   - Missing foreign key constraints

3. **Fix the issue:**
   - If SQL changes needed, create a new migration file: `FIX-{ISSUE}-{DATE}.sql`
   - Update TypeScript types in `kfa-website/src/types/index.ts` if needed
   - Update API functions in `kfa-website/src/lib/supabase-*.ts` if needed
   - Test the fix using `agent-tools/supabase/test-connection.js`

4. **Validation:**
   - Verify the fix works with `node agent-tools/supabase/test-connection.js`
   - Check that RLS policies are correct
   - Ensure types match between frontend and backend

## Files to Check

- `supabase-cms-tables.sql` - Main schema
- `kfa-website/src/types/index.ts` - TypeScript types
- `kfa-website/src/lib/supabase-*.ts` - API functions
- `agent-tools/supabase/` - Testing tools

## Output

Provide:

1. Clear explanation of what was wrong
2. SQL file with the fix
3. Any TypeScript changes needed
4. Test command to verify the fix

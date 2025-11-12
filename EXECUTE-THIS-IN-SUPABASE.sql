-- ============================================================================
-- KFA Complete Setup SQL (Generated automatically)
-- Run this in Supabase SQL Editor
-- ============================================================================

-- STEP 1: Create profiles table
-- ============================================================================
-- Supabase Auth Setup for KFA Project
-- ============================================================================
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/eofneihisbhucxcydvac/sql

-- ============================================================================
-- 1. Create profiles table (extends auth.users)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'editor', 'moderator', 'member', 'guest')),
  roles TEXT[] DEFAULT ARRAY['member'],
  permissions TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add index for performance
CREATE INDEX IF NOT EXISTS profiles_email_idx ON public.profiles(email);
CREATE INDEX IF NOT EXISTS profiles_role_idx ON public.profiles(role);

-- ============================================================================
-- 2. Enable Row Level Security (RLS)
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 3. RLS Policies for profiles table
-- ============================================================================

-- Policy: Anyone can view profiles (public read)
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

-- Policy: Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy: Only admins can delete profiles
CREATE POLICY "Only admins can delete profiles"
  ON public.profiles FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND 'admin' = ANY(roles)
    )
  );

-- ============================================================================
-- 4. Function to automatically create profile on signup
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role, roles)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    'member',
    ARRAY['member']
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 5. Trigger to call the function on user creation
-- ============================================================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 6. Function to update updated_at timestamp
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 7. Trigger to update updated_at on profile changes
-- ============================================================================
DROP TRIGGER IF EXISTS on_profile_updated ON public.profiles;

CREATE TRIGGER on_profile_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- 8. Seed admin user (optional - create manually via Supabase Auth UI)
-- ============================================================================
-- IMPORTANT: After creating an admin user via Supabase Auth UI, run:
-- UPDATE public.profiles
-- SET role = 'admin', roles = ARRAY['admin', 'editor', 'moderator', 'member']
-- WHERE email = 'admin@kfa.kg';

-- ============================================================================
-- 9. Helper function to check if user has role
-- ============================================================================
CREATE OR REPLACE FUNCTION public.user_has_role(user_id UUID, check_role TEXT)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id AND check_role = ANY(roles)
  );
$$ LANGUAGE SQL SECURITY DEFINER;

-- ============================================================================
-- 10. Helper function to check if user has permission
-- ============================================================================
CREATE OR REPLACE FUNCTION public.user_has_permission(user_id UUID, check_permission TEXT)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id AND check_permission = ANY(permissions)
  );
$$ LANGUAGE SQL SECURITY DEFINER;

-- ============================================================================
-- 11. Create test users (run after setup)
-- ============================================================================
COMMENT ON TABLE public.profiles IS 'Extended user profiles for KFA members';

-- ============================================================================
-- INSTRUCTIONS FOR USE:
-- ============================================================================
-- 1. Copy this entire SQL script
-- 2. Go to Supabase Dashboard > SQL Editor
-- 3. Paste and run the script
-- 4. Create test users via:
--    - Supabase Dashboard > Authentication > Users > Add User
--    - Or via your app's registration page
-- 5. To create admin user:
--    a. Create user via Auth UI (email: admin@kfa.kg, password: your-password)
--    b. Run: UPDATE public.profiles SET role = 'admin', roles = ARRAY['admin'] WHERE email = 'admin@kfa.kg';

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
-- Check if profiles table exists:
-- SELECT * FROM public.profiles;

-- Check RLS policies:
-- SELECT * FROM pg_policies WHERE tablename = 'profiles';

-- Test profile creation (after user signup):
-- SELECT * FROM public.profiles WHERE email = 'test@example.com';

-- Check user roles:
-- SELECT email, role, roles, permissions FROM public.profiles;


-- STEP 2: Insert profiles for existing users

-- User: member@kfa.kg
INSERT INTO public.profiles (id, email, name, role, roles, permissions)
VALUES (
  'cb4bedbf-4aa9-47aa-ae4f-5aaec02ff58d',
  'member@kfa.kg',
  'Member User',
  'member',
  ARRAY['member'],
  ARRAY['content.view']
)
ON CONFLICT (id) DO UPDATE SET
  role = EXCLUDED.role,
  roles = EXCLUDED.roles,
  permissions = EXCLUDED.permissions,
  updated_at = NOW();

-- User: moderator@kfa.kg
INSERT INTO public.profiles (id, email, name, role, roles, permissions)
VALUES (
  '3ba20d66-8346-443d-9790-3a2d749202fb',
  'moderator@kfa.kg',
  'Moderator User',
  'moderator',
  ARRAY['moderator'],
  ARRAY['content.view', 'content.edit', 'media.view', 'events.view', 'members.view']
)
ON CONFLICT (id) DO UPDATE SET
  role = EXCLUDED.role,
  roles = EXCLUDED.roles,
  permissions = EXCLUDED.permissions,
  updated_at = NOW();

-- User: editor@kfa.kg
INSERT INTO public.profiles (id, email, name, role, roles, permissions)
VALUES (
  'df822e91-4fff-4b10-b6d9-0c710a133b7f',
  'editor@kfa.kg',
  'Editor User',
  'editor',
  ARRAY['editor'],
  ARRAY['content.view', 'content.create', 'content.edit', 'content.publish', 'media.view', 'media.upload', 'media.edit', 'events.view', 'events.create', 'events.edit']
)
ON CONFLICT (id) DO UPDATE SET
  role = EXCLUDED.role,
  roles = EXCLUDED.roles,
  permissions = EXCLUDED.permissions,
  updated_at = NOW();

-- User: admin@kfa.kg
INSERT INTO public.profiles (id, email, name, role, roles, permissions)
VALUES (
  '63d928a0-28db-4f42-9363-01f9e0fe3ca9',
  'admin@kfa.kg',
  'Admin User',
  'admin',
  ARRAY['admin', 'editor', 'moderator', 'member'],
  ARRAY['content.view', 'content.create', 'content.edit', 'content.delete', 'content.publish', 'media.view', 'media.upload', 'media.edit', 'media.delete', 'events.view', 'events.create', 'events.edit', 'events.delete', 'members.view', 'members.edit', 'partners.view', 'partners.create', 'partners.edit', 'partners.delete', 'settings.view', 'settings.edit', 'analytics.view', 'users.view', 'users.manage']
)
ON CONFLICT (id) DO UPDATE SET
  role = EXCLUDED.role,
  roles = EXCLUDED.roles,
  permissions = EXCLUDED.permissions,
  updated_at = NOW();

-- STEP 3: Verify setup
SELECT email, role, array_length(permissions, 1) as permission_count
FROM public.profiles
ORDER BY email;

-- ============================================================================
-- DONE! You should see 4 profiles with permissions
-- ============================================================================

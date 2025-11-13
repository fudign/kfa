-- ============================================================================
-- KFA CMS Tables for Supabase
-- Run this in Supabase SQL Editor after setting up profiles table
-- ============================================================================

-- ============================================================================
-- 1. News Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.news (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  image TEXT,
  featured_image_id BIGINT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  featured BOOLEAN DEFAULT FALSE,
  category TEXT,
  tags TEXT[],
  reading_time INTEGER,
  author_id UUID REFERENCES public.profiles(id),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS news_status_idx ON public.news(status);
CREATE INDEX IF NOT EXISTS news_featured_idx ON public.news(featured);
CREATE INDEX IF NOT EXISTS news_slug_idx ON public.news(slug);
CREATE INDEX IF NOT EXISTS news_author_idx ON public.news(author_id);
CREATE INDEX IF NOT EXISTS news_published_at_idx ON public.news(published_at);

-- Enable RLS
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Public can view published news
CREATE POLICY "Anyone can view published news"
  ON public.news FOR SELECT
  USING (status = 'published' OR auth.uid() IS NOT NULL);

-- Editors and admins can create news
CREATE POLICY "Editors and admins can create news"
  ON public.news FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND ('admin' = ANY(roles) OR 'editor' = ANY(roles))
    )
  );

-- Editors and admins can update news
CREATE POLICY "Editors and admins can update news"
  ON public.news FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND ('admin' = ANY(roles) OR 'editor' = ANY(roles))
    )
  );

-- Only admins can delete news
CREATE POLICY "Only admins can delete news"
  ON public.news FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND 'admin' = ANY(roles)
    )
  );

-- ============================================================================
-- 2. Media Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.media (
  id BIGSERIAL PRIMARY KEY,
  filename TEXT NOT NULL,
  original_filename TEXT,
  path TEXT NOT NULL,
  url TEXT NOT NULL,
  mime_type TEXT,
  size BIGINT,
  width INTEGER,
  height INTEGER,
  alt_text TEXT,
  description TEXT,
  collection TEXT,
  uploader_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS media_collection_idx ON public.media(collection);
CREATE INDEX IF NOT EXISTS media_uploader_idx ON public.media(uploader_id);
CREATE INDEX IF NOT EXISTS media_filename_idx ON public.media(filename);

-- Enable RLS
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Anyone can view media
CREATE POLICY "Anyone can view media"
  ON public.media FOR SELECT
  USING (true);

-- Authenticated users can upload media
CREATE POLICY "Authenticated users can upload media"
  ON public.media FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Users can update their own media, admins can update all
CREATE POLICY "Users can update their own media"
  ON public.media FOR UPDATE
  USING (
    uploader_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND 'admin' = ANY(roles)
    )
  );

-- Users can delete their own media, admins can delete all
CREATE POLICY "Users can delete their own media"
  ON public.media FOR DELETE
  USING (
    uploader_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND 'admin' = ANY(roles)
    )
  );

-- ============================================================================
-- 3. Events Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.events (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  content TEXT,
  image TEXT,
  event_type TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'cancelled', 'completed')),
  featured BOOLEAN DEFAULT FALSE,
  location TEXT,
  address TEXT,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  registration_deadline TIMESTAMPTZ,
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  cpe_hours DECIMAL(4,2),
  price DECIMAL(10,2),
  organizer_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS events_status_idx ON public.events(status);
CREATE INDEX IF NOT EXISTS events_featured_idx ON public.events(featured);
CREATE INDEX IF NOT EXISTS events_slug_idx ON public.events(slug);
CREATE INDEX IF NOT EXISTS events_start_date_idx ON public.events(start_date);
CREATE INDEX IF NOT EXISTS events_organizer_idx ON public.events(organizer_id);

-- Enable RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Public can view published events
CREATE POLICY "Anyone can view published events"
  ON public.events FOR SELECT
  USING (status = 'published' OR auth.uid() IS NOT NULL);

-- Editors and admins can create events
CREATE POLICY "Editors and admins can create events"
  ON public.events FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND ('admin' = ANY(roles) OR 'editor' = ANY(roles) OR 'moderator' = ANY(roles))
    )
  );

-- Editors and admins can update events
CREATE POLICY "Editors and admins can update events"
  ON public.events FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND ('admin' = ANY(roles) OR 'editor' = ANY(roles) OR 'moderator' = ANY(roles))
    )
  );

-- Only admins can delete events
CREATE POLICY "Only admins can delete events"
  ON public.events FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND 'admin' = ANY(roles)
    )
  );

-- ============================================================================
-- 4. Event Registrations Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.event_registrations (
  id BIGSERIAL PRIMARY KEY,
  event_id BIGINT REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled', 'attended')),
  attendance_status TEXT CHECK (attendance_status IN ('present', 'absent')),
  cpe_hours DECIMAL(4,2),
  certificate_url TEXT,
  notes TEXT,
  dietary_requirements TEXT,
  special_needs TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS event_registrations_event_idx ON public.event_registrations(event_id);
CREATE INDEX IF NOT EXISTS event_registrations_user_idx ON public.event_registrations(user_id);
CREATE INDEX IF NOT EXISTS event_registrations_status_idx ON public.event_registrations(status);

-- Enable RLS
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can view their own registrations
CREATE POLICY "Users can view their own registrations"
  ON public.event_registrations FOR SELECT
  USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND ('admin' = ANY(roles) OR 'moderator' = ANY(roles))
  ));

-- Authenticated users can register for events
CREATE POLICY "Authenticated users can register for events"
  ON public.event_registrations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can cancel their own registrations
CREATE POLICY "Users can update their own registrations"
  ON public.event_registrations FOR UPDATE
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND ('admin' = ANY(roles) OR 'moderator' = ANY(roles))
    )
  );

-- ============================================================================
-- 5. Partners Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.partners (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  logo TEXT,
  website TEXT,
  email TEXT,
  phone TEXT,
  category TEXT CHECK (category IN ('platinum', 'gold', 'silver', 'bronze', 'other')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  is_featured BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  social_links JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS partners_status_idx ON public.partners(status);
CREATE INDEX IF NOT EXISTS partners_category_idx ON public.partners(category);
CREATE INDEX IF NOT EXISTS partners_featured_idx ON public.partners(is_featured);
CREATE INDEX IF NOT EXISTS partners_display_order_idx ON public.partners(display_order);

-- Enable RLS
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Public can view active partners
CREATE POLICY "Anyone can view active partners"
  ON public.partners FOR SELECT
  USING (status = 'active' OR auth.uid() IS NOT NULL);

-- Editors and admins can create partners
CREATE POLICY "Editors and admins can create partners"
  ON public.partners FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND ('admin' = ANY(roles) OR 'editor' = ANY(roles))
    )
  );

-- Editors and admins can update partners
CREATE POLICY "Editors and admins can update partners"
  ON public.partners FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND ('admin' = ANY(roles) OR 'editor' = ANY(roles))
    )
  );

-- Only admins can delete partners
CREATE POLICY "Only admins can delete partners"
  ON public.partners FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND 'admin' = ANY(roles)
    )
  );

-- ============================================================================
-- 6. Triggers for updated_at timestamps
-- ============================================================================
CREATE TRIGGER on_news_updated
  BEFORE UPDATE ON public.news
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_media_updated
  BEFORE UPDATE ON public.media
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_events_updated
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_event_registrations_updated
  BEFORE UPDATE ON public.event_registrations
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_partners_updated
  BEFORE UPDATE ON public.partners
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- 7. Sample data (optional)
-- ============================================================================
-- Insert sample news
INSERT INTO public.news (title, slug, content, excerpt, status, featured, published_at)
VALUES
  ('Добро пожаловать в КФА', 'dobro-pozhalovat-v-kfa', 'Мы рады приветствовать вас на новом сайте Кыргызской Федерации Аудиторов!', 'Новый сайт КФА запущен', 'published', true, NOW()),
  ('Предстоящий семинар по МСФО', 'predstoyashchiy-seminar-po-msfo', 'Приглашаем всех участников на семинар по МСФО 15 декабря 2024', 'Семинар по МСФО 15 декабря', 'published', false, NOW())
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- INSTRUCTIONS:
-- ============================================================================
-- 1. First, make sure you've run EXECUTE-THIS-IN-SUPABASE.sql to create profiles table
-- 2. Copy this entire SQL script
-- 3. Go to Supabase Dashboard > SQL Editor
-- 4. Paste and run this script
-- 5. Verify tables were created:
--    SELECT table_name FROM information_schema.tables
--    WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
--
-- 6. Test data access:
--    SELECT * FROM public.news;
--    SELECT * FROM public.media;
--    SELECT * FROM public.events;
--    SELECT * FROM public.partners;

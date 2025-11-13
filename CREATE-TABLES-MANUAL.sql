
      CREATE TABLE IF NOT EXISTS public.news (
        id BIGSERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        content TEXT NOT NULL,
        excerpt TEXT,
        image VARCHAR(500),
        featured_image_id BIGINT,
        status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
        featured BOOLEAN DEFAULT false,
        author_id UUID REFERENCES auth.users(id),
        category VARCHAR(100),
        tags TEXT[],
        published_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_news_slug ON public.news(slug);
      CREATE INDEX IF NOT EXISTS idx_news_status ON public.news(status);
      CREATE INDEX IF NOT EXISTS idx_news_published_at ON public.news(published_at);
      CREATE INDEX IF NOT EXISTS idx_news_featured ON public.news(featured);

      ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

      DROP POLICY IF EXISTS "Anyone can read published news" ON public.news;
      CREATE POLICY "Anyone can read published news"
        ON public.news FOR SELECT
        USING (status = 'published');

      DROP POLICY IF EXISTS "Authenticated users with content.view can read all" ON public.news;
      CREATE POLICY "Authenticated users with content.view can read all"
        ON public.news FOR SELECT TO authenticated
        USING (
          EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND 'content.view' = ANY(profiles.permissions)
          )
        );

      DROP POLICY IF EXISTS "Authenticated users with content.create can insert" ON public.news;
      CREATE POLICY "Authenticated users with content.create can insert"
        ON public.news FOR INSERT TO authenticated
        WITH CHECK (
          EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND 'content.create' = ANY(profiles.permissions)
          )
        );

      DROP POLICY IF EXISTS "Authenticated users with content.edit can update" ON public.news;
      CREATE POLICY "Authenticated users with content.edit can update"
        ON public.news FOR UPDATE TO authenticated
        USING (
          EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND 'content.edit' = ANY(profiles.permissions)
          )
        );

      DROP POLICY IF EXISTS "Authenticated users with content.delete can delete" ON public.news;
      CREATE POLICY "Authenticated users with content.delete can delete"
        ON public.news FOR DELETE TO authenticated
        USING (
          EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND 'content.delete' = ANY(profiles.permissions)
          )
        );

      GRANT ALL ON public.news TO authenticated;
      GRANT SELECT ON public.news TO anon;
      GRANT USAGE, SELECT ON SEQUENCE public.news_id_seq TO authenticated;
    
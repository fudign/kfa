-- !>740=85 B01;8FK =>2>AB59 4;O $
-- 0?CAB8B5 MB>B SQL 2 Supabase SQL Editor

-- #40;O5< B01;8FC 5A;8 >=0 ACI5AB2C5B (4;O G8AB>3> AB0@B0)
DROP TABLE IF EXISTS public.news CASCADE;

-- !>7405< B01;8FC news
CREATE TABLE public.news (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT NOT NULL,
    image TEXT,
    featured_image_id BIGINT,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    featured BOOLEAN DEFAULT false,
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- !>7405< 8=45:AK 4;O >?B8<870F88 70?@>A>2
CREATE INDEX idx_news_slug ON public.news(slug);
CREATE INDEX idx_news_status ON public.news(status);
CREATE INDEX idx_news_featured ON public.news(featured);
CREATE INDEX idx_news_author_id ON public.news(author_id);
CREATE INDEX idx_news_published_at ON public.news(published_at);
CREATE INDEX idx_news_created_at ON public.news(created_at);

-- !>7405< DC=:F8N 4;O 02B><0B8G5A:>3> >1=>2;5=8O updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- !>7405< B@8335@ 4;O 02B><0B8G5A:>3> >1=>2;5=8O updated_at
CREATE TRIGGER update_news_updated_at
    BEFORE UPDATE ON public.news
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- :;NG05< Row Level Security (RLS)
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

-- >;8B8:0: 2A5 <>3CB G8B0BL >?C1;8:>20==K5 =>2>AB8
CREATE POLICY "Anyone can view published news"
    ON public.news
    FOR SELECT
    USING (status = 'published');

-- >;8B8:0: 0CB5=B8D8F8@>20==K5 ?>;L7>20B5;8 <>3CB 2845BL 2A5 =>2>AB8
CREATE POLICY "Authenticated users can view all news"
    ON public.news
    FOR SELECT
    TO authenticated
    USING (true);

-- >;8B8:0: 0CB5=B8D8F8@>20==K5 ?>;L7>20B5;8 <>3CB A>74020BL =>2>AB8
CREATE POLICY "Authenticated users can create news"
    ON public.news
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- >;8B8:0: ?>;L7>20B5;8 <>3CB >1=>2;OBL A2>8 =>2>AB8
CREATE POLICY "Users can update own news"
    ON public.news
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = author_id)
    WITH CHECK (auth.uid() = author_id);

-- >;8B8:0: ?>;L7>20B5;8 <>3CB C40;OBL A2>8 =>2>AB8
CREATE POLICY "Users can delete own news"
    ON public.news
    FOR DELETE
    TO authenticated
    USING (auth.uid() = author_id);

-- ><<5=B0@88 : B01;8F5 8 :>;>=:0<
COMMENT ON TABLE public.news IS '"01;8F0 =>2>AB59 4;O A09B0 $';
COMMENT ON COLUMN public.news.id IS '#=8:0;L=K9 845=B8D8:0B>@ =>2>AB8';
COMMENT ON COLUMN public.news.title IS '03>;>2>: =>2>AB8';
COMMENT ON COLUMN public.news.slug IS 'URL-friendly 25@A8O 703>;>2:0';
COMMENT ON COLUMN public.news.excerpt IS '@0B:>5 >?8A0=85 =>2>AB8';
COMMENT ON COLUMN public.news.content IS '>;=K9 B5:AB =>2>AB8 (?>445@68205B Markdown)';
COMMENT ON COLUMN public.news.image IS 'URL 87>1@065=8O =>2>AB8';
COMMENT ON COLUMN public.news.featured_image_id IS 'ID 87>1@065=8O 87 B01;8FK media';
COMMENT ON COLUMN public.news.status IS '!B0BCA =>2>AB8: draft, published, archived';
COMMENT ON COLUMN public.news.featured IS '71@0==0O =>2>ABL (>B>1@0605BAO =0 3;02=>9)';
COMMENT ON COLUMN public.news.author_id IS 'ID 02B>@0 =>2>AB8';
COMMENT ON COLUMN public.news.published_at IS '0B0 8 2@5<O ?C1;8:0F88';
COMMENT ON COLUMN public.news.created_at IS '0B0 8 2@5<O A>740=8O';
COMMENT ON COLUMN public.news.updated_at IS '0B0 8 2@5<O ?>A;54=53> >1=>2;5=8O';

-- K2>48< 8=D>@<0F8N >1 CA?5H=>< A>740=88
SELECT '"01;8F0 news CA?5H=> A>740=0!' AS result;

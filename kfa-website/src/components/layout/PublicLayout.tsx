import { ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useSettings } from '@/contexts/SettingsContext';

interface PublicLayoutProps {
  children: ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  const { getSetting } = useSettings();

  // SEO настройки из базы данных
  const siteName = getSetting('site_name', 'Кыргызская Ассоциация Финансистов');
  const siteDescription = getSetting('site_description', 'Профессиональное объединение финансистов Кыргызстана');
  const siteKeywords = getSetting('site_keywords', 'финансы, кыргызстан, ассоциация, корпоративное управление');

  return (
    <>
      <Helmet>
        <title>{siteName}</title>
        <meta name="description" content={siteDescription} />
        <meta name="keywords" content={siteKeywords} />

        {/* Open Graph для социальных сетей */}
        <meta property="og:title" content={siteName} />
        <meta property="og:description" content={siteDescription} />
        <meta property="og:type" content="website" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={siteName} />
        <meta name="twitter:description" content={siteDescription} />
      </Helmet>

      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </>
  );
}

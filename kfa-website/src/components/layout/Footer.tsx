import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Youtube, Instagram } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { useSettings } from '@/contexts/SettingsContext';

const navigationLinks = [
  {
    titleKey: 'about',
    links: [
      { labelKey: 'mission', href: '/about#mission' },
      { labelKey: 'history', href: '/about#history' },
      { labelKey: 'team', href: '/about#team' },
      { labelKey: 'documents', href: '/documents' },
    ],
  },
  {
    titleKey: 'services',
    links: [
      { labelKey: 'membership', href: '/membership' },
      { labelKey: 'education', href: '/education' },
      { labelKey: 'certification', href: '/education/certification' },
      { labelKey: 'standards', href: '/standards' },
      { labelKey: 'directors_database', href: '/governance/directors-database' },
    ],
  },
  {
    titleKey: 'governance',
    links: [
      { labelKey: 'code', href: '/governance/code' },
      { labelKey: 'directors_program', href: '/governance/directors' },
      { labelKey: 'community', href: '/governance/community' },
    ],
  },
  {
    titleKey: 'resources',
    links: [
      { labelKey: 'news', href: '/news' },
      { labelKey: 'events', href: '/events' },
      { labelKey: 'research', href: '/research' },
      { labelKey: 'faq', href: '/faq' },
    ],
  },
];

export function Footer() {
  const { t } = useTranslation('common');
  const { getSetting } = useSettings();

  // Динамические ссылки на социальные сети из настроек
  const socialLinks = [
    {
      name: 'Facebook',
      icon: Facebook,
      href: getSetting('social_facebook', 'https://facebook.com/kfa.kg'),
    },
    {
      name: 'Instagram',
      icon: Instagram,
      href: getSetting('social_instagram', 'https://instagram.com/kfa.kg'),
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: getSetting('social_linkedin', 'https://linkedin.com/company/kfa-kg'),
    },
    {
      name: 'Twitter',
      icon: Twitter,
      href: getSetting('social_twitter', 'https://twitter.com/kfa_kg'),
    },
    {
      name: 'YouTube',
      icon: Youtube,
      href: getSetting('social_youtube', 'https://youtube.com/@kfa'),
    },
  ].filter(social => social.href && social.href !== '#');

  // Контактная информация из настроек
  const contactEmail = getSetting('contact_email', 'info@kfa.kg');
  const contactPhone = getSetting('contact_phone', '+996 312 123 456');
  const officeAddress = getSetting('office_address') || t('footer.contact.address');

  return (
    <footer className="bg-primary-900 text-white">
      <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8 lg:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-6 lg:gap-8">
          {/* Brand & Contact */}
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="mb-6">
              <Logo height={48} variant="light" />
              <p className="mt-4 text-sm leading-relaxed text-primary-200">
                {t('footer.brandTagline')}
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent-400" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-relaxed text-primary-100">
                    {officeAddress}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 flex-shrink-0 text-accent-400" />
                <a
                  href={`tel:${contactPhone.replace(/[^+\d]/g, '')}`}
                  className="text-sm text-primary-100 transition-colors hover:text-white"
                >
                  {contactPhone}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 flex-shrink-0 text-accent-400" />
                <a
                  href={`mailto:${contactEmail}`}
                  className="text-sm text-primary-100 transition-colors hover:text-white"
                >
                  {contactEmail}
                </a>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-6 flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-800 text-primary-200 transition-all hover:bg-accent-600 hover:text-white"
                    aria-label={social.name}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Navigation Links */}
          {navigationLinks.map((section) => (
            <div key={section.titleKey}>
              <h4 className="mb-4 h-6 text-sm font-semibold uppercase tracking-wider text-accent-400">
                {t(`footer.nav.${section.titleKey}.title`)}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.labelKey}>
                    <a
                      href={link.href}
                      className="inline-block text-sm text-primary-200 transition-colors hover:text-white hover:underline"
                    >
                      {t(`footer.nav.${section.titleKey}.links.${link.labelKey}`)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-primary-800 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-center text-sm text-primary-300 md:text-left">
              &copy; {new Date().getFullYear()} {t('footer.copyright')}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6">
              <a
                href="/privacy"
                className="text-sm text-primary-300 transition-colors hover:text-white"
              >
                {t('footer.legal.privacy')}
              </a>
              <a
                href="/terms"
                className="text-sm text-primary-300 transition-colors hover:text-white"
              >
                {t('footer.legal.terms')}
              </a>
              <a
                href="/sitemap"
                className="text-sm text-primary-300 transition-colors hover:text-white"
              >
                {t('footer.legal.sitemap')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Youtube } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

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
      { labelKey: 'certification', href: '/education/certification' },
      { labelKey: 'education', href: '/education' },
      { labelKey: 'standards', href: '/standards' },
      { labelKey: 'research', href: '/research' },
    ],
  },
  {
    titleKey: 'governance',
    links: [
      { labelKey: 'code', href: '/governance/code' },
      { labelKey: 'directors', href: '/governance/directors' },
      { labelKey: 'database', href: '/governance/directors-database' },
      { labelKey: 'scorecard', href: '/governance/scorecard' },
      { labelKey: 'community', href: '/governance/community' },
    ],
  },
  {
    titleKey: 'membership',
    links: [
      { labelKey: 'benefits', href: '/membership#benefits' },
      { labelKey: 'join', href: '/membership/join' },
      { labelKey: 'members', href: '/members' },
      { labelKey: 'fees', href: '/membership#fees' },
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

const socialLinks = [
  {
    name: 'Facebook',
    icon: Facebook,
    href: 'https://facebook.com/kfa',
  },
  {
    name: 'Twitter',
    icon: Twitter,
    href: 'https://twitter.com/kfa',
  },
  {
    name: 'LinkedIn',
    icon: Linkedin,
    href: 'https://linkedin.com/company/kfa',
  },
  {
    name: 'YouTube',
    icon: Youtube,
    href: 'https://youtube.com/@kfa',
  },
];

export function Footer() {
  const { t } = useTranslation('common');

  return (
    <footer className="bg-primary-900 text-white">
      <div className="container px-4 py-8 md:px-6 md:py-12 lg:py-16">
        {/* Main Footer Content */}
        <div className="grid gap-8 md:grid-cols-2 md:gap-10 lg:grid-cols-6 lg:gap-8">
          {/* Brand & Contact */}
          <div className="md:col-span-2 lg:col-span-2">
            <div className="mb-6">
              <Logo height={48} variant="light" />
              <p className="mt-4 text-primary-200">
                {t('footer.brandTagline')}
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 flex-shrink-0 text-accent-400" />
                <div>
                  <p className="text-sm text-primary-100">
                    {t('footer.contact.address')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 flex-shrink-0 text-accent-400" />
                <a
                  href="tel:+996312123456"
                  className="text-sm text-primary-100 transition-colors hover:text-white"
                >
                  +996 (312) 12-34-56
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 flex-shrink-0 text-accent-400" />
                <a
                  href="mailto:info@kfa.kg"
                  className="text-sm text-primary-100 transition-colors hover:text-white"
                >
                  info@kfa.kg
                </a>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-6 flex flex-wrap gap-3 md:gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-800 text-primary-200 transition-all hover:bg-accent-600 hover:text-white md:h-10 md:w-10"
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
              <h4 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-accent-400 md:mb-4">
                {t(`footer.nav.${section.titleKey}.title`)}
              </h4>
              <ul className="space-y-2 md:space-y-3">
                {section.links.map((link) => (
                  <li key={link.labelKey}>
                    <a
                      href={link.href}
                      className="inline-block text-sm text-primary-200 transition-colors hover:text-white md:hover:underline"
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
        <div className="mt-8 border-t border-primary-800 pt-6 md:mt-12 md:pt-8">
          <div className="flex flex-col items-center justify-between gap-4 text-sm text-primary-300 md:flex-row md:gap-6">
            <p className="text-center md:text-left">
              &copy; {new Date().getFullYear()} {t('footer.copyright')}
            </p>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              <a href="/privacy" className="transition-colors hover:text-white hover:underline">
                {t('footer.legal.privacy')}
              </a>
              <a href="/terms" className="transition-colors hover:text-white hover:underline">
                {t('footer.legal.terms')}
              </a>
              <a href="/sitemap" className="transition-colors hover:text-white hover:underline">
                {t('footer.legal.sitemap')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

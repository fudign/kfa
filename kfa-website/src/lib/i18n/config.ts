import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: 'ru', // Explicitly set Russian as the default language
    fallbackLng: 'ru',
    supportedLngs: ['ru', 'ky', 'en'],

    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },

    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },

    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: true,
    },

    ns: ['common', 'home', 'about', 'membership', 'join', 'standards', 'education', 'research', 'auth', 'documents', 'faq', 'privacy', 'terms'],
    defaultNS: 'common',
  });

export default i18n;

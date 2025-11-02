import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { ChevronDown, HelpCircle, BookOpen, Users, CreditCard, Award } from 'lucide-react';
import { SEO } from '@/components/seo';
import { generateFAQSchema } from '@/lib/seo/structuredData';

function FAQHeroSection() {
  const { t } = useTranslation('faq');

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 to-primary-800 py-32">
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="container relative">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent-500">
              <HelpCircle className="h-10 w-10 text-white" />
            </div>
          </div>

          <h1 className="mb-6 font-display text-display-xl text-white">
            {t('hero.title')}
          </h1>
          <p className="text-xl leading-relaxed text-primary-50">
            {t('hero.subtitle')}
          </p>
        </div>
      </div>
    </section>
  );
}

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

function FAQItem({ question, answer, isOpen, onToggle }: FAQItemProps) {
  return (
    <div className="overflow-hidden rounded-kfa border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-700"
      >
        <span className="font-semibold text-primary-900 dark:text-primary-100">
          {question}
        </span>
        <ChevronDown
          className={`h-5 w-5 flex-shrink-0 text-primary-600 transition-transform dark:text-primary-400 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      {isOpen && (
        <div className="border-t border-neutral-200 px-6 pb-6 pt-4 dark:border-neutral-700">
          <p className="leading-relaxed text-neutral-600 dark:text-neutral-400">
            {answer}
          </p>
        </div>
      )}
    </div>
  );
}

function FAQSection() {
  const { t } = useTranslation('faq');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const categories = [
    {
      id: 'general',
      icon: BookOpen,
      titleKey: 'categories.general.title',
      questions: ['q1', 'q2', 'q3', 'q4'],
    },
    {
      id: 'membership',
      icon: Users,
      titleKey: 'categories.membership.title',
      questions: ['q1', 'q2', 'q3', 'q4', 'q5'],
    },
    {
      id: 'fees',
      icon: CreditCard,
      titleKey: 'categories.fees.title',
      questions: ['q1', 'q2', 'q3'],
    },
    {
      id: 'certification',
      icon: Award,
      titleKey: 'categories.certification.title',
      questions: ['q1', 'q2', 'q3', 'q4'],
    },
  ];

  const toggleItem = (categoryId: string, questionId: string) => {
    const key = `${categoryId}-${questionId}`;
    setOpenItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <section className="bg-white py-24 dark:bg-neutral-900">
      <div className="container">
        <div className="mx-auto max-w-4xl space-y-12">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <div key={category.id}>
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h2 className="font-display text-2xl font-semibold text-primary-900 dark:text-primary-100">
                    {t(category.titleKey)}
                  </h2>
                </div>

                <div className="space-y-4">
                  {category.questions.map((questionId) => {
                    const key = `${category.id}-${questionId}`;
                    return (
                      <FAQItem
                        key={key}
                        question={t(`categories.${category.id}.items.${questionId}.question`)}
                        answer={t(`categories.${category.id}.items.${questionId}.answer`)}
                        isOpen={!!openItems[key]}
                        onToggle={() => toggleItem(category.id, questionId)}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact Section */}
        <div className="mx-auto mt-16 max-w-2xl rounded-kfa border border-primary-200 bg-gradient-to-br from-primary-50 to-accent-50 p-8 text-center dark:border-primary-800 dark:from-primary-900/20 dark:to-accent-900/20">
          <h3 className="mb-4 font-display text-2xl font-semibold text-primary-900 dark:text-primary-100">
            {t('contact.title')}
          </h3>
          <p className="mb-6 text-neutral-600 dark:text-neutral-400">
            {t('contact.description')}
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="mailto:info@kfa.kg"
              className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white transition-all hover:bg-primary-700"
            >
              {t('contact.emailButton')}
            </a>
            <a
              href="tel:+996312123456"
              className="inline-flex items-center gap-2 rounded-lg border border-primary-600 px-6 py-3 font-semibold text-primary-600 transition-all hover:bg-primary-50 dark:border-primary-400 dark:text-primary-400 dark:hover:bg-primary-900/20"
            >
              {t('contact.phoneButton')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FAQPage() {
  const { t } = useTranslation('faq');

  // Generate FAQ structured data from translations
  const faqItems = [
    // General questions
    ...['q1', 'q2', 'q3', 'q4'].map((q) => ({
      question: t(`categories.general.items.${q}.question`),
      answer: t(`categories.general.items.${q}.answer`),
    })),
    // Membership questions
    ...['q1', 'q2', 'q3', 'q4', 'q5'].map((q) => ({
      question: t(`categories.membership.items.${q}.question`),
      answer: t(`categories.membership.items.${q}.answer`),
    })),
    // Fees questions
    ...['q1', 'q2', 'q3'].map((q) => ({
      question: t(`categories.fees.items.${q}.question`),
      answer: t(`categories.fees.items.${q}.answer`),
    })),
    // Certification questions
    ...['q1', 'q2', 'q3', 'q4'].map((q) => ({
      question: t(`categories.certification.items.${q}.question`),
      answer: t(`categories.certification.items.${q}.answer`),
    })),
  ];

  return (
    <div className="min-h-screen">
      <SEO
        title="Часто задаваемые вопросы"
        description="Ответы на часто задаваемые вопросы о членстве, взносах, сертификации и деятельности Кыргызского Финансового Альянса"
        url="https://kfa.kg/faq"
        keywords="FAQ, вопросы и ответы, членство КФА, взносы, сертификация, требования"
        structuredData={generateFAQSchema(faqItems)}
      />
      <FAQHeroSection />
      <FAQSection />
    </div>
  );
}

import { GraduationCap, BookOpen, Award, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ProgramsOverviewSection } from '@/components/sections/education/ProgramsOverviewSection';
import { CertificationOverviewSection } from '@/components/sections/education/CertificationOverviewSection';
import { UpcomingEventsSection } from '@/components/sections/education/UpcomingEventsSection';

function EducationHeroSection() {
  const { t } = useTranslation('education');

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 to-primary-800 py-24">
      {/* Background Pattern */}
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
          <div className="mb-6 inline-flex rounded-full bg-white/10 p-4 backdrop-blur-sm">
            <GraduationCap className="h-12 w-12 text-white" />
          </div>

          <h1 className="mb-6 font-display text-display-xl text-white">{t('hero.title')}</h1>
          <p className="text-xl leading-relaxed text-primary-50">{t('hero.subtitle')}</p>

          {/* Quick Stats */}
          <div className="mt-12 grid gap-6 md:grid-cols-4">
            <div className="rounded-kfa border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
              <div className="mb-2 flex justify-center">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <div className="mb-1 font-display text-3xl font-bold text-white">12</div>
              <div className="text-sm text-primary-100">{t('hero.stat1')}</div>
            </div>

            <div className="rounded-kfa border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
              <div className="mb-2 flex justify-center">
                <Award className="h-8 w-8 text-white" />
              </div>
              <div className="mb-1 font-display text-3xl font-bold text-white">3</div>
              <div className="text-sm text-primary-100">{t('hero.stat2')}</div>
            </div>

            <div className="rounded-kfa border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
              <div className="mb-2 flex justify-center">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div className="mb-1 font-display text-3xl font-bold text-white">500+</div>
              <div className="text-sm text-primary-100">{t('hero.stat3')}</div>
            </div>

            <div className="rounded-kfa border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
              <div className="mb-2 flex justify-center">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <div className="mb-1 font-display text-3xl font-bold text-white">95%</div>
              <div className="text-sm text-primary-100">{t('hero.stat4')}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function EducationPage() {
  return (
    <div className="min-h-screen">
      <EducationHeroSection />
      <ProgramsOverviewSection />
      <CertificationOverviewSection />
      <UpcomingEventsSection />
    </div>
  );
}

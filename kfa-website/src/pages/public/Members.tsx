import { Users } from 'lucide-react';
import { MembersCatalog } from '@/components/members/MembersCatalog';
import { SEO } from '@/components/seo';

function MembersHeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 to-primary-800 px-4 py-12 md:py-16 lg:py-24">
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
          <div className="mb-4 inline-flex rounded-full bg-white/10 p-3 backdrop-blur-sm md:mb-6 md:p-4">
            <Users className="h-10 w-10 text-white md:h-12 md:w-12" />
          </div>

          <h1 className="mb-4 font-display text-3xl text-white md:mb-6 md:text-4xl lg:text-5xl">
            Члены КФА
          </h1>
          <p className="text-base leading-relaxed text-primary-50 md:text-lg lg:text-xl">
            Профессиональные участники рынка ценных бумаг Кыргызской Республики, объединенные общими целями развития финансового рынка
          </p>
        </div>
      </div>
    </section>
  );
}

export function MembersPage() {
  return (
    <div className="min-h-screen">
      <SEO
        title="Члены КФА"
        description="Каталог членов Кыргызского Финансового Альянса - профессиональные участники рынка ценных бумаг Кыргызстана. Брокеры, дилеры, управляющие компании"
        url="https://kfa.kg/members"
        keywords="члены КФА, участники рынка, брокеры, дилеры, управляющие компании, профессиональные участники"
        image="https://kfa.kg/images/members-og.png"
      />
      <MembersHeroSection />
      <MembersCatalog />
    </div>
  );
}

import { motion } from 'framer-motion';
import { Spotlight } from './spotlight';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, TrendingUp, Award, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface MetricCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  unit?: string;
}

function MetricCard({ icon: Icon, label, value, unit }: MetricCardProps) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-kfa border border-white/10 bg-white/5 p-4 backdrop-blur-sm md:p-6">
      <Icon className="mb-1 h-6 w-6 text-accent-400 md:mb-2 md:h-8 md:w-8" />
      <div className="text-2xl font-bold text-white md:text-3xl">
        {value}
        {unit && <span className="ml-1 text-base text-neutral-300 md:text-lg">{unit}</span>}
      </div>
      <div className="text-xs text-neutral-300 md:text-sm">{label}</div>
    </div>
  );
}

export function HeroSection() {
  const { t } = useTranslation('home');

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-primary-900 via-primary-800 to-primary-700 px-4">
      {/* Aceternity Spotlight Effect */}
      <Spotlight
        className="-top-40 left-0 md:-top-20 md:left-60"
        fill="rgba(212, 175, 55, 0.3)"
      />

      <div className="container relative z-10 flex min-h-screen flex-col items-center justify-center py-16 text-center md:py-20">
        {/* Animated Title */}
        <motion.h1
          className="mb-4 bg-gradient-to-r from-white to-neutral-200 bg-clip-text font-display text-4xl text-transparent md:mb-6 md:text-5xl lg:text-6xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {t('hero.title.part1')} <br />
          <span className="bg-gradient-to-r from-accent-400 to-accent-600 bg-clip-text">
            {t('hero.title.part2')}
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="mb-8 max-w-3xl text-base text-neutral-200 md:mb-12 md:text-lg lg:text-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {t('hero.subtitle')}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col gap-4 sm:flex-row"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Button size="lg" variant="accent" className="group">
            {t('hero.cta.join')}
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white/10"
          >
            {t('hero.cta.login')}
          </Button>
        </motion.div>

        {/* Real-time Metrics */}
        <motion.div
          className="mt-12 grid w-full max-w-4xl grid-cols-2 gap-4 md:mt-20 md:gap-6 lg:grid-cols-4 lg:gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <MetricCard icon={Users} label={t('hero.metrics.members')} value="45" />
          <MetricCard
            icon={TrendingUp}
            label={t('hero.metrics.volume')}
            value="2.5"
            unit={t('hero.metrics.volumeUnit')}
          />
          <MetricCard
            icon={Award}
            label={t('hero.metrics.certified')}
            value="320"
            unit={t('hero.metrics.certifiedUnit')}
          />
          <MetricCard icon={Calendar} label={t('hero.metrics.nextEvent')} value="15 дек" />
        </motion.div>
      </div>

      {/* Animated Background Shapes */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-accent-500/10 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-primary-400/10 blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>
    </div>
  );
}

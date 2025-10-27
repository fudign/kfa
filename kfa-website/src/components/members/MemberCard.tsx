import { Building2, MapPin, Calendar, ArrowRight } from 'lucide-react';

interface MemberCardProps {
  id: number;
  name: string;
  type: 'full' | 'associate';
  category: string;
  city: string;
  memberSince: string;
  description: string;
  logo?: string;
}

const typeColors = {
  full: 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400',
  associate: 'bg-accent-100 text-accent-700 dark:bg-accent-900/30 dark:text-accent-400',
};

const typeLabels = {
  full: 'Полное членство',
  associate: 'Ассоциированное',
};

export function MemberCard({ member }: { member: MemberCardProps }) {
  return (
    <div className="group overflow-hidden rounded-kfa border border-neutral-200 bg-white transition-all hover:border-primary-300 hover:shadow-kfa-lg dark:border-neutral-700 dark:bg-neutral-900">
      {/* Logo */}
      <div className="relative h-40 overflow-hidden bg-gradient-to-br from-primary-50 to-neutral-50 dark:from-neutral-800 dark:to-neutral-900 md:h-48">
        {member.logo ? (
          <img
            src={member.logo}
            alt={member.name}
            className="h-full w-full object-contain p-6 transition-transform duration-300 group-hover:scale-105 md:p-8"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Building2 className="h-20 w-20 text-neutral-300 dark:text-neutral-600 md:h-24 md:w-24" />
          </div>
        )}

        {/* Type Badge */}
        <div className="absolute right-3 top-3 md:right-4 md:top-4">
          <span className={`rounded-full px-2 py-1 text-xs font-semibold md:px-3 ${typeColors[member.type]}`}>
            {typeLabels[member.type]}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-6">
        <h3 className="mb-2 font-display text-lg font-semibold text-primary-900 transition-colors group-hover:text-primary-700 dark:text-primary-100 dark:group-hover:text-primary-400 md:text-xl">
          {member.name}
        </h3>

        <p className="mb-3 text-xs text-neutral-600 dark:text-neutral-400 md:mb-4 md:text-sm">
          {member.category}
        </p>

        <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-neutral-700 dark:text-neutral-300 md:mb-4 md:text-sm">
          {member.description}
        </p>

        {/* Meta Info */}
        <div className="mb-3 space-y-2 border-t border-neutral-200 pt-3 dark:border-neutral-700 md:mb-4 md:pt-4">
          <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400 md:text-sm">
            <MapPin className="h-3 w-3 md:h-4 md:w-4" />
            <span>{member.city}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400 md:text-sm">
            <Calendar className="h-3 w-3 md:h-4 md:w-4" />
            <span>Член с {member.memberSince}</span>
          </div>
        </div>

        {/* CTA */}
        <button className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-neutral-300 px-3 py-2 text-xs font-medium text-neutral-700 transition-colors hover:border-primary-600 hover:text-primary-600 dark:border-neutral-600 dark:text-neutral-300 dark:hover:border-primary-400 dark:hover:text-primary-400 md:px-4 md:text-sm">
          Подробнее
          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1 md:h-4 md:w-4" />
        </button>
      </div>
    </div>
  );
}

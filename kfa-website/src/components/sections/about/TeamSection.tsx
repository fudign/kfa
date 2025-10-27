import { useTranslation } from 'react-i18next';
import { Mail, Linkedin } from 'lucide-react';

interface TeamMember {
  id: number;
  nameKey: string;
  positionKey: string;
  bioKey: string;
  imageUrl: string;
  email?: string;
  linkedin?: string;
}

const leadership: TeamMember[] = [
  {
    id: 1,
    nameKey: 'member1.name',
    positionKey: 'member1.position',
    bioKey: 'member1.bio',
    imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
    email: 'director@kfa.kg',
    linkedin: 'https://linkedin.com/in/example',
  },
  {
    id: 2,
    nameKey: 'member2.name',
    positionKey: 'member2.position',
    bioKey: 'member2.bio',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
    email: 'deputy@kfa.kg',
  },
  {
    id: 3,
    nameKey: 'member3.name',
    positionKey: 'member3.position',
    bioKey: 'member3.bio',
    imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400',
    email: 'secretary@kfa.kg',
  },
];

const team: TeamMember[] = [
  {
    id: 4,
    nameKey: 'member4.name',
    positionKey: 'member4.position',
    bioKey: 'member4.bio',
    imageUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400',
  },
  {
    id: 5,
    nameKey: 'member5.name',
    positionKey: 'member5.position',
    bioKey: 'member5.bio',
    imageUrl: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400',
  },
  {
    id: 6,
    nameKey: 'member6.name',
    positionKey: 'member6.position',
    bioKey: 'member6.bio',
    imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
  },
];

function TeamMemberCard({ member, featured = false }: { member: TeamMember; featured?: boolean }) {
  const { t } = useTranslation('about');

  return (
    <div className="group overflow-hidden rounded-kfa border border-neutral-200 bg-white transition-all hover:border-primary-300 hover:shadow-kfa-lg dark:border-neutral-700 dark:bg-neutral-900">
      {/* Image */}
      <div className={`relative overflow-hidden bg-neutral-100 dark:bg-neutral-800 ${featured ? 'h-64 md:h-72 lg:h-80' : 'h-56 md:h-64'}`}>
        <img
          src={member.imageUrl}
          alt={t(`team.${member.nameKey}`)}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className={`${featured ? 'p-5 md:p-6 lg:p-8' : 'p-4 md:p-6'}`}>
        <h3 className={`mb-2 font-display font-semibold text-primary-900 dark:text-primary-100 ${featured ? 'text-lg md:text-xl lg:text-2xl' : 'text-base md:text-lg lg:text-xl'}`}>
          {t(`team.${member.nameKey}`)}
        </h3>
        <p className="mb-3 text-xs font-medium text-accent-600 dark:text-accent-400 md:mb-4 md:text-sm">
          {t(`team.${member.positionKey}`)}
        </p>
        <p className="mb-3 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400 md:mb-4 md:text-sm">
          {t(`team.${member.bioKey}`)}
        </p>

        {/* Contact */}
        {(member.email || member.linkedin) && (
          <div className="flex gap-2 md:gap-3">
            {member.email && (
              <a
                href={`mailto:${member.email}`}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600 transition-colors hover:bg-primary-600 hover:text-white dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-primary-600 md:h-10 md:w-10"
              >
                <Mail className="h-4 w-4 md:h-5 md:w-5" />
              </a>
            )}
            {member.linkedin && (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600 transition-colors hover:bg-primary-600 hover:text-white dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-primary-600 md:h-10 md:w-10"
              >
                <Linkedin className="h-4 w-4 md:h-5 md:w-5" />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function TeamSection() {
  const { t } = useTranslation('about');

  return (
    <section id="team" className="bg-neutral-50 px-4 py-12 dark:bg-neutral-800 md:py-16 lg:py-24">
      <div className="container">
        {/* Leadership */}
        <div className="mb-12 md:mb-16 lg:mb-20">
          <div className="mb-8 text-center md:mb-12">
            <h2 className="mb-3 font-display text-2xl text-primary-900 dark:text-primary-100 md:mb-4 md:text-3xl lg:text-4xl">
              {t('team.leadership.title')}
            </h2>
            <p className="mx-auto max-w-2xl text-base text-neutral-600 dark:text-neutral-400 md:text-lg">
              {t('team.leadership.subtitle')}
            </p>
          </div>

          <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {leadership.map((member) => (
              <TeamMemberCard key={member.id} member={member} featured />
            ))}
          </div>
        </div>

        {/* Team */}
        <div>
          <div className="mb-8 text-center md:mb-12">
            <h2 className="mb-3 font-display text-xl text-primary-900 dark:text-primary-100 md:mb-4 md:text-2xl lg:text-3xl">
              {t('team.staff.title')}
            </h2>
            <p className="mx-auto max-w-2xl text-sm text-neutral-600 dark:text-neutral-400 md:text-base">
              {t('team.staff.subtitle')}
            </p>
          </div>

          <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {team.map((member) => (
              <TeamMemberCard key={member.id} member={member} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

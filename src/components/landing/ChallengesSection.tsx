import { MapPin, Clock, Users, type LucideIcon } from 'lucide-react';
import { SectionHeader } from '@/components/common/SectionHeader';

interface Challenge {
  icon: LucideIcon;
  title: string;
  description: string;
}

const challenges: Challenge[] = [
  {
    icon: MapPin,
    title: 'Distance from specialists',
    description:
      'Many rural and remote communities are far from eye specialists, so a routine retinal check can mean a long and costly journey.',
  },
  {
    icon: Users,
    title: 'Limited trained reviewers',
    description:
      'Few clinics have trained staff available to review retinal photographs, which can delay results and follow-up care.',
  },
  {
    icon: Clock,
    title: 'Silent progression',
    description:
      'Without early symptoms, people often do not realise they need an eye check until changes may already be affecting their vision.',
  },
];

export function ChallengesSection() {
  return (
    <section id="challenges" className="scroll-mt-20 bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeader
          eyebrow="The challenge"
          title="Screening should not depend on where you live"
          description="Access to retinal screening is uneven. Underserved communities face barriers that can leave diabetic eye disease undetected until it is harder to treat."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {challenges.map(({ icon: Icon, title, description }) => (
            <article
              key={title}
              className="surface-card p-7 transition duration-300 hover:-translate-y-1 hover:shadow-card-hover"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-navy-900">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-navy-600">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

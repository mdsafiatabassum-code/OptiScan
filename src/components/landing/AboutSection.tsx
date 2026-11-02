import { Eye, HeartPulse, HandHeart, MapPinned, ShieldCheck, type LucideIcon } from 'lucide-react';
import { SectionHeader } from '@/components/common/SectionHeader';

interface AboutBlock {
  icon: LucideIcon;
  title: string;
  body: string;
}

const aboutBlocks: AboutBlock[] = [
  {
    icon: Eye,
    title: 'What is diabetic retinopathy?',
    body: 'It is a complication of diabetes that damages the small blood vessels at the back of the eye. It can develop over years without obvious symptoms and, if left untreated, can lead to serious sight loss.',
  },
  {
    icon: HeartPulse,
    title: 'Why early screening matters',
    body: 'Changes in the retina can be seen before they cause noticeable problems. Detecting them early creates more time for monitoring, referral and treatment, which helps protect vision.',
  },
  {
    icon: HandHeart,
    title: 'How AI could help healthcare workers',
    body: 'AI-assisted tools may help staff triage retinal images more consistently and flag those that need specialist attention, so that limited clinical time is used where it matters most.',
  },
  {
    icon: MapPinned,
    title: 'Why rural access matters',
    body: 'People in rural communities often travel long distances for eye care. Screening that can happen closer to home reduces missed appointments and helps more people stay within follow-up care.',
  },
];

export function AboutSection() {
  return (
    <section id="about" className="scroll-mt-20 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeader
              align="left"
              eyebrow="About OptiScan"
              title="Supporting clinicians where screening is hardest to reach"
              description="OptiScan is an early-stage platform exploring how AI-assisted retinal screening could support earlier identification of possible signs of diabetic retinopathy."
            />
            <div className="glass-panel mt-8 flex gap-4 border-primary-300/20 p-5">
              <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-primary-300" aria-hidden="true" />
              <div>
                <p className="font-semibold text-neutral-50">Built to support, not replace, clinicians</p>
                <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                  OptiScan is intended to assist qualified healthcare professionals. It does not diagnose conditions
                  and has not been clinically validated.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {aboutBlocks.map(({ icon: Icon, title, body }) => (
              <article
                key={title}
                className="surface-card p-6 transition duration-300 hover:-translate-y-1 hover:border-primary-300/30"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary-500/10 text-secondary-200 ring-1 ring-inset ring-secondary-400/25">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mt-5 text-base font-bold text-neutral-50">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-neutral-400">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

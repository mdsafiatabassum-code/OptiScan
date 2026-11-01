import { ArrowRight, FileImage, ScanSearch, ClipboardCheck, type LucideIcon } from 'lucide-react';
import { SectionHeader } from '@/components/common/SectionHeader';
import { buttonClasses } from '@/components/common/buttonStyles';
import { Link } from '@/lib/router';

interface Step {
  icon: LucideIcon;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    icon: FileImage,
    title: 'Upload a retinal image',
    description:
      'Select a retinal fundus photograph in JPG, JPEG or PNG format. Check the preview before continuing.',
  },
  {
    icon: ScanSearch,
    title: 'AI-assisted image analysis',
    description:
      'The AI model reviews the image and reports the most likely severity category, with the probabilities it produces.',
  },
  {
    icon: ClipboardCheck,
    title: 'Understand the result and next steps',
    description:
      'Review the screening estimate, its limitations and recommended next steps with a qualified professional.',
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="scroll-mt-20 bg-secondary-50/60 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeader
          eyebrow="How it works"
          title="Three simple steps from image to next steps"
          description="OptiScan keeps screening straightforward for healthcare workers, so attention stays on the patient."
        />

        <div className="relative mt-14">
          <div
            aria-hidden="true"
            className="absolute left-[16%] right-[16%] top-7 hidden h-px bg-gradient-to-r from-brand-200 via-accent-300 to-brand-200 md:block"
          />
          <ol className="grid gap-6 md:grid-cols-3">
            {steps.map(({ icon: Icon, title, description }, index) => (
              <li
                key={title}
                className="surface-card relative p-7 transition duration-300 hover:-translate-y-1 hover:shadow-card-hover"
              >
                <div className="flex items-center gap-4">
                  <span className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-accent-500 text-white shadow-md shadow-brand-600/25">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-semibold uppercase tracking-wider text-navy-500">
                    Step {index + 1}
                  </span>
                </div>
                <h3 className="mt-6 text-lg font-bold text-navy-900">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-navy-600">{description}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-12 flex justify-center">
          <Link to="/screening" className={buttonClasses({ size: 'lg' })}>
            Begin a screening
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

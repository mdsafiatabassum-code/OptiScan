import { useEffect } from 'react';
import { ArrowRight, FileImage, Gauge, Cpu } from 'lucide-react';
import { buttonClasses } from '@/components/common/buttonStyles';
import { InlineAlert } from '@/components/common/InlineAlert';
import { RetinaIllustration } from '@/components/landing/RetinaIllustration';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { cx } from '@/lib/classNames';
import { ACCEPTED_IMAGE_EXTENSIONS, MAX_IMAGE_SIZE_MB } from '@/lib/imageValidation';
import { Link } from '@/lib/router';

const infoTiles = [
  {
    icon: FileImage,
    title: 'Accepted images',
    body: `${ACCEPTED_IMAGE_EXTENSIONS.map((extension) => extension.toUpperCase().slice(1)).join(', ')} up to ${MAX_IMAGE_SIZE_MB} MB. One retinal fundus photograph at a time.`,
  },
  {
    icon: Gauge,
    title: 'Quality checks first',
    body: 'Brightness and sharpness are checked before analysis. An unsuitable photograph can be replaced without generating a report.',
  },
  {
    icon: Cpu,
    title: 'Pretrained model',
    body: 'A ResNet34 network that outputs raw scores for five diabetic retinopathy grades. The scores are uncalibrated.',
  },
];

export function DashboardPage() {
  useEffect(() => {
    document.title = 'Overview | OptiScan';
  }, []);

  return (
    <DashboardLayout
      title="Overview"
      description="Start a screening, check what the model does and understand the limits of what it can tell you."
    >
      <div className="flex flex-col gap-6">
        <section className="surface-card relative overflow-hidden p-6 sm:p-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-primary-400/15 blur-3xl"
          />
          <div className="relative grid items-center gap-8 md:grid-cols-[minmax(0,1fr)_auto]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-300">New screening</p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-neutral-50 sm:text-3xl">
                Analyse a retinal photograph
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-neutral-400 sm:text-base">
                Upload an image, review the quality checks and receive a model-generated estimate with raw scores,
                limitations and suggested next steps.
              </p>
              <Link to="/screening" className={cx(buttonClasses({ size: 'lg' }), 'group mt-7')}>
                Start new screening
                <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            </div>
            <div className="mx-auto hidden h-44 w-44 md:block" aria-hidden="true">
              <RetinaIllustration />
            </div>
          </div>
        </section>

        <div className="grid gap-6 md:grid-cols-3">
          {infoTiles.map(({ icon: Icon, title, body }) => (
            <article key={title} className="surface-card p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-400/10 text-primary-200 ring-1 ring-inset ring-primary-300/20">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-base font-bold text-neutral-50">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-400">{body}</p>
            </article>
          ))}
        </div>

        <InlineAlert tone="warning" title="Research prototype">
          OptiScan has not been clinically validated. Its outputs are model-generated estimates and must be reviewed by a
          qualified eye care professional.
        </InlineAlert>
      </div>
    </DashboardLayout>
  );
}

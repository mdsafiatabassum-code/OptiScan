import { ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from '@/lib/router';
import { buttonClasses } from '@/components/common/buttonStyles';
import { RetinaIllustration } from '@/components/landing/RetinaIllustration';
import { cx } from '@/lib/classNames';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-secondary-50 via-white to-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-32 h-[30rem] w-[30rem] rounded-full bg-accent-100/70 blur-3xl"
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 pb-20 pt-12 sm:px-8 md:pt-20 lg:grid-cols-2 lg:gap-16 lg:pb-28">
        <div className="animate-fade-in-up">
          <p className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-800 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-500" aria-hidden="true" />
            Detect Early. Protect Vision.
          </p>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-navy-900 sm:text-5xl lg:text-6xl">
            See Beyond <span className="text-brand-700">Symptoms.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base text-navy-600 sm:text-lg">
            Diabetic retinopathy can develop quietly, often without noticeable early symptoms. Timely retinal
            screening gives healthcare workers the chance to identify possible warning signs early, when vision can
            still be protected.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link to="/screening" className={cx(buttonClasses({ size: 'lg' }), 'group')}>
              Start Screening
              <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
            <Link to="/#how-it-works" className={buttonClasses({ variant: 'secondary', size: 'lg' })}>
              Learn How It Works
            </Link>
          </div>

          <p className="mt-8 flex items-center gap-2 text-sm text-navy-600">
            <ShieldCheck className="h-4 w-4 shrink-0 text-brand-700" aria-hidden="true" />
            Designed to support, not replace, qualified healthcare professionals.
          </p>
        </div>

        <div className="relative animate-fade-in-up [animation-delay:150ms]">
          <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-full shadow-card-hover">
            <RetinaIllustration />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 h-24 animate-scan bg-gradient-to-b from-transparent via-accent-200/40 to-transparent"
            />
          </div>

          <div className="absolute -bottom-4 left-0 rounded-2xl border border-navy-100 bg-white/95 px-4 py-3 shadow-card backdrop-blur sm:-left-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-navy-500">Screening support</p>
            <p className="mt-1 text-sm font-semibold text-navy-900">Not a diagnosis</p>
          </div>
        </div>
      </div>
    </section>
  );
}

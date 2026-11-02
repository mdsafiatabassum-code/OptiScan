import { ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from '@/lib/router';
import { buttonClasses } from '@/components/common/buttonStyles';
import { RetinaIllustration } from '@/components/landing/RetinaIllustration';
import { cx } from '@/lib/classNames';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 pb-24 pt-12 sm:px-8 md:pt-20 lg:grid-cols-2 lg:gap-16 lg:pb-32">
        <div className="animate-fade-in-up">
          <p className="inline-flex items-center gap-2.5 rounded-full border border-primary-300/25 bg-primary-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-primary-100">
            <span className="h-1.5 w-1.5 rounded-full bg-success-400" aria-hidden="true" />
            OPTISCAN · AI-assisted retinal screening
          </p>

          <h1 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-neutral-50 sm:text-5xl lg:text-6xl">
            See Beyond{' '}
            <span className="bg-gradient-to-r from-primary-200 via-primary-300 to-secondary-300 bg-clip-text text-transparent">
              the Image.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-neutral-400 sm:text-lg">
            Diabetic retinopathy can develop quietly, often without noticeable early symptoms. OptiScan uses an AI model
            to review retinal photographs and return a screening estimate, so healthcare workers can identify possible
            warning signs early, when vision can still be protected.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link to="/screening" className={cx(buttonClasses({ size: 'lg' }), 'group')}>
              Start Screening
              <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
            <Link to="/#how-it-works" className={buttonClasses({ variant: 'secondary', size: 'lg' })}>
              How it works
            </Link>
          </div>

          <p className="mt-8 flex items-center gap-2 text-sm text-neutral-400">
            <ShieldCheck className="h-4 w-4 shrink-0 text-primary-300" aria-hidden="true" />
            Designed to support, not replace, qualified healthcare professionals.
          </p>
        </div>

        <div className="relative animate-fade-in-up [animation-delay:150ms]">
          <div className="relative mx-auto aspect-square w-full max-w-md">
            <div aria-hidden="true" className="absolute inset-6 rounded-full bg-primary-400/20 blur-3xl" />
            <div className="relative h-full w-full overflow-hidden rounded-full border border-primary-300/20 shadow-glow">
              <RetinaIllustration />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 h-24 animate-scan bg-gradient-to-b from-transparent via-primary-200/30 to-transparent"
              />
            </div>
          </div>

          <div className="glass-panel absolute -bottom-4 left-0 px-4 py-3 sm:-left-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-400">Screening support</p>
            <p className="mt-1 text-sm font-semibold text-neutral-50">Not a diagnosis</p>
          </div>
        </div>
      </div>
    </section>
  );
}

import { AlertCircle } from 'lucide-react';
import { LABEL_CLASS } from '@/components/screening/ResultCard';
import type { ScreeningReport } from '@/types/screening';

interface GradeHeroCardProps {
  predictedGrade: ScreeningReport['predictedGrade'];
  explanation: string;
}

export function GradeHeroCard({ predictedGrade, explanation }: GradeHeroCardProps) {
  return (
    <article aria-labelledby="predicted-grade-heading" className="surface-card relative overflow-hidden p-6 sm:p-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary-400/15 blur-3xl"
      />
      <div className="relative flex flex-col gap-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-primary-300/25 bg-primary-400/10 px-3 py-1 text-xs font-semibold text-primary-100">
            {predictedGrade.clinicalScale} grade {predictedGrade.index}
          </span>
          <span className="rounded-full border border-warning-400/25 bg-warning-400/10 px-3 py-1 text-xs font-semibold text-warning-200">
            Model-generated estimate
          </span>
        </div>

        <div>
          <p id="predicted-grade-heading" className={LABEL_CLASS}>
            Predicted grade
          </p>
          <p className="mt-2 text-4xl font-bold tracking-tight text-neutral-50 sm:text-5xl">{predictedGrade.label}</p>
          <p className="mt-3 text-base font-semibold text-primary-100">{predictedGrade.description}</p>
        </div>

        <p className="text-sm leading-relaxed text-neutral-300">{explanation}</p>

        <p className="flex items-start gap-2 border-t border-white/10 pt-5 text-xs leading-relaxed text-neutral-400">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-warning-300" aria-hidden="true" />
          This is a model-generated estimate, not a confirmed diagnosis. A qualified eye care professional must review
          it.
        </p>
      </div>
    </article>
  );
}

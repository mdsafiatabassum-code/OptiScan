import { ShieldCheck } from 'lucide-react';
import { MODEL_FACTS, GRADE_SCALE } from '@/config/modelInfo';

export function ModelDetails() {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
      <article className="surface-card p-6 sm:p-8">
        <h3 className="text-lg font-bold text-neutral-50">Model facts</h3>
        <dl className="mt-6 flex flex-col divide-y divide-white/10">
          {MODEL_FACTS.map((fact) => (
            <div key={fact.label} className="grid gap-1 py-4 sm:grid-cols-[9rem_1fr] sm:gap-4">
              <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-400">{fact.label}</dt>
              <dd className="break-words text-sm leading-relaxed text-neutral-100">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </article>

      <article className="surface-card flex flex-col p-6 sm:p-8">
        <h3 className="text-lg font-bold text-neutral-50">Five severity grades</h3>
        <p className="mt-2 text-sm leading-relaxed text-neutral-400">
          The model assigns one of five diabetic retinopathy grades and reports a raw score for each.
        </p>
        <ol className="mt-8 grid flex-1 gap-3">
          {GRADE_SCALE.map((grade) => (
            <li
              key={grade.index}
              className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3"
            >
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-400/10 text-sm font-bold tabular-nums text-primary-200 ring-1 ring-inset ring-primary-300/20"
                aria-hidden="true"
              >
                {grade.index}
              </span>
              <span className="flex-1 font-semibold text-neutral-50">{grade.label}</span>
              <span className="text-xs text-neutral-400">Grade {grade.index}</span>
            </li>
          ))}
        </ol>
        <p className="mt-6 flex items-start gap-2 text-xs leading-relaxed text-neutral-400">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary-300" aria-hidden="true" />
          The model has not been clinically validated. Scores are uncalibrated and are not diagnostic certainty.
        </p>
      </article>
    </div>
  );
}

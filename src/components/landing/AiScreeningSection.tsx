import { CheckCircle2, AlertTriangle, LockKeyhole } from 'lucide-react';
import { SectionHeader } from '@/components/common/SectionHeader';
import { MODEL_LIMITATIONS, SCREENING_BENEFITS } from '@/config/modelInfo';

export function AiScreeningSection() {
  return (
    <section id="limitations" className="scroll-mt-20 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeader
          eyebrow="Privacy and limitations"
          title="AI can widen access, but it has clear boundaries"
          description="OptiScan is designed around these trade-offs so that technology supports clinical judgement rather than replacing it."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <article className="surface-card p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-success-400/10 text-success-300 ring-1 ring-inset ring-success-400/25">
                <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="text-xl font-bold text-neutral-50">Benefits</h3>
            </div>
            <ul className="mt-6 flex flex-col gap-4">
              {SCREENING_BENEFITS.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-neutral-300">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success-300" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </article>

          <article className="surface-card p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-warning-400/10 text-warning-300 ring-1 ring-inset ring-warning-400/25">
                <AlertTriangle className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="text-xl font-bold text-neutral-50">Limitations</h3>
            </div>
            <ul className="mt-6 flex flex-col gap-4">
              {MODEL_LIMITATIONS.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-neutral-300">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning-300" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </div>

        <div className="glass-panel mt-6 flex gap-4 p-6">
          <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-primary-300" aria-hidden="true" />
          <div>
            <p className="font-semibold text-neutral-50">Your image is sent for analysis</p>
            <p className="mt-2 text-sm leading-relaxed text-neutral-400">
              The photograph is sent to the analysis server for this request only. OptiScan does not create a patient
              record.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

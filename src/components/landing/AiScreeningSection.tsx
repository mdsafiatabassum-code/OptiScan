import { CheckCircle2, AlertTriangle } from 'lucide-react';
import { SectionHeader } from '@/components/common/SectionHeader';

const benefits = [
  'Extends screening reach to clinics and communities without nearby specialists.',
  'Provides a consistent first-pass review to support busy healthcare teams.',
  'Can help prioritise which patients should be referred for specialist review sooner.',
  'Supports healthcare workers with clear, structured information to discuss with patients.',
];

const limitations = [
  'A screening aid, not a diagnosis. Clinical decisions remain with qualified professionals.',
  'Results depend on image quality. Blurred, dark or partial photographs may be unreliable.',
  'No AI system detects every case. Negative outputs must not be treated as reassurance.',
  'Any model must be validated on local populations and equipment before routine use.',
];

export function AiScreeningSection() {
  return (
    <section id="ai-screening" className="scroll-mt-20 bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeader
          eyebrow="Benefits and limitations"
          title="AI can widen access, but it has clear boundaries"
          description="OptiScan is designed around these trade-offs so that technology supports clinical judgement rather than replacing it."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <article className="surface-card p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-success-50 text-success-700">
                <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="text-xl font-bold text-navy-900">Benefits</h3>
            </div>
            <ul className="mt-6 flex flex-col gap-4">
              {benefits.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-navy-700">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success-600" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </article>

          <article className="surface-card p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-warning-50 text-warning-700">
                <AlertTriangle className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="text-xl font-bold text-navy-900">Limitations</h3>
            </div>
            <ul className="mt-6 flex flex-col gap-4">
              {limitations.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-navy-700">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning-600" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}

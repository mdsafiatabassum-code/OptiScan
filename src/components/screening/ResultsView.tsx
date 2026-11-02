import { Cpu, Download, Focus, RotateCcw, ShieldAlert, Sparkles, Stethoscope } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { InlineAlert } from '@/components/common/InlineAlert';
import { GradeHeroCard } from '@/components/screening/GradeHeroCard';
import { ProbabilityCard } from '@/components/screening/ProbabilityCard';
import { QualityChecksList } from '@/components/screening/QualityChecksList';
import { LABEL_CLASS, ResultCard } from '@/components/screening/ResultCard';
import { VisualExplanationCard } from '@/components/screening/VisualExplanationCard';
import { formatFileSize } from '@/lib/imageValidation';
import { formatReportTimestamp } from '@/lib/reportFormat';
import { createReportPdf } from '@/lib/reportPdf';
import type { ScreeningReport } from '@/types/screening';

interface ResultsViewProps {
  report: ScreeningReport;
  previewUrl: string;
  onAnalyseAnother: () => void;
}

function downloadReportPdf(report: ScreeningReport) {
  const url = URL.createObjectURL(createReportPdf(report));
  const link = document.createElement('a');
  link.href = url;
  link.download = `optiscan-report-${report.reportId.slice(0, 8)}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

export function ResultsView({ report, previewUrl, onAnalyseAnother }: ResultsViewProps) {
  const { predictedGrade, image, model, quality } = report;

  return (
    <div className="flex animate-fade-in-up flex-col gap-6">
      <section className="surface-card flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <dl className="grid gap-5 sm:grid-cols-2 sm:gap-x-10">
          <div>
            <dt className={LABEL_CLASS}>Screening reference ID</dt>
            <dd className="mt-1.5 break-all font-mono text-sm font-semibold text-neutral-50">{report.reportId}</dd>
          </div>
          <div>
            <dt className={LABEL_CLASS}>Analysis timestamp</dt>
            <dd className="mt-1.5 font-semibold text-neutral-50">{formatReportTimestamp(report.generatedAt)}</dd>
          </div>
        </dl>
        <Button size="lg" onClick={() => downloadReportPdf(report)} className="shrink-0">
          <Download className="h-5 w-5" aria-hidden="true" />
          Download PDF report
        </Button>
      </section>

      <InlineAlert tone="warning" title="Research prototype. Screening estimate, not a diagnosis.">
        {report.disclaimer}
      </InlineAlert>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-6">
          <GradeHeroCard predictedGrade={predictedGrade} explanation={report.explanation} />
          <ProbabilityCard probabilities={report.probabilities} predictedIndex={predictedGrade.index} />
        </div>

        <div className="flex flex-col gap-6">
          <VisualExplanationCard previewUrl={previewUrl} note={report.explainability.note} />

          <ResultCard icon={Focus} title="Image details">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <dt className={LABEL_CLASS}>Format</dt>
                <dd className="mt-1.5 font-semibold text-neutral-50">{image.format}</dd>
              </div>
              <div>
                <dt className={LABEL_CLASS}>File size</dt>
                <dd className="mt-1.5 font-semibold text-neutral-50">{formatFileSize(image.sizeBytes)}</dd>
              </div>
              <div className="col-span-2">
                <dt className={LABEL_CLASS}>Dimensions</dt>
                <dd className="mt-1.5 font-semibold tabular-nums text-neutral-50">
                  {image.width} × {image.height} px
                </dd>
              </div>
            </dl>
          </ResultCard>

          <ResultCard icon={Sparkles} title="Image quality" badge="Passed">
            <div className="flex flex-col gap-5">
              <QualityChecksList checks={quality.checks} />
              <p className="border-t border-white/10 pt-4 text-xs leading-relaxed text-neutral-400">{quality.note}</p>
            </div>
          </ResultCard>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ResultCard icon={ShieldAlert} title="Limitations">
          <ul className="flex list-disc flex-col gap-3 pl-5 marker:text-warning-300">
            {report.limitations.map((limitation) => (
              <li key={limitation} className="pl-1">
                {limitation}
              </li>
            ))}
          </ul>
        </ResultCard>

        <ResultCard icon={Stethoscope} title="Recommended next steps">
          <ol className="flex list-decimal flex-col gap-3 pl-5 marker:font-semibold marker:text-primary-200">
            {report.nextSteps.map((step) => (
              <li key={step} className="pl-1">
                {step}
              </li>
            ))}
          </ol>
        </ResultCard>
      </div>

      <ResultCard icon={Cpu} title="About this analysis">
        <dl className="grid gap-5 sm:grid-cols-2">
          <div>
            <dt className={LABEL_CLASS}>Model</dt>
            <dd className="mt-1.5 break-all font-semibold text-neutral-50">
              {model.name} ({model.version})
            </dd>
          </div>
          <div>
            <dt className={LABEL_CLASS}>Licence</dt>
            <dd className="mt-1.5 font-semibold text-neutral-50">{model.license}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className={LABEL_CLASS}>Intended use</dt>
            <dd className="mt-1.5">{model.intendedUse}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className={LABEL_CLASS}>Source</dt>
            <dd className="mt-1.5 break-all">
              <a
                href={model.source}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring rounded font-semibold text-primary-200 underline-offset-4 hover:text-primary-100 hover:underline"
              >
                {model.source}
              </a>
            </dd>
          </div>
        </dl>
      </ResultCard>

      <div className="flex justify-center pt-2">
        <Button variant="secondary" size="lg" onClick={onAnalyseAnother}>
          <RotateCcw className="h-5 w-5" aria-hidden="true" />
          Analyse another image
        </Button>
      </div>
    </div>
  );
}

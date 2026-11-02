import { ClipboardList, Cpu, Download, Focus, RotateCcw, ShieldAlert, Stethoscope, Sparkles } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { InlineAlert } from '@/components/common/InlineAlert';
import { ProbabilityCard } from '@/components/screening/ProbabilityCard';
import { QualityChecksList } from '@/components/screening/QualityChecksList';
import { ResultCard } from '@/components/screening/ResultCard';
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

const LABEL_CLASS = 'text-xs font-semibold uppercase tracking-wide text-navy-500';

export function ResultsView({ report, previewUrl, onAnalyseAnother }: ResultsViewProps) {
  const { predictedGrade, image, model, quality } = report;

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up">
      <section className="surface-card flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <dl className="grid gap-4 sm:grid-cols-2 sm:gap-x-10">
          <div>
            <dt className={LABEL_CLASS}>Screening reference ID</dt>
            <dd className="mt-1 break-all font-mono text-sm font-semibold text-navy-900">{report.reportId}</dd>
          </div>
          <div>
            <dt className={LABEL_CLASS}>Analysis timestamp</dt>
            <dd className="mt-1 font-semibold text-navy-900">{formatReportTimestamp(report.generatedAt)}</dd>
          </div>
        </dl>
        <Button size="lg" onClick={() => downloadReportPdf(report)}>
          <Download className="h-5 w-5" aria-hidden="true" />
          Download PDF report
        </Button>
      </section>

      <InlineAlert tone="warning" title="Research prototype. Screening estimate, not a diagnosis.">
        {report.disclaimer}
      </InlineAlert>

      <div className="grid gap-6 lg:grid-cols-2">
        <ResultCard icon={ClipboardList} title="Screening result" badge={`${predictedGrade.clinicalScale} grade ${predictedGrade.index}`}>
          <div className="flex flex-col gap-3">
            <p className="text-2xl font-bold tracking-tight text-navy-900">{predictedGrade.label}</p>
            <p className="font-medium text-navy-700">{predictedGrade.description}</p>
            <p>{report.explanation}</p>
          </div>
        </ResultCard>

        <ProbabilityCard probabilities={report.probabilities} predictedIndex={predictedGrade.index} />

        <ResultCard icon={Focus} title="Image details">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <dt className={LABEL_CLASS}>Format</dt>
              <dd className="mt-1 font-semibold text-navy-900">{image.format}</dd>
            </div>
            <div>
              <dt className={LABEL_CLASS}>File size</dt>
              <dd className="mt-1 font-semibold text-navy-900">{formatFileSize(image.sizeBytes)}</dd>
            </div>
            <div className="col-span-2">
              <dt className={LABEL_CLASS}>Dimensions</dt>
              <dd className="mt-1 font-semibold text-navy-900">
                {image.width} × {image.height} px
              </dd>
            </div>
          </dl>
        </ResultCard>

        <ResultCard icon={Sparkles} title="Image quality" badge="Passed">
          <div className="flex flex-col gap-5">
            <QualityChecksList checks={quality.checks} />
            <p className="text-sm leading-relaxed text-navy-600">{quality.note}</p>
          </div>
        </ResultCard>

        <VisualExplanationCard previewUrl={previewUrl} note={report.explainability.note} />

        <ResultCard icon={ShieldAlert} title="Limitations">
          <ul className="flex list-disc flex-col gap-3 pl-5 marker:text-navy-400">
            {report.limitations.map((limitation) => (
              <li key={limitation} className="pl-1">
                {limitation}
              </li>
            ))}
          </ul>
        </ResultCard>

        <ResultCard icon={Stethoscope} title="Recommended next steps">
          <ol className="flex list-decimal flex-col gap-3 pl-5 marker:font-semibold marker:text-brand-700">
            {report.nextSteps.map((step) => (
              <li key={step} className="pl-1">
                {step}
              </li>
            ))}
          </ol>
        </ResultCard>

        <ResultCard icon={Cpu} title="About this analysis" className="lg:col-span-2">
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className={LABEL_CLASS}>Model</dt>
              <dd className="mt-1 break-all font-semibold text-navy-900">
                {model.name} ({model.version})
              </dd>
            </div>
            <div>
              <dt className={LABEL_CLASS}>Licence</dt>
              <dd className="mt-1 font-semibold text-navy-900">{model.license}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className={LABEL_CLASS}>Intended use</dt>
              <dd className="mt-1">{model.intendedUse}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className={LABEL_CLASS}>Source</dt>
              <dd className="mt-1 break-all">
                <a
                  href={model.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-brand-700 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                >
                  {model.source}
                </a>
              </dd>
            </div>
          </dl>
        </ResultCard>
      </div>

      <div className="flex justify-center pt-2">
        <Button variant="secondary" size="lg" onClick={onAnalyseAnother}>
          <RotateCcw className="h-5 w-5" aria-hidden="true" />
          Analyse another image
        </Button>
      </div>
    </div>
  );
}

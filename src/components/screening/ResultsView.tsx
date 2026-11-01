import { ClipboardList, Cpu, Focus, RotateCcw, ShieldAlert, Stethoscope } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { InlineAlert } from '@/components/common/InlineAlert';
import { ProbabilityCard } from '@/components/screening/ProbabilityCard';
import { ResultCard } from '@/components/screening/ResultCard';
import { VisualExplanationCard } from '@/components/screening/VisualExplanationCard';
import { formatFileSize } from '@/lib/imageValidation';
import { formatReportTimestamp } from '@/lib/reportFormat';
import type { ScreeningReport } from '@/types/screening';

interface ResultsViewProps {
  report: ScreeningReport;
  previewUrl: string;
  onAnalyseAnother: () => void;
}

export function ResultsView({ report, previewUrl, onAnalyseAnother }: ResultsViewProps) {
  const { predictedGrade, image, model } = report;

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up">
      <InlineAlert tone="warning" title="Screening estimate, not a diagnosis">
        {report.disclaimer}
      </InlineAlert>

      <div className="grid gap-6 lg:grid-cols-2">
        <ResultCard icon={ClipboardList} title="Screening result" badge={`${predictedGrade.clinicalScale} grade ${predictedGrade.index}`}>
          <div className="flex flex-col gap-3">
            <p className="text-2xl font-bold tracking-tight text-navy-900">{predictedGrade.label}</p>
            <p className="font-medium text-navy-700">{predictedGrade.description}</p>
            <p>{report.explanation}</p>
            <p className="text-xs text-navy-500">Report generated {formatReportTimestamp(report.generatedAt)}</p>
          </div>
        </ResultCard>

        <ProbabilityCard probabilities={report.probabilities} predictedIndex={predictedGrade.index} />

        <ResultCard icon={Focus} title="Image details" badge="Accepted">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-navy-500">Format</dt>
              <dd className="mt-1 font-semibold text-navy-900">{image.format}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-navy-500">File size</dt>
              <dd className="mt-1 font-semibold text-navy-900">{formatFileSize(image.sizeBytes)}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-xs font-semibold uppercase tracking-wide text-navy-500">Dimensions</dt>
              <dd className="mt-1 font-semibold text-navy-900">
                {image.width} × {image.height} px
              </dd>
            </div>
          </dl>
          <p className="mt-4">
            The model does not report image quality. Check that the photograph is sharp, evenly lit and shows the full
            retina.
          </p>
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
              <dt className="text-xs font-semibold uppercase tracking-wide text-navy-500">Model</dt>
              <dd className="mt-1 break-all font-semibold text-navy-900">
                {model.name} ({model.version})
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-navy-500">Licence</dt>
              <dd className="mt-1 font-semibold text-navy-900">{model.license}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs font-semibold uppercase tracking-wide text-navy-500">Intended use</dt>
              <dd className="mt-1">{model.intendedUse}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs font-semibold uppercase tracking-wide text-navy-500">Source</dt>
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

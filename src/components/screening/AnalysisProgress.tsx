import { Loader2 } from 'lucide-react';

interface AnalysisProgressProps {
  phase: 'uploading' | 'analysing';
  progress: number;
}

export function AnalysisProgress({ phase, progress }: AnalysisProgressProps) {
  if (phase === 'uploading') {
    const percent = Math.round(progress * 100);
    return (
      <div className="flex flex-col gap-2" role="status" aria-live="polite">
        <div className="flex items-center justify-between text-sm font-semibold text-navy-800">
          <span>Uploading image</span>
          <span className="tabular-nums">{percent}%</span>
        </div>
        <div
          role="progressbar"
          aria-label="Upload progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
          className="h-2 overflow-hidden rounded-full bg-navy-100"
        >
          <div
            className="h-full rounded-full bg-brand-600 transition-[width] duration-300 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-start gap-3 rounded-xl border border-brand-100 bg-brand-50/70 p-4"
    >
      <Loader2 className="mt-0.5 h-5 w-5 shrink-0 animate-spin text-brand-700" aria-hidden="true" />
      <div>
        <p className="font-semibold text-navy-900">Analysing image</p>
        <p className="mt-1 text-sm leading-relaxed text-navy-600">
          The model is reviewing the photograph. This can take a moment.
        </p>
      </div>
    </div>
  );
}

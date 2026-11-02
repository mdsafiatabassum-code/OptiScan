import type { ReactNode } from 'react';
import { CheckCircle2, Circle, Loader2, type LucideIcon } from 'lucide-react';
import { cx } from '@/lib/classNames';

interface AnalysisProgressProps {
  phase: 'uploading' | 'analysing';
  progress: number;
}

type StageState = 'done' | 'active' | 'pending';

const stageIcons: Record<StageState, { icon: LucideIcon; className: string }> = {
  done: { icon: CheckCircle2, className: 'text-success-300' },
  active: { icon: Loader2, className: 'animate-spin text-primary-200' },
  pending: { icon: Circle, className: 'text-neutral-500' },
};

function StageRow({
  state,
  title,
  detail,
  children,
}: {
  state: StageState;
  title: string;
  detail: string;
  children?: ReactNode;
}) {
  const { icon: Icon, className } = stageIcons[state];
  return (
    <li className="flex gap-4">
      <Icon className={cx('mt-0.5 h-5 w-5 shrink-0', className)} aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p
          className={cx(
            'font-semibold',
            state === 'pending' ? 'text-neutral-400' : 'text-neutral-50',
          )}
        >
          {title}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-neutral-400">{detail}</p>
        {children}
      </div>
    </li>
  );
}

export function AnalysisProgress({ phase, progress }: AnalysisProgressProps) {
  const percent = Math.round(progress * 100);
  const isAnalysing = phase === 'analysing';

  return (
    <div role="status" aria-live="polite" className="glass-panel p-5 sm:p-6">
      <ol className="flex flex-col gap-5">
        <StageRow
          state={isAnalysing ? 'done' : 'active'}
          title="Uploading image"
          detail={isAnalysing ? 'Upload complete.' : `${percent}% sent to the analysis server.`}
        >
          {!isAnalysing && (
            <div
              role="progressbar"
              aria-label="Upload progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={percent}
              className="mt-3 h-2 overflow-hidden rounded-full bg-white/5"
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary-300 to-primary-500 shadow-glow transition-[width] duration-300 ease-out"
                style={{ width: `${percent}%` }}
              />
            </div>
          )}
        </StageRow>
        <StageRow
          state={isAnalysing ? 'active' : 'pending'}
          title="Model analysis"
          detail={
            isAnalysing
              ? 'The model is reviewing the photograph. This can take a moment.'
              : 'Starts when the upload finishes.'
          }
        />
      </ol>
    </div>
  );
}

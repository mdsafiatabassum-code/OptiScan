import { ImageIcon, Loader2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { ResultCard } from '@/components/screening/ResultCard';
import { OverallQualityBadge, QualityBadge } from '@/components/screening/QualityBadge';
import type { ClientQualityResult, QualityMetric } from '@/lib/imageQualityCheck';
import type { QualityCheckState } from '@/hooks/useClientQualityCheck';

interface ClientQualityCardProps {
  state: QualityCheckState;
}

function MetricRow({ icon: Icon, label, metric }: { icon: LucideIcon; label: string; metric: QualityMetric }) {
  const valueDisplay = metric.unit ? `${metric.value} ${metric.unit}` : `${metric.value}`;
  return (
    <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-400/10 text-primary-200 ring-1 ring-inset ring-primary-300/20">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-semibold text-neutral-50">{label}</span>
          <QualityBadge level={metric.level} />
        </div>
        <p className="text-xs tabular-nums text-neutral-400">{valueDisplay}</p>
        <p className="text-xs leading-relaxed text-neutral-400">{metric.tip}</p>
      </div>
    </div>
  );
}

export function ClientQualityCard({ state }: ClientQualityCardProps) {
  if (state.status === 'idle') return null;

  if (state.status === 'loading') {
    return (
      <ResultCard icon={ImageIcon} title="Image quality">
        <div className="flex items-center gap-3 text-sm text-neutral-400">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          Checking image quality…
        </div>
      </ResultCard>
    );
  }

  if (state.status === 'error') {
    return (
      <ResultCard icon={ImageIcon} title="Image quality">
        <p className="text-sm leading-relaxed text-neutral-400">{state.message}</p>
      </ResultCard>
    );
  }

  const result: ClientQualityResult = state.result;
  const rows: Array<{ icon: LucideIcon; label: string; metric: QualityMetric }> = [
    { icon: ImageIcon, label: 'Resolution', metric: result.resolution },
    { icon: ImageIcon, label: 'Lighting', metric: result.lighting },
    { icon: ImageIcon, label: 'Sharpness', metric: result.sharpness },
  ];

  return (
    <ResultCard icon={ImageIcon} title="Image quality">
      <div className="flex items-center justify-between gap-3 pb-2">
        <span className="text-sm font-semibold text-neutral-300">Overall</span>
        <OverallQualityBadge overall={result.overall} />
      </div>
      <div className="flex flex-col gap-3">
        {rows.map(({ icon, label, metric }) => (
          <MetricRow key={label} icon={icon} label={label} metric={metric} />
        ))}
      </div>
      <p className="border-t border-white/10 pt-4 text-xs leading-relaxed text-neutral-400">
        These checks run on your device before upload. They are a guide, not a guarantee of accurate results.
      </p>
    </ResultCard>
  );
}

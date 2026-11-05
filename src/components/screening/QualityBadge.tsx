import { cx } from '@/lib/classNames';
import type { QualityLevel, OverallQuality } from '@/lib/imageQualityCheck';

const levelStyles: Record<QualityLevel, string> = {
  good: 'border-success-400/30 bg-success-400/10 text-success-300',
  fair: 'border-warning-400/30 bg-warning-400/10 text-warning-300',
  poor: 'border-danger-400/30 bg-danger-500/10 text-danger-300',
};

const levelLabels: Record<QualityLevel, string> = {
  good: 'Good',
  fair: 'Fair',
  poor: 'Poor',
};

export function QualityBadge({ level }: { level: QualityLevel }) {
  return (
    <span className={cx('shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-semibold', levelStyles[level])}>
      {levelLabels[level]}
    </span>
  );
}

const overallStyles: Record<OverallQuality, string> = {
  good: 'border-success-400/25 bg-success-400/10 text-success-200',
  acceptable: 'border-warning-400/25 bg-warning-400/10 text-warning-200',
  poor: 'border-danger-400/25 bg-danger-500/10 text-danger-200',
};

const overallLabels: Record<OverallQuality, string> = {
  good: 'Good',
  acceptable: 'Acceptable',
  poor: 'Poor',
};

export function OverallQualityBadge({ overall }: { overall: OverallQuality }) {
  return (
    <span className={cx('shrink-0 rounded-full border px-3 py-1 text-xs font-semibold', overallStyles[overall])}>
      {overallLabels[overall]}
    </span>
  );
}

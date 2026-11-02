import { useEffect, useState } from 'react';
import { BarChart3 } from 'lucide-react';
import { ResultCard } from '@/components/screening/ResultCard';
import { cx } from '@/lib/classNames';
import { formatPercent } from '@/lib/reportFormat';
import type { ClassProbability } from '@/types/screening';

interface ProbabilityCardProps {
  probabilities: ClassProbability[];
  predictedIndex: number;
}

export function ProbabilityCard({ probabilities, predictedIndex }: ProbabilityCardProps) {
  return (
    <ResultCard icon={BarChart3} title="Class probabilities" badge="Raw model scores">
      <ul className="flex flex-col gap-5">
        {probabilities.map((item) => (
          <ProbabilityRow key={item.index} item={item} isPredicted={item.index === predictedIndex} />
        ))}
      </ul>
      <p className="border-t border-white/10 pt-4 text-xs leading-relaxed text-neutral-400">
        These scores are the model's raw outputs for this photograph. They have not been calibrated and are not a
        measure of how certain a diagnosis is.
      </p>
    </ResultCard>
  );
}

function ProbabilityRow({ item, isPredicted }: { item: ClassProbability; isPredicted: boolean }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const percent = formatPercent(item.probability);
  const width = isMounted ? `${(item.probability * 100).toFixed(1)}%` : '0%';

  return (
    <li className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className={cx('flex items-center gap-2', isPredicted ? 'font-semibold text-neutral-50' : 'text-neutral-300')}>
          {item.label}
          {isPredicted && (
            <span className="rounded-full bg-primary-400/15 px-2 py-0.5 text-[11px] font-semibold text-primary-100">
              Predicted
            </span>
          )}
        </span>
        <span className="tabular-nums font-semibold text-neutral-100">{percent}</span>
      </div>
      <div
        role="img"
        aria-label={`${item.label}: ${percent}`}
        className="h-2.5 overflow-hidden rounded-full bg-white/5"
      >
        <div
          className={cx(
            'h-full rounded-full transition-[width] duration-1000 ease-out',
            isPredicted
              ? 'bg-gradient-to-r from-primary-300 to-primary-500 shadow-glow'
              : 'bg-gradient-to-r from-neutral-500 to-neutral-400',
          )}
          style={{ width }}
        />
      </div>
    </li>
  );
}

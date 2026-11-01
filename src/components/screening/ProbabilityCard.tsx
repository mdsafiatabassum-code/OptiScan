import { BarChart3 } from 'lucide-react';
import { ResultCard } from '@/components/screening/ResultCard';
import { formatPercent } from '@/lib/reportFormat';
import type { ClassProbability } from '@/types/screening';

interface ProbabilityCardProps {
  probabilities: ClassProbability[];
  predictedIndex: number;
}

export function ProbabilityCard({ probabilities, predictedIndex }: ProbabilityCardProps) {
  return (
    <ResultCard icon={BarChart3} title="Class probabilities" badge="Model output">
      <ul className="flex flex-col gap-4">
        {probabilities.map((item) => {
          const isPredicted = item.index === predictedIndex;
          const width = `${(item.probability * 100).toFixed(1)}%`;
          return (
            <li key={item.index} className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className={isPredicted ? 'font-semibold text-navy-900' : 'text-navy-700'}>{item.label}</span>
                <span className="tabular-nums font-semibold text-navy-800">{formatPercent(item.probability)}</span>
              </div>
              <div
                role="img"
                aria-label={`${item.label}: ${formatPercent(item.probability)}`}
                className="h-2 overflow-hidden rounded-full bg-navy-100"
              >
                <div
                  className={
                    isPredicted
                      ? 'h-full rounded-full bg-brand-600 transition-[width] duration-700 ease-out'
                      : 'h-full rounded-full bg-navy-300 transition-[width] duration-700 ease-out'
                  }
                  style={{ width }}
                />
              </div>
            </li>
          );
        })}
      </ul>
      <p className="text-xs leading-relaxed text-navy-500">
        These scores are the model's raw outputs for this photograph. They have not been calibrated and are not a
        measure of how certain a diagnosis is.
      </p>
    </ResultCard>
  );
}

import { CheckCircle2, XCircle } from 'lucide-react';
import type { QualityCheck } from '@/types/screening';

interface QualityChecksListProps {
  checks: QualityCheck[];
}

export function QualityChecksList({ checks }: QualityChecksListProps) {
  return (
    <ul className="flex flex-col gap-4">
      {checks.map((check) => {
        const passed = check.status === 'passed';
        const Icon = passed ? CheckCircle2 : XCircle;
        return (
          <li key={check.code} className="flex items-start gap-3">
            <Icon
              className={`mt-0.5 h-5 w-5 shrink-0 ${passed ? 'text-success-300' : 'text-danger-300'}`}
              aria-hidden="true"
            />
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold text-neutral-50">
                {check.label}:{' '}
                <span className={passed ? 'text-success-300' : 'text-danger-300'}>
                  {passed ? 'Passed' : 'Needs attention'}
                </span>
              </p>
              <p className="text-sm leading-relaxed text-neutral-300">{check.message}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

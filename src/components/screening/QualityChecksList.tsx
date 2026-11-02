import { CheckCircle2, XCircle } from 'lucide-react';
import type { QualityCheck } from '@/types/screening';

interface QualityChecksListProps {
  checks: QualityCheck[];
}

export function QualityChecksList({ checks }: QualityChecksListProps) {
  return (
    <ul className="flex flex-col gap-3">
      {checks.map((check) => {
        const passed = check.status === 'passed';
        const Icon = passed ? CheckCircle2 : XCircle;
        return (
          <li key={check.code} className="flex items-start gap-3">
            <Icon
              className={`mt-0.5 h-5 w-5 shrink-0 ${passed ? 'text-success-700' : 'text-error-700'}`}
              aria-hidden="true"
            />
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold text-navy-900">
                {check.label}: <span className={passed ? 'text-success-700' : 'text-error-700'}>{passed ? 'Passed' : 'Needs attention'}</span>
              </p>
              <p className="text-sm leading-relaxed text-navy-700">{check.message}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

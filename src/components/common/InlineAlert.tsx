import type { ReactNode } from 'react';
import { AlertTriangle, CheckCircle2, Info, type LucideIcon } from 'lucide-react';
import { cx } from '@/lib/classNames';

type AlertTone = 'info' | 'warning' | 'error' | 'success';

const toneStyles: Record<AlertTone, { container: string; icon: LucideIcon }> = {
  info: { container: 'border-secondary-200 bg-secondary-50 text-secondary-900', icon: Info },
  warning: { container: 'border-warning-200 bg-warning-50 text-warning-900', icon: AlertTriangle },
  error: { container: 'border-error-200 bg-error-50 text-error-900', icon: AlertTriangle },
  success: { container: 'border-success-200 bg-success-50 text-success-900', icon: CheckCircle2 },
};

interface InlineAlertProps {
  tone?: AlertTone;
  title?: string;
  children: ReactNode;
}

export function InlineAlert({ tone = 'info', title, children }: InlineAlertProps) {
  const { container, icon: Icon } = toneStyles[tone];
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={cx('flex gap-3 rounded-xl border p-4 text-sm leading-relaxed', container)}
    >
      <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
      <div className="min-w-0">
        {title && <p className="font-semibold">{title}</p>}
        <div>{children}</div>
      </div>
    </div>
  );
}

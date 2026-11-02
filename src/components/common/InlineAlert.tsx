import type { ReactNode } from 'react';
import { AlertTriangle, CheckCircle2, Info, type LucideIcon } from 'lucide-react';
import { cx } from '@/lib/classNames';

type AlertTone = 'info' | 'warning' | 'error' | 'success';

const toneStyles: Record<AlertTone, { container: string; iconClass: string; icon: LucideIcon }> = {
  info: {
    container: 'border-primary-300/20 bg-primary-400/10',
    iconClass: 'text-primary-200',
    icon: Info,
  },
  warning: {
    container: 'border-warning-400/25 bg-warning-400/10',
    iconClass: 'text-warning-300',
    icon: AlertTriangle,
  },
  error: {
    container: 'border-danger-400/30 bg-danger-500/10',
    iconClass: 'text-danger-300',
    icon: AlertTriangle,
  },
  success: {
    container: 'border-success-400/25 bg-success-400/10',
    iconClass: 'text-success-300',
    icon: CheckCircle2,
  },
};

interface InlineAlertProps {
  tone?: AlertTone;
  title?: string;
  children: ReactNode;
}

export function InlineAlert({ tone = 'info', title, children }: InlineAlertProps) {
  const { container, iconClass, icon: Icon } = toneStyles[tone];
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={cx('flex gap-3 rounded-xl border p-4 text-sm leading-relaxed text-neutral-200', container)}
    >
      <Icon className={cx('mt-0.5 h-5 w-5 shrink-0', iconClass)} aria-hidden="true" />
      <div className="min-w-0">
        {title && <p className="font-semibold text-neutral-50">{title}</p>}
        <div>{children}</div>
      </div>
    </div>
  );
}

import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cx } from '@/lib/classNames';

interface ResultCardProps {
  icon: LucideIcon;
  title: string;
  badge?: string;
  className?: string;
  children: ReactNode;
}

export function ResultCard({ icon: Icon, title, badge, className, children }: ResultCardProps) {
  return (
    <article className={cx('surface-card flex flex-col gap-4 p-6 sm:p-7', className)}>
      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <h3 className="text-base font-bold text-navy-900">{title}</h3>
        </div>
        {badge && (
          <span className="shrink-0 rounded-full border border-navy-200 bg-navy-50 px-3 py-1 text-xs font-semibold text-navy-700">
            {badge}
          </span>
        )}
      </header>
      <div className="text-sm leading-relaxed text-navy-600">{children}</div>
    </article>
  );
}

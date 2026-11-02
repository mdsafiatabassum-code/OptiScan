import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cx } from '@/lib/classNames';

export const LABEL_CLASS = 'text-xs font-semibold uppercase tracking-[0.14em] text-neutral-400';

interface ResultCardProps {
  icon: LucideIcon;
  title: string;
  badge?: string;
  className?: string;
  children: ReactNode;
}

export function ResultCard({ icon: Icon, title, badge, className, children }: ResultCardProps) {
  return (
    <article className={cx('surface-card flex flex-col gap-5 p-6 sm:p-7', className)}>
      <header className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-400/10 text-primary-200 ring-1 ring-inset ring-primary-300/20">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <h3 className="text-base font-bold text-neutral-50">{title}</h3>
        </div>
        {badge && (
          <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-neutral-300">
            {badge}
          </span>
        )}
      </header>
      <div className="text-sm leading-relaxed text-neutral-300">{children}</div>
    </article>
  );
}

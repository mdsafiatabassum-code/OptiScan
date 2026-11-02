import { Eye } from 'lucide-react';
import { cx } from '@/lib/classNames';

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <span className={cx('inline-flex items-center gap-3', className)}>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-primary-300/30 bg-gradient-to-br from-primary-400/25 to-secondary-500/25 text-primary-200 shadow-glow">
        <Eye className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-sm font-bold tracking-[0.22em] text-neutral-50">OPTISCAN</span>
        <span className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
          See beyond the image
        </span>
      </span>
    </span>
  );
}

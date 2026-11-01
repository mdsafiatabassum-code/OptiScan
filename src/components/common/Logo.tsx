import { Eye } from 'lucide-react';
import { cx } from '@/lib/classNames';

interface LogoProps {
  className?: string;
  tone?: 'default' | 'light';
}

export function Logo({ className, tone = 'default' }: LogoProps) {
  return (
    <span className={cx('inline-flex items-center gap-2.5', className)}>
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 text-white shadow-md shadow-brand-600/30">
        <Eye className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className={cx('text-lg font-bold tracking-tight', tone === 'light' ? 'text-white' : 'text-navy-900')}>
        OptiScan
      </span>
    </span>
  );
}

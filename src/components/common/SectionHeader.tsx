import { cx } from '@/lib/classNames';

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
}

export function SectionHeader({ eyebrow, title, description, align = 'center' }: SectionHeaderProps) {
  return (
    <div className={cx('max-w-2xl', align === 'center' && 'mx-auto text-center')}>
      <p className="text-sm font-semibold uppercase tracking-wider text-brand-700">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">{title}</h2>
      {description && <p className="mt-4 text-base text-navy-600 sm:text-lg">{description}</p>}
    </div>
  );
}

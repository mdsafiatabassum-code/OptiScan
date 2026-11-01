import { cx } from '@/lib/classNames';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonStyleOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-700 text-white shadow-md shadow-brand-700/20 hover:-translate-y-0.5 hover:bg-brand-800 hover:shadow-lg',
  secondary:
    'border border-navy-200 bg-white text-navy-800 shadow-sm hover:-translate-y-0.5 hover:border-brand-300 hover:text-brand-800',
  ghost: 'text-navy-700 hover:bg-navy-50 hover:text-navy-900',
  danger: 'border border-error-200 bg-white text-error-700 hover:bg-error-50',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-base',
};

export function buttonClasses({ variant = 'primary', size = 'md', fullWidth = false }: ButtonStyleOptions = {}) {
  return cx(
    'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0',
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && 'w-full',
  );
}

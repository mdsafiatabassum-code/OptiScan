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
    'bg-gradient-to-br from-primary-300 to-primary-500 text-canvas shadow-lg shadow-primary-500/20 hover:-translate-y-0.5 hover:shadow-primary-400/40 hover:brightness-110',
  secondary:
    'border border-white/15 bg-white/5 text-neutral-100 backdrop-blur hover:-translate-y-0.5 hover:border-primary-300/50 hover:bg-white/10 hover:text-white',
  ghost: 'text-neutral-300 hover:bg-white/5 hover:text-neutral-50',
  danger: 'border border-danger-400/30 bg-danger-500/10 text-danger-200 hover:bg-danger-500/20',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-base',
};

export function buttonClasses({ variant = 'primary', size = 'md', fullWidth = false }: ButtonStyleOptions = {}) {
  return cx(
    'focus-ring inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 ease-out disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:brightness-100',
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && 'w-full',
  );
}

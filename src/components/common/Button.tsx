import type { ButtonHTMLAttributes } from 'react';
import { buttonClasses, type ButtonStyleOptions } from '@/components/common/buttonStyles';
import { cx } from '@/lib/classNames';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, ButtonStyleOptions {}

export function Button({ variant, size, fullWidth, className, type = 'button', ...rest }: ButtonProps) {
  return <button type={type} className={cx(buttonClasses({ variant, size, fullWidth }), className)} {...rest} />;
}

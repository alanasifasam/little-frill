// variantes btn-primary | btn-secondary | btn-ghost, prop block para btn-block
import type { ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  block?: boolean;
}

export function Button({ variant, block = false, className, type = 'button', ...rest }: ButtonProps) {
  const classes = ['btn', variant ? `btn-${variant}` : '', block ? 'btn-block' : '', className]
    .filter(Boolean)
    .join(' ');

  return <button type={type} className={classes} {...rest} />;
}

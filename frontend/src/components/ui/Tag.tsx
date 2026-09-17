// variantes tag-accent | tag-neutral | tag-outline
import type { CSSProperties, ReactNode } from 'react';

export interface TagProps {
  variant?: 'accent' | 'accent-2' | 'neutral' | 'outline';
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
}

export function Tag({ variant = 'neutral', children, style, className }: TagProps) {
  const classes = ['tag', `tag-${variant}`, className].filter(Boolean).join(' ');
  return (
    <span className={classes} style={style}>
      {children}
    </span>
  );
}

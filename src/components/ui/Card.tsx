import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  interactive?: boolean;
}

export function Card({
  children,
  interactive = false,
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-stone-200/80 bg-white p-5 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/90 dark:shadow-none',
        interactive &&
          'transition-colors duration-150 hover:border-amber-500/50 dark:hover:border-amber-500/50',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

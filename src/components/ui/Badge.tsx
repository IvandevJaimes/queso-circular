import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

type BadgeVariant = 'neutral' | 'amber' | 'sky' | 'rose';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  neutral:
    'border-stone-200 bg-stone-100 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-800/80 dark:text-zinc-300',
  amber:
    'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/15 dark:text-amber-400',
  sky: 'border-sky-500/30 bg-sky-500/10 text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/15 dark:text-sky-400',
  rose: 'border-rose-500/30 bg-rose-500/10 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/15 dark:text-rose-400',
};

export function Badge({
  children,
  variant = 'neutral',
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium leading-5',
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

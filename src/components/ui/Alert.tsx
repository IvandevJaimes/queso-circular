import type { ReactNode } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  XCircle,
} from 'lucide-react';
import { cn } from '../../utils/cn';

type AlertVariant = 'info' | 'success' | 'warning' | 'error';

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}

const variantStyles: Record<
  AlertVariant,
  { container: string; iconColor: string; Icon: typeof Info }
> = {
  info: {
    container:
      'border-stone-200 bg-stone-100/80 text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900/90 dark:text-zinc-200',
    iconColor: 'text-zinc-600 dark:text-zinc-400',
    Icon: Info,
  },
  success: {
    container:
      'border-sky-500/30 bg-sky-500/10 text-sky-950 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-200',
    iconColor: 'text-sky-600 dark:text-sky-400',
    Icon: CheckCircle2,
  },
  warning: {
    container:
      'border-amber-500/30 bg-amber-500/10 text-amber-950 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200',
    iconColor: 'text-amber-600 dark:text-amber-400',
    Icon: AlertTriangle,
  },
  error: {
    container:
      'border-rose-500/30 bg-rose-500/10 text-rose-950 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200',
    iconColor: 'text-rose-600 dark:text-rose-400',
    Icon: XCircle,
  },
};

export function Alert({
  variant = 'info',
  title,
  children,
  action,
  className,
}: AlertProps) {
  const { container, iconColor, Icon } = variantStyles[variant];

  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      className={cn(
        'flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-start sm:justify-between',
        container,
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <Icon
          className={cn('mt-0.5 h-4 w-4 shrink-0', iconColor)}
          aria-hidden="true"
        />
        <div className="flex flex-col gap-1 text-sm leading-relaxed">
          {title && <p className="font-semibold">{title}</p>}
          <div className="opacity-90">{children}</div>
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

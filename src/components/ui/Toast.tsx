import { CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { cn } from '../../utils/cn';

export function Toast() {
  const toast = useAppStore((state) => state.toast);
  const dismissToast = useAppStore((state) => state.dismissToast);

  if (!toast) return null;

  const styles = {
    success:
      'border-amber-500/40 bg-white text-zinc-900 dark:border-amber-500/40 dark:bg-zinc-900 dark:text-zinc-100',
    error:
      'border-rose-500/40 bg-white text-zinc-900 dark:border-rose-500/40 dark:bg-zinc-900 dark:text-zinc-100',
    info: 'border-stone-200 bg-white text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100',
  }[toast.tipo];

  const Icon = {
    success: CheckCircle2,
    error: XCircle,
    info: Info,
  }[toast.tipo];

  const iconColor = {
    success: 'text-amber-600 dark:text-amber-400',
    error: 'text-rose-600 dark:text-rose-400',
    info: 'text-sky-600 dark:text-sky-400',
  }[toast.tipo];

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed bottom-20 right-4 z-50 flex max-w-sm justify-end md:bottom-6 md:right-6"
    >
      <div
        className={cn(
          'pointer-events-auto flex w-full items-start gap-3 rounded-xl border p-4 shadow-lg',
          styles,
        )}
      >
        <Icon
          className={cn('mt-0.5 h-4 w-4 shrink-0', iconColor)}
          aria-hidden="true"
        />
        <div className="flex-1 text-sm">
          <p className="font-semibold">{toast.titulo}</p>
          {toast.descripcion && (
            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
              {toast.descripcion}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={dismissToast}
          aria-label="Cerrar notificación"
          className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-stone-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 cursor-pointer"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

import { forwardRef, useId, type InputHTMLAttributes } from 'react';
import { AlertCircle } from 'lucide-react';
import { scrollFieldIntoView } from '../../hooks/useViewportKeyboard';
import { cn } from '../../utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  unitSuffix?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, unitSuffix, className, id, onFocus, ...props },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-zinc-800 dark:text-zinc-200"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <input
          ref={ref}
          id={inputId}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            'h-11 w-full rounded-xl border bg-white px-3.5 text-base text-zinc-900 placeholder:text-zinc-400 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500',
            error
              ? 'border-rose-500 focus-visible:ring-rose-500 dark:border-rose-500'
              : 'border-stone-300 hover:border-stone-400 dark:border-zinc-800 dark:hover:border-zinc-700',
            unitSuffix && 'pr-12',
            className,
          )}
          onFocus={(e) => {
            scrollFieldIntoView(e.currentTarget);
            onFocus?.(e);
          }}
          {...props}
        />
        {unitSuffix && (
          <span className="pointer-events-none absolute right-3.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            {unitSuffix}
          </span>
        )}
      </div>
      {error && (
        <p
          id={errorId}
          role="alert"
          className="flex items-center gap-1.5 text-xs font-medium text-rose-600 dark:text-rose-400"
        >
          <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
});

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../utils/cn';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      title={isDark ? 'Modo claro' : 'Modo oscuro'}
      className={cn(
        'inline-flex h-9 items-center gap-2 rounded-lg border border-stone-200 bg-white px-2.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer',
        className,
      )}
    >
      {isDark ? (
        <>
          <Sun className="h-4 w-4 text-amber-400" aria-hidden="true" />
          <span className="hidden sm:inline">Claro</span>
        </>
      ) : (
        <>
          <Moon className="h-4 w-4 text-zinc-600" aria-hidden="true" />
          <span className="hidden sm:inline">Oscuro</span>
        </>
      )}
    </button>
  );
}

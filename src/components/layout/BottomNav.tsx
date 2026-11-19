import { NavLink } from 'react-router-dom';
import { useViewportKeyboard } from '../../hooks/useViewportKeyboard';
import { cn } from '../../utils/cn';
import { NAV_ITEMS } from './Navbar';

export function BottomNav() {
  const { isKeyboardOpen } = useViewportKeyboard();

  if (isKeyboardOpen) {
    return null;
  }

  return (
    <nav
      aria-label="Navegación móvil"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-stone-200/80 bg-white/95 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/95 md:hidden"
    >
      <div className="grid grid-cols-4 gap-1 px-2 py-1.5">
        {NAV_ITEMS.map(({ to, label, Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center gap-1 rounded-lg py-1.5 text-[11px] font-medium transition-colors',
                isActive
                  ? 'bg-amber-500/12 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400'
                  : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100',
              )
            }
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

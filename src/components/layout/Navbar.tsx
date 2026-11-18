import { NavLink } from 'react-router-dom';
import { BookOpen, Calculator, Clock, Recycle } from 'lucide-react';
import { cn } from '../../utils/cn';
import { BrandLogo } from '../ui/BrandLogo';
import { ThemeToggle } from '../ui/ThemeToggle';

export const NAV_ITEMS = [
  { to: '/', label: 'Calculadora', Icon: Calculator, end: true },
  { to: '/alternativas', label: 'Alternativas', Icon: Recycle, end: false },
  { to: '/historial', label: 'Historial', Icon: Clock, end: false },
  { to: '/recetas', label: 'Recetas', Icon: BookOpen, end: false },
] as const;

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-stone-200/80 bg-white/90 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/90">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <NavLink
          to="/"
          className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
        >
          <BrandLogo />
        </NavLink>

        <nav
          aria-label="Navegación principal"
          className="hidden items-center gap-1 md:flex"
        >
          {NAV_ITEMS.map(({ to, label, Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500',
                  isActive
                    ? 'bg-amber-500/12 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400'
                    : 'text-zinc-600 hover:bg-stone-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100',
                )
              }
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

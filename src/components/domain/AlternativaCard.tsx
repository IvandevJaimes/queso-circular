import {
  ArrowRight,
  ChefHat,
  Handshake,
  HeartPulse,
  Sprout,
} from 'lucide-react';
import type { Alternativa, AlternativaIcono } from '../../types/produccion.types';
import { cn } from '../../utils/cn';
import { Badge } from '../ui/Badge';

interface AlternativaCardProps {
  alternativa: Alternativa;
  esRecomendada?: boolean;
  onSelect: (alternativa: Alternativa) => void;
}

export function getAlternativaIcon(icono: AlternativaIcono) {
  switch (icono) {
    case 'chef-hat':
      return ChefHat;
    case 'sprout':
      return Sprout;
    case 'heart-pulse':
      return HeartPulse;
    case 'handshake':
      return Handshake;
  }
}

export function AlternativaCard({
  alternativa,
  esRecomendada = false,
  onSelect,
}: AlternativaCardProps) {
  const Icon = getAlternativaIcon(alternativa.icono);

  return (
    <button
      type="button"
      onClick={() => onSelect(alternativa)}
      className={cn(
        'group flex w-full flex-col justify-between gap-4 rounded-xl border bg-white p-5 text-left shadow-sm transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 dark:bg-zinc-900/90 dark:shadow-none',
        esRecomendada
          ? 'border-amber-500/60 hover:border-amber-500 dark:border-amber-500/50 dark:hover:border-amber-400'
          : 'border-stone-200/80 hover:border-amber-500/50 dark:border-zinc-800/80 dark:hover:border-amber-500/50',
      )}
    >
      <div className="flex w-full flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/12 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="flex items-center gap-1.5">
            {esRecomendada && <Badge variant="amber">Sugerida</Badge>}
            <Badge variant="sky">{alternativa.escalaIdeal}</Badge>
          </div>
        </div>

        <div>
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            {alternativa.titulo}
          </h2>
          <p className="mt-1 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
            {alternativa.resumen}
          </p>
        </div>
      </div>

      <div className="flex w-full items-center justify-end border-t border-stone-200/80 pt-3 dark:border-zinc-800/80">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 transition-transform duration-150 group-hover:translate-x-0.5 dark:text-amber-400">
          <span>Ver ficha técnica</span>
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
      </div>
    </button>
  );
}

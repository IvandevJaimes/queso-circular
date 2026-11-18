import {
  ArrowRight,
  ChefHat,
  Cookie,
  Droplets,
  Factory,
  Flame,
  FlaskConical,
  GlassWater,
  Handshake,
  HeartPulse,
  Layers,
  Leaf,
  Loader2,
  Recycle,
  Sparkles,
  Sprout,
  Wheat,
} from 'lucide-react';
import type { Alternativa, AlternativaIcono } from '../../types/produccion.types';
import { cn } from '../../utils/cn';
import { Badge } from '../ui/Badge';

interface AlternativaCardProps {
  alternativa: Alternativa;
  esRecomendada?: boolean;
  isGeneratingIA?: boolean;
  onSelect: (alternativa: Alternativa) => void;
  onConsultIA: (alternativa: Alternativa) => void;
}

export function getAlternativaIcon(icono: AlternativaIcono) {
  switch (icono) {
    case 'chef-hat':
      return ChefHat;
    case 'glass-water':
      return GlassWater;
    case 'flame':
      return Flame;
    case 'wheat':
      return Wheat;
    case 'cookie':
      return Cookie;
    case 'flask':
      return FlaskConical;
    case 'sprout':
      return Sprout;
    case 'recycle':
      return Recycle;
    case 'leaf':
      return Leaf;
    case 'heart-pulse':
      return HeartPulse;
    case 'layers':
      return Layers;
    case 'handshake':
      return Handshake;
    case 'droplets':
      return Droplets;
    case 'factory':
      return Factory;
  }
}

export function AlternativaCard({
  alternativa,
  esRecomendada = false,
  isGeneratingIA = false,
  onSelect,
  onConsultIA,
}: AlternativaCardProps) {
  const Icon = getAlternativaIcon(alternativa.icono);

  return (
    <div
      className={cn(
        'flex w-full flex-col justify-between gap-4 rounded-xl border bg-white p-5 shadow-sm transition-colors duration-150 dark:bg-zinc-900/90 dark:shadow-none',
        esRecomendada
          ? 'border-amber-500/60 hover:border-amber-500 dark:border-amber-500/50 dark:hover:border-amber-400'
          : 'border-stone-200/80 hover:border-amber-500/40 dark:border-zinc-800/80 dark:hover:border-amber-500/40',
      )}
    >
      <button
        type="button"
        onClick={() => onSelect(alternativa)}
        className="flex w-full flex-col gap-3 rounded-lg text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 cursor-pointer"
      >
        <div className="flex w-full items-start justify-between gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/12 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="flex flex-wrap items-center justify-end gap-1.5">
            {esRecomendada && <Badge variant="amber">Sugerida</Badge>}
            <Badge variant="neutral">{alternativa.categoria}</Badge>
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
      </button>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-stone-200/80 pt-3 dark:border-zinc-800/80">
        <button
          type="button"
          disabled={isGeneratingIA}
          onClick={() => onConsultIA(alternativa)}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1.5 text-xs font-semibold text-amber-700 transition-colors hover:bg-amber-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 dark:text-amber-400',
            isGeneratingIA ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
          )}
        >
          {isGeneratingIA ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
          ) : (
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          <span>
            {isGeneratingIA ? 'Analizando...' : 'Consultar viabilidad con IA'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onSelect(alternativa)}
          className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-600 transition-colors hover:text-amber-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 dark:text-zinc-400 dark:hover:text-amber-400 cursor-pointer"
        >
          <span>Ver ficha técnica</span>
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

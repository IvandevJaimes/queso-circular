import { useState } from 'react';
import { ArrowRight, UtensilsCrossed } from 'lucide-react';
import type { Receta } from '../../types/receta.types';
import { Badge } from '../ui/Badge';

interface RecetaCardProps {
  receta: Receta;
  onSelect: (receta: Receta) => void;
}

export function RecetaCard({ receta, onSelect }: RecetaCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <button
      type="button"
      onClick={() => onSelect(receta)}
      className="group flex w-full flex-col overflow-hidden rounded-xl border border-stone-200/80 bg-white text-left shadow-sm transition-colors duration-150 hover:border-amber-500/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 dark:border-zinc-800/80 dark:bg-zinc-900/90 dark:shadow-none dark:hover:border-amber-500/50 cursor-pointer"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-stone-100 dark:bg-zinc-800">
        {receta.imagen && !imgError ? (
          <img
            src={receta.imagen}
            alt={receta.nombre}
            loading="lazy"
            onError={() => setImgError(true)}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-zinc-400 dark:text-zinc-500">
            <UtensilsCrossed className="h-8 w-8" aria-hidden="true" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between gap-3 p-4">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant="amber">{receta.categoria}</Badge>
            <Badge variant="neutral">{receta.origen}</Badge>
          </div>

          <h2 className="line-clamp-2 text-base font-semibold text-zinc-900 dark:text-zinc-100">
            {receta.nombre}
          </h2>
        </div>

        <div className="flex items-center justify-between border-t border-stone-200/80 pt-3 dark:border-zinc-800/80">
          <span className="text-xs font-medium tabular-nums text-zinc-500 dark:text-zinc-400">
            {receta.ingredientes.length} ingredientes
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 transition-transform duration-150 group-hover:translate-x-0.5 dark:text-amber-400">
            <span>Ver preparación</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
        </div>
      </div>
    </button>
  );
}

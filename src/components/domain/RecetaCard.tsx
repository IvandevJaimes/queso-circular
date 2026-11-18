import { useState } from 'react';
import { ArrowRight, Clock, Utensils } from 'lucide-react';
import type { RecetaLocal } from '../../types/receta.types';
import { Badge } from '../ui/Badge';

interface RecetaCardProps {
  receta: RecetaLocal;
  onSelect: (receta: RecetaLocal) => void;
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
        {receta.imagenUrl && !imgError ? (
          <img
            src={receta.imagenUrl}
            alt={receta.titulo}
            loading="lazy"
            onError={() => setImgError(true)}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-zinc-400 dark:text-zinc-500">
            <Utensils className="h-8 w-8" aria-hidden="true" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between gap-3 p-4">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant="amber">{receta.categoria}</Badge>
            <Badge variant="neutral">{receta.dificultad}</Badge>
          </div>

          <h2 className="line-clamp-2 text-base font-semibold text-zinc-900 dark:text-zinc-100">
            {receta.titulo}
          </h2>
        </div>

        <div className="flex items-center justify-between border-t border-stone-200/80 pt-3 dark:border-zinc-800/80">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{receta.tiempoPreparacion}</span>
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

import { Loader2, Trash2 } from 'lucide-react';
import type { Produccion } from '../../types/produccion.types';
import {
  formatFecha,
  formatKilogramos,
  formatLitros,
} from '../../utils/formatters';

interface ProduccionRowProps {
  produccion: Produccion;
  isDeleting: boolean;
  onRequestDelete: (produccion: Produccion) => void;
}

export function ProduccionRow({
  produccion,
  isDeleting,
  onRequestDelete,
}: ProduccionRowProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-zinc-200/80 bg-white p-3.5 transition-colors dark:border-zinc-800/80 dark:bg-zinc-900/90 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center justify-between gap-3 sm:justify-start">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="shrink-0 whitespace-nowrap rounded-md bg-zinc-100 px-2 py-0.5 font-mono text-xs font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
            #{produccion.id}
          </span>

          <div className="flex min-w-0 flex-col sm:flex-row sm:items-center sm:gap-2.5">
            <span className="whitespace-nowrap text-sm font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
              {formatLitros(produccion.litrosLeche)} de leche
            </span>
            <span className="whitespace-nowrap text-xs tabular-nums text-zinc-500 dark:text-zinc-400">
              {formatFecha(produccion.fecha)}
            </span>
          </div>
        </div>

        <button
          type="button"
          disabled={isDeleting}
          onClick={() => onRequestDelete(produccion)}
          aria-label={`Eliminar partida #${produccion.id}`}
          title="Eliminar partida"
          className="shrink-0 rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-red-500/10 hover:text-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 disabled:opacity-50 sm:hidden cursor-pointer"
        >
          {isDeleting ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      </div>

      <div className="flex items-center gap-2 sm:justify-end">
        <div className="grid flex-1 grid-cols-2 items-center gap-2 sm:flex sm:flex-initial">
          <div className="flex items-center justify-between gap-1.5 whitespace-nowrap rounded-lg border border-amber-500/25 bg-amber-500/10 px-2.5 py-1.5 text-xs tabular-nums text-amber-600 dark:text-amber-400 sm:justify-start">
            <span className="font-semibold">
              {formatKilogramos(produccion.quesoEstimado)}
            </span>
            <span className="opacity-75">queso</span>
          </div>

          <div className="flex items-center justify-between gap-1.5 whitespace-nowrap rounded-lg border border-sky-500/25 bg-sky-500/10 px-2.5 py-1.5 text-xs tabular-nums text-sky-600 dark:text-sky-400 sm:justify-start">
            <span className="font-semibold">
              {formatLitros(produccion.sueroEstimado)}
            </span>
            <span className="opacity-75">suero</span>
          </div>
        </div>

        <button
          type="button"
          disabled={isDeleting}
          onClick={() => onRequestDelete(produccion)}
          aria-label={`Eliminar partida #${produccion.id}`}
          title="Eliminar partida"
          className="hidden shrink-0 rounded-lg p-2 text-zinc-400 transition-colors hover:bg-red-500/10 hover:text-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 disabled:opacity-50 sm:inline-flex cursor-pointer"
        >
          {isDeleting ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  );
}

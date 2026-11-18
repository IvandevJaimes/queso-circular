import { useState } from 'react';
import {
  BookOpen,
  ChefHat,
  Clock,
  Sparkles,
  Utensils,
} from 'lucide-react';
import type { RecetaLocal } from '../../types/receta.types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

interface RecetaModalProps {
  receta: RecetaLocal | null;
  onClose: () => void;
}

export function RecetaModal({ receta, onClose }: RecetaModalProps) {
  const [imgError, setImgError] = useState(false);

  if (!receta) return null;

  return (
    <Modal
      isOpen={Boolean(receta)}
      onClose={onClose}
      title={receta.titulo}
      subtitle={`${receta.categoria} • ${receta.porciones}`}
      size="xl"
      footer={
        <Button variant="secondary" size="sm" onClick={onClose}>
          Cerrar receta
        </Button>
      }
    >
      <div className="flex flex-col gap-5">
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-stone-100 dark:bg-zinc-800">
          {receta.imagenUrl && !imgError ? (
            <img
              src={receta.imagenUrl}
              alt={receta.titulo}
              onError={() => setImgError(true)}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-zinc-400 dark:text-zinc-500">
              <Utensils className="h-10 w-10" aria-hidden="true" />
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="amber">{receta.categoria}</Badge>
          <Badge variant="sky">
            <Clock className="h-3 w-3" aria-hidden="true" />
            <span>{receta.tiempoPreparacion}</span>
          </Badge>
          <Badge variant="neutral">
            <ChefHat className="h-3 w-3" aria-hidden="true" />
            <span>Dificultad {receta.dificultad}</span>
          </Badge>
          <Badge variant="neutral">
            <Utensils className="h-3 w-3" aria-hidden="true" />
            <span>{receta.porciones}</span>
          </Badge>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
          <section className="flex flex-col gap-2.5 md:col-span-5">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              <BookOpen
                className="h-4 w-4 text-amber-600 dark:text-amber-400"
                aria-hidden="true"
              />
              <span>Ingredientes</span>
            </h3>
            <ul className="divide-y divide-stone-200/80 rounded-xl border border-stone-200/80 bg-stone-50/70 dark:divide-zinc-800 dark:border-zinc-800/80 dark:bg-zinc-950/60">
              {receta.ingredientes.map((ingrediente, idx) => (
                <li
                  key={idx}
                  className="px-3.5 py-2 text-xs font-medium text-zinc-800 dark:text-zinc-200 sm:text-sm"
                >
                  {ingrediente}
                </li>
              ))}
            </ul>
          </section>

          <section className="flex flex-col gap-2.5 md:col-span-7">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Preparación paso a paso
            </h3>
            <ol className="flex flex-col gap-2.5">
              {receta.instrucciones.map((paso, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-amber-500/15 text-xs font-bold tabular-nums text-amber-600 dark:text-amber-400">
                    {idx + 1}
                  </span>
                  <span>{paso}</span>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <div className="flex items-start gap-3 rounded-xl border border-sky-500/25 bg-sky-500/10 p-3.5">
          <Sparkles
            className="mt-0.5 h-4 w-4 shrink-0 text-sky-600 dark:text-sky-400"
            aria-hidden="true"
          />
          <div className="text-xs leading-relaxed text-zinc-700 dark:text-zinc-300 sm:text-sm">
            <span className="font-semibold text-sky-700 dark:text-sky-300">
              Consejo de Economía Circular:{' '}
            </span>
            <span>{receta.consejoCircular}</span>
          </div>
        </div>
      </div>
    </Modal>
  );
}

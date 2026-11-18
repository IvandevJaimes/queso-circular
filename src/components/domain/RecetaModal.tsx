import { useState } from 'react';
import { ExternalLink, ListChecks, UtensilsCrossed } from 'lucide-react';
import type { Receta } from '../../types/receta.types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

interface RecetaModalProps {
  receta: Receta | null;
  onClose: () => void;
}

export function RecetaModal({ receta, onClose }: RecetaModalProps) {
  const [imgError, setImgError] = useState(false);

  if (!receta) return null;

  const pasos = receta.instrucciones
    .split(/\r?\n/)
    .map((linea) => linea.trim())
    .filter(Boolean);

  return (
    <Modal
      isOpen={Boolean(receta)}
      onClose={onClose}
      title={receta.nombre}
      subtitle={`${receta.categoria} • Cocina ${receta.origen}`}
      size="xl"
      footer={
        <div className="flex w-full items-center justify-between gap-3">
          {receta.videoUrl ? (
            <a
              href={receta.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 hover:underline dark:text-amber-400"
            >
              <span>Ver video de referencia</span>
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          ) : (
            <span />
          )}
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cerrar receta
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-5">
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-stone-100 dark:bg-zinc-800">
          {receta.imagen && !imgError ? (
            <img
              src={receta.imagen}
              alt={receta.nombre}
              onError={() => setImgError(true)}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-zinc-400 dark:text-zinc-500">
              <UtensilsCrossed className="h-10 w-10" aria-hidden="true" />
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="amber">{receta.categoria}</Badge>
          <Badge variant="neutral">{receta.origen}</Badge>
          <Badge variant="sky">{receta.ingredientes.length} ingredientes</Badge>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
          <section className="flex flex-col gap-2.5 md:col-span-5">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              <ListChecks
                className="h-4 w-4 text-amber-600 dark:text-amber-400"
                aria-hidden="true"
              />
              <span>Ingredientes</span>
            </h3>
            <ul className="divide-y divide-stone-200/80 rounded-xl border border-stone-200/80 bg-stone-50/70 dark:divide-zinc-800 dark:border-zinc-800/80 dark:bg-zinc-950/60">
              {receta.ingredientes.map((ing, idx) => (
                <li
                  key={`${ing.nombre}-${idx}`}
                  className="flex items-center justify-between gap-2 px-3 py-2 text-xs sm:text-sm"
                >
                  <span className="font-medium text-zinc-800 dark:text-zinc-200">
                    {ing.nombre}
                  </span>
                  <span className="shrink-0 tabular-nums text-zinc-500 dark:text-zinc-400">
                    {ing.medida}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="flex flex-col gap-2.5 md:col-span-7">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Instrucciones de preparación
            </h3>
            <div className="flex flex-col gap-2.5 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
              {pasos.map((paso, idx) => (
                <p key={idx}>{paso}</p>
              ))}
            </div>
          </section>
        </div>
      </div>
    </Modal>
  );
}

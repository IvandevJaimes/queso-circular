import { CheckCircle2, ShieldAlert, Wrench } from 'lucide-react';
import type { Alternativa } from '../../types/produccion.types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { getAlternativaIcon } from './AlternativaCard';

interface AlternativaModalProps {
  alternativa: Alternativa | null;
  onClose: () => void;
}

export function AlternativaModal({
  alternativa,
  onClose,
}: AlternativaModalProps) {
  if (!alternativa) return null;

  const Icon = getAlternativaIcon(alternativa.icono);

  return (
    <Modal
      isOpen={Boolean(alternativa)}
      onClose={onClose}
      title={alternativa.titulo}
      subtitle={`Escala recomendada: ${alternativa.escalaIdeal}`}
      footer={
        <Button variant="secondary" size="sm" onClick={onClose}>
          Cerrar ficha
        </Button>
      }
    >
      <div className="flex flex-col gap-5">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/12 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
            {alternativa.descripcion}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <section className="flex flex-col gap-2.5 rounded-xl border border-stone-200/80 bg-stone-50/70 p-3.5 dark:border-zinc-800/80 dark:bg-zinc-950/60">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-900 dark:text-zinc-100">
              Condiciones operativas
            </h3>
            <ul className="flex flex-col gap-2">
              {alternativa.condicionesUso.map((condicion, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300"
                >
                  <CheckCircle2
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sky-600 dark:text-sky-400"
                    aria-hidden="true"
                  />
                  <span>{condicion}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="flex flex-col gap-2.5 rounded-xl border border-stone-200/80 bg-stone-50/70 p-3.5 dark:border-zinc-800/80 dark:bg-zinc-950/60">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-900 dark:text-zinc-100">
              Precauciones sanitarias
            </h3>
            <ul className="flex flex-col gap-2">
              {alternativa.precaucionesLista.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300"
                >
                  <ShieldAlert
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="flex flex-col gap-2">
          <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            <Wrench className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Equipamiento básico</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {alternativa.equipamientoBasico.map((equipo, idx) => (
              <Badge key={idx} variant="neutral" className="rounded-lg py-1">
                {equipo}
              </Badge>
            ))}
          </div>
        </section>
      </div>
    </Modal>
  );
}

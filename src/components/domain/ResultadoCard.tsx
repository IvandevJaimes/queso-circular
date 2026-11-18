import { Droplets, Info, Scale } from 'lucide-react';
import { PORCENTAJE_QUESO, PORCENTAJE_SUERO } from '../../config/constants';
import type { EstimacionResultado } from '../../types/produccion.types';
import { cn } from '../../utils/cn';
import { formatKilogramos, formatLitros } from '../../utils/formatters';
import { Card } from '../ui/Card';

interface ResultadoCardProps {
  estimacion: EstimacionResultado | null;
}

export function ResultadoCard({ estimacion }: ResultadoCardProps) {
  const hasValue = Boolean(estimacion && estimacion.litrosLeche > 0);
  const queso = hasValue && estimacion ? estimacion.quesoEstimado : 0;
  const suero = hasValue && estimacion ? estimacion.sueroEstimado : 0;

  return (
    <Card className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div
          className={cn(
            'flex items-start justify-between rounded-xl border border-stone-200/80 bg-stone-50/70 p-4 transition-opacity dark:border-zinc-800/80 dark:bg-zinc-950/60',
            !hasValue && 'opacity-50',
          )}
        >
          <div>
            <p className="text-xs font-medium text-amber-700 dark:text-amber-400">
              Queso estimado ({PORCENTAJE_QUESO}%)
            </p>
            <p className="mt-1.5 text-2xl font-bold tracking-tight tabular-nums text-zinc-950 dark:text-zinc-50 sm:text-3xl">
              {formatKilogramos(queso)}
            </p>
          </div>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400">
            <Scale className="h-4 w-4" aria-hidden="true" />
          </span>
        </div>

        <div
          className={cn(
            'flex items-start justify-between rounded-xl border border-stone-200/80 bg-stone-50/70 p-4 transition-opacity dark:border-zinc-800/80 dark:bg-zinc-950/60',
            !hasValue && 'opacity-50',
          )}
        >
          <div>
            <p className="text-xs font-medium text-sky-600 dark:text-sky-400">
              Lactosuero residual ({PORCENTAJE_SUERO}%)
            </p>
            <p className="mt-1.5 text-2xl font-bold tracking-tight tabular-nums text-zinc-950 dark:text-zinc-50 sm:text-3xl">
              {formatLitros(suero)}
            </p>
          </div>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-500/15 text-sky-600 dark:text-sky-400">
            <Droplets className="h-4 w-4" aria-hidden="true" />
          </span>
        </div>
      </div>

      <div className={cn('flex flex-col gap-2', !hasValue && 'opacity-50')}>
        <div
          className="grid h-3 w-full grid-cols-[12fr_88fr] gap-1 overflow-hidden rounded-full bg-stone-100 p-0.5 dark:bg-zinc-800"
          role="img"
          aria-label={`Proporción: ${PORCENTAJE_QUESO}% queso y ${PORCENTAJE_SUERO}% lactosuero`}
        >
          <div className="h-full rounded-full bg-amber-600 dark:bg-amber-500" />
          <div className="h-full rounded-full bg-sky-600 dark:bg-sky-400" />
        </div>
        <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
          <span className="inline-flex items-center gap-1.5">
            <span
              className="h-2 w-2 rounded-full bg-amber-600 dark:bg-amber-500"
              aria-hidden="true"
            />
            <span>Queso ({PORCENTAJE_QUESO}%)</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span
              className="h-2 w-2 rounded-full bg-sky-600 dark:bg-sky-400"
              aria-hidden="true"
            />
            <span>Lactosuero ({PORCENTAJE_SUERO}%)</span>
          </span>
        </div>
      </div>

      <p className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
        <Info className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span>
          Estimación referencial (12% queso / 88% suero). No reemplaza validación técnica ni sanitaria.
        </span>
      </p>
    </Card>
  );
}

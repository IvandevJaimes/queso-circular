import { BookmarkCheck, Info, Save, Sparkles } from 'lucide-react';
import { MAX_LITROS_OPERATIVO, PRESETS_LITROS, UMBRAL_VOLUMEN_MUY_BAJO_SUERO } from '../../config/constants';
import { scrollFieldIntoView } from '../../hooks/useViewportKeyboard';
import { parseLitrosInput } from '../../schemas/produccion.schema';
import type { EstimacionResultado } from '../../types/produccion.types';
import { cn } from '../../utils/cn';
import { formatKilogramos, formatLitros } from '../../utils/formatters';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface CalculadoraFormProps {
  litrosInput: string;
  estimacion: EstimacionResultado | null;
  isSaving: boolean;
  isChatLoading: boolean;
  onChangeLitros: (raw: string) => void;
  onSelectPreset: (litros: number) => void;
  onConsultarIA: (litros: number) => void;
  onSave: (litros: number) => Promise<void>;
}

export function CalculadoraForm({
  litrosInput,
  estimacion,
  isSaving,
  isChatLoading,
  onChangeLitros,
  onSelectPreset,
  onConsultarIA,
  onSave,
}: CalculadoraFormProps) {
  const parsedLitros = parseLitrosInput(litrosInput);
  const hasAttempt = litrosInput.trim().length > 0;
  const isValidValue =
    parsedLitros !== null &&
    parsedLitros > 0 &&
    parsedLitros <= MAX_LITROS_OPERATIVO;

  let errorMsg: string | null = null;
  if (hasAttempt && parsedLitros === null) {
    errorMsg = 'Ingresa un número válido (usa punto o coma).';
  } else if (hasAttempt && parsedLitros !== null && parsedLitros <= 0) {
    errorMsg = 'Debe ser mayor a 0 litros.';
  } else if (
    hasAttempt &&
    parsedLitros !== null &&
    parsedLitros > MAX_LITROS_OPERATIVO
  ) {
    errorMsg = `Máximo ${MAX_LITROS_OPERATIVO.toLocaleString('es-AR')} L por partida.`;
  }

  const guardada = Boolean(estimacion?.guardadaEnHistorial);
  const queso = isValidValue && estimacion ? estimacion.quesoEstimado : 0;
  const suero = isValidValue && estimacion ? estimacion.sueroEstimado : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidValue || parsedLitros === null || guardada) return;
    await onSave(parsedLitros);
  };

  return (
    <Card className="flex flex-col gap-3.5 p-4">
      <form onSubmit={(e) => void handleSubmit(e)} className="flex flex-col gap-2.5" noValidate>
        <div className="flex items-center justify-between gap-2">
          <label
            htmlFor="litros-leche-input"
            className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400"
          >
            Litros de leche a elaborar
          </label>
          <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
            Estimación orientativa 12% / 88%
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              id="litros-leche-input"
              type="text"
              inputMode="decimal"
              placeholder="Ej: 100"
              value={litrosInput}
              onChange={(e) => onChangeLitros(e.target.value)}
              onFocus={(e) => scrollFieldIntoView(e.currentTarget)}
              aria-invalid={Boolean(errorMsg)}
              className={cn(
                'h-11 w-full rounded-xl border bg-white px-3.5 pr-10 text-lg font-semibold tabular-nums text-zinc-900 placeholder:text-zinc-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500',
                errorMsg
                  ? 'border-rose-500 focus-visible:ring-rose-500'
                  : 'border-stone-300 hover:border-stone-400 dark:border-zinc-800 dark:hover:border-zinc-700',
              )}
            />
            <span className="pointer-events-none absolute right-3.5 top-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              L
            </span>
          </div>

          <Button
            type="submit"
            size="lg"
            isLoading={isSaving}
            disabled={!isValidValue || guardada}
            leftIcon={
              guardada ? (
                <BookmarkCheck className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Save className="h-4 w-4" aria-hidden="true" />
              )
            }
            className="shrink-0 px-3.5 sm:px-4"
          >
            <span className="hidden sm:inline">
              {guardada ? 'Guardada' : 'Guardar partida'}
            </span>
            <span className="sm:hidden">{guardada ? 'Listo' : 'Guardar'}</span>
          </Button>
        </div>

        {errorMsg && (
          <p role="alert" className="text-xs font-medium text-rose-600 dark:text-rose-400">
            {errorMsg}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
          <div className="flex flex-wrap items-center gap-1.5">
            {PRESETS_LITROS.map((preset) => {
              const isSelected = parsedLitros === preset;
              return (
                <button
                  key={preset}
                  type="button"
                  onClick={() => onSelectPreset(preset)}
                  className={cn(
                    'rounded-lg border px-2.5 py-1 text-xs font-medium tabular-nums transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500',
                    isSelected
                      ? 'border-amber-600 bg-amber-600 text-white dark:border-amber-500 dark:bg-amber-500 dark:text-zinc-950'
                      : 'border-stone-200 bg-stone-50 text-zinc-700 hover:border-stone-300 hover:bg-stone-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:bg-zinc-800',
                  )}
                >
                  {preset} L
                </button>
              );
            })}
          </div>

          {isValidValue && parsedLitros !== null && (
            <button
              type="button"
              disabled={isChatLoading}
              onClick={() => onConsultarIA(parsedLitros)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-700 transition-colors hover:bg-amber-500/20 disabled:opacity-50 dark:text-amber-400 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            >
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Consultar a la IA</span>
            </button>
          )}
        </div>
      </form>

      <div className="grid grid-cols-2 gap-2.5">
        <div
          className={cn(
            'rounded-xl border border-amber-500/25 bg-amber-500/5 px-3.5 py-2.5 transition-opacity dark:bg-amber-500/10',
            !isValidValue && 'opacity-50',
          )}
        >
          <p className="text-xs font-medium text-amber-700 dark:text-amber-400">
            Queso estimado (12%)
          </p>
          <p className="mt-0.5 text-xl font-bold tabular-nums text-zinc-900 dark:text-zinc-50 sm:text-2xl">
            {formatKilogramos(queso)}
          </p>
        </div>

        <div
          className={cn(
            'rounded-xl border border-sky-500/25 bg-sky-500/5 px-3.5 py-2.5 transition-opacity dark:bg-sky-500/10',
            !isValidValue && 'opacity-50',
          )}
        >
          <p className="text-xs font-medium text-sky-600 dark:text-sky-400">
            Suero generado (88%)
          </p>
          <p className="mt-0.5 text-xl font-bold tabular-nums text-zinc-900 dark:text-zinc-50 sm:text-2xl">
            {formatLitros(suero)}
          </p>
        </div>
      </div>

      {isValidValue && suero > 0 && suero < UMBRAL_VOLUMEN_MUY_BAJO_SUERO && (
        <div className="flex items-start gap-2 rounded-xl border border-sky-500/25 bg-sky-500/5 px-3 py-2 text-xs text-zinc-700 dark:bg-sky-500/10 dark:text-zinc-300">
          <Info
            className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sky-600 dark:text-sky-400"
            aria-hidden="true"
          />
          <span>
            Partida chica (valores orientativos): volumen reducido para acopio o
            escala mayor; prioriza uso fresco en cocina, ración animal o riego
            muy diluido.
          </span>
        </div>
      )}
    </Card>
  );
}

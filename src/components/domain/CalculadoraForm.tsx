import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { BookmarkCheck, RotateCcw, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { MAX_LITROS_OPERATIVO, PRESETS_LITROS } from '../../config/constants';
import {
  parseLitrosInput,
  produccionFormSchema,
  type ProduccionFormValues,
} from '../../schemas/produccion.schema';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';

interface CalculadoraFormProps {
  initialLitros?: number | null;
  isSaving: boolean;
  guardadaEnHistorial: boolean;
  onPreview: (litros: number | null) => void;
  onSubmitAndSave: (litros: number) => Promise<void>;
  onReset: () => void;
}

export function CalculadoraForm({
  initialLitros,
  isSaving,
  guardadaEnHistorial,
  onPreview,
  onSubmitAndSave,
  onReset,
}: CalculadoraFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProduccionFormValues>({
    resolver: zodResolver(produccionFormSchema),
    mode: 'onChange',
    defaultValues: {
      litrosLeche: initialLitros ? String(initialLitros) : '',
    },
  });

  const watchedLitros = watch('litrosLeche');
  const parsedLitros = parseLitrosInput(watchedLitros ?? '');
  const isValidValue =
    parsedLitros !== null &&
    parsedLitros > 0 &&
    parsedLitros <= MAX_LITROS_OPERATIVO;

  useEffect(() => {
    const parsed = parseLitrosInput(watchedLitros ?? '');
    if (parsed !== null && parsed > 0 && parsed <= MAX_LITROS_OPERATIVO) {
      onPreview(parsed);
    } else {
      onPreview(null);
    }
  }, [watchedLitros, onPreview]);

  const handlePresetClick = (cantidad: number) => {
    setValue('litrosLeche', String(cantidad), {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleFormSubmit = handleSubmit(async (data) => {
    const parsed = parseLitrosInput(data.litrosLeche);
    if (parsed === null || parsed <= 0) return;
    await onSubmitAndSave(parsed);
  });

  const handleClear = () => {
    reset({ litrosLeche: '' });
    onReset();
  };

  return (
    <Card>
      <form onSubmit={handleFormSubmit} className="flex flex-col gap-4" noValidate>
        <Input
          label="Leche procesada (Litros)"
          placeholder="Ejemplo: 50"
          inputMode="decimal"
          unitSuffix="L"
          className="h-12 text-lg font-semibold tabular-nums"
          error={errors.litrosLeche?.message}
          {...register('litrosLeche')}
        />

        <div className="grid grid-cols-4 gap-2">
          {PRESETS_LITROS.map((preset) => {
            const isSelected = parsedLitros === preset;
            return (
              <button
                key={preset}
                type="button"
                onClick={() => handlePresetClick(preset)}
                className={cn(
                  'rounded-lg border py-2 text-xs font-medium tabular-nums transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500',
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

        <div className="flex items-center gap-2 pt-1">
          <Button
            type="submit"
            size="lg"
            isLoading={isSaving}
            disabled={!isValidValue || guardadaEnHistorial}
            leftIcon={
              guardadaEnHistorial ? (
                <BookmarkCheck className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Save className="h-4 w-4" aria-hidden="true" />
              )
            }
            className="flex-1"
          >
            {guardadaEnHistorial ? 'Partida guardada' : 'Guardar partida'}
          </Button>
          {watchedLitros && (
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={handleClear}
              aria-label="Limpiar entrada"
              className="px-3.5"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
}

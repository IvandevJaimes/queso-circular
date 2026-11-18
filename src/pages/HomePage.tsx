import { useCallback } from 'react';
import { CalculadoraForm } from '../components/domain/CalculadoraForm';
import { RecomendacionBanner } from '../components/domain/RecomendacionBanner';
import { ResultadoCard } from '../components/domain/ResultadoCard';
import { PageHeader } from '../components/layout/PageHeader';
import { useAppStore } from '../store/useAppStore';
import { calcularProduccion } from '../utils/calculos';

export function HomePage() {
  const ultimaEstimacion = useAppStore((state) => state.ultimaEstimacion);
  const isSaving = useAppStore((state) => state.isSavingProduccion);
  const setUltimaEstimacion = useAppStore((state) => state.setUltimaEstimacion);
  const guardarProduccion = useAppStore((state) => state.guardarProduccion);

  const handlePreview = useCallback(
    (litros: number | null) => {
      if (litros === null) {
        setUltimaEstimacion(null);
        return;
      }
      const actual = useAppStore.getState().ultimaEstimacion;
      if (actual && actual.litrosLeche === litros && actual.guardadaEnHistorial) {
        return;
      }
      setUltimaEstimacion(calcularProduccion(litros, false));
    },
    [setUltimaEstimacion],
  );

  const handleSave = useCallback(
    async (litros: number) => {
      await guardarProduccion(litros);
    },
    [guardarProduccion],
  );

  const handleReset = useCallback(() => {
    setUltimaEstimacion(null);
  }, [setUltimaEstimacion]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Calculadora de rendimiento"
        description="Estima queso y lactosuero por partida"
      />

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <CalculadoraForm
            initialLitros={ultimaEstimacion?.litrosLeche ?? null}
            isSaving={isSaving}
            guardadaEnHistorial={ultimaEstimacion?.guardadaEnHistorial ?? false}
            onPreview={handlePreview}
            onSubmitAndSave={handleSave}
            onReset={handleReset}
          />
        </div>

        <div className="flex flex-col gap-4 lg:col-span-7">
          <ResultadoCard estimacion={ultimaEstimacion} />

          {ultimaEstimacion && ultimaEstimacion.litrosLeche > 0 && (
            <RecomendacionBanner
              sueroEstimado={ultimaEstimacion.sueroEstimado}
            />
          )}
        </div>
      </div>
    </div>
  );
}

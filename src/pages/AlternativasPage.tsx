import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AlternativaCard } from '../components/domain/AlternativaCard';
import { AlternativaModal } from '../components/domain/AlternativaModal';
import { PageHeader } from '../components/layout/PageHeader';
import { ALTERNATIVAS } from '../config/constants';
import { useAppStore } from '../store/useAppStore';
import type { Alternativa } from '../types/produccion.types';
import { generarRecomendacion } from '../utils/calculos';

export function AlternativasPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [seleccionada, setSeleccionada] = useState<Alternativa | null>(null);
  const ultimaEstimacion = useAppStore((state) => state.ultimaEstimacion);

  const destacadaParam = searchParams.get('destacada');
  const recomendadaPorCalculo = ultimaEstimacion
    ? generarRecomendacion(ultimaEstimacion.sueroEstimado).alternativaId
    : null;
  const alternativaDestacada = destacadaParam ?? recomendadaPorCalculo;

  useEffect(() => {
    if (!destacadaParam) return;
    const encontrada = ALTERNATIVAS.find((item) => item.id === destacadaParam);
    if (encontrada) {
      setSeleccionada(encontrada);
    }
  }, [destacadaParam]);

  const handleCloseModal = () => {
    setSeleccionada(null);
    if (destacadaParam) {
      searchParams.delete('destacada');
      setSearchParams(searchParams, { replace: true });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Alternativas de valorización"
        description="Vías técnicas para aprovechar el lactosuero"
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {ALTERNATIVAS.map((alternativa) => (
          <AlternativaCard
            key={alternativa.id}
            alternativa={alternativa}
            esRecomendada={alternativaDestacada === alternativa.id}
            onSelect={setSeleccionada}
          />
        ))}
      </div>

      <AlternativaModal
        alternativa={seleccionada}
        onClose={handleCloseModal}
      />
    </div>
  );
}

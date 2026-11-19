import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Layers, Search } from 'lucide-react';
import { AlternativaCard } from '../components/domain/AlternativaCard';
import { AlternativaModal } from '../components/domain/AlternativaModal';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Input } from '../components/ui/Input';
import { ALTERNATIVAS } from '../config/constants';
import { useAppStore } from '../store/useAppStore';
import type {
  Alternativa,
  AlternativaCategoria,
} from '../types/produccion.types';
import { generarRecomendacion } from '../utils/calculos';
import { cn } from '../utils/cn';

const CATEGORIAS_FILTRO: Array<'Todas' | AlternativaCategoria> = [
  'Todas',
  'Alimentación humana',
  'Agro y bioinsumos',
  'Nutrición animal',
  'Energía y red',
];

export function AlternativasPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [seleccionada, setSeleccionada] = useState<Alternativa | null>(null);
  const [categoriaActiva, setCategoriaActiva] = useState<
    'Todas' | AlternativaCategoria
  >('Todas');
  const [busqueda, setBusqueda] = useState('');

  const ultimaEstimacion = useAppStore((state) => state.ultimaEstimacion);
  const isGeneratingIA = useAppStore((state) => state.isGeneratingIA);
  const consultarAlternativaConIA = useAppStore(
    (state) => state.consultarAlternativaConIA,
  );

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

  const alternativasFiltradas = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return ALTERNATIVAS.filter((item) => {
      if (categoriaActiva !== 'Todas' && item.categoria !== categoriaActiva) {
        return false;
      }
      if (!q) return true;
      return (
        item.titulo.toLowerCase().includes(q) ||
        item.resumen.toLowerCase().includes(q) ||
        item.categoria.toLowerCase().includes(q) ||
        item.equipamientoBasico.some((eq) => eq.toLowerCase().includes(q))
      );
    });
  }, [categoriaActiva, busqueda]);

  const handleCloseModal = () => {
    setSeleccionada(null);
    if (destacadaParam) {
      searchParams.delete('destacada');
      setSearchParams(searchParams, { replace: true });
    }
  };

  const handleConsultIA = (alternativa: Alternativa) => {
    if (isGeneratingIA) return;
    setSeleccionada(null);
    void consultarAlternativaConIA(alternativa.id, alternativa.titulo);
    navigate('/');
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Alternativas de valorización"
        description={`${ALTERNATIVAS.length} vías técnicas para aprovechar el lactosuero`}
      />

      <div className="flex flex-col gap-3 rounded-xl border border-stone-200/80 bg-white p-3.5 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/90 dark:shadow-none lg:flex-row lg:items-center lg:justify-between">
        <div className="relative min-w-0 flex-1 lg:max-w-sm">
          <Search
            className="pointer-events-none absolute left-3.5 top-3 z-10 h-4 w-4 text-zinc-400 dark:text-zinc-500"
            aria-hidden="true"
          />
          <Input
            aria-label="Buscar alternativa"
            placeholder="Buscar (ricota, pan, biogás, compost)..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="h-10 pl-10 text-base sm:text-sm"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {CATEGORIAS_FILTRO.map((cat) => {
            const activa = cat === categoriaActiva;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoriaActiva(cat)}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500',
                  activa
                    ? 'bg-amber-600 text-white dark:bg-amber-500 dark:text-zinc-950'
                    : 'bg-stone-100 text-zinc-700 hover:bg-stone-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700',
                )}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {alternativasFiltradas.length === 0 ? (
        <EmptyState
          icon={<Layers className="h-5 w-5" aria-hidden="true" />}
          title="No hay alternativas con ese filtro"
          description="Prueba limpiando el buscador o cambiando de categoría."
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setBusqueda('');
                setCategoriaActiva('Todas');
              }}
            >
              Mostrar todas
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {alternativasFiltradas.map((alternativa) => (
            <AlternativaCard
              key={alternativa.id}
              alternativa={alternativa}
              esRecomendada={alternativaDestacada === alternativa.id}
              isGeneratingIA={isGeneratingIA}
              onSelect={setSeleccionada}
              onConsultIA={handleConsultIA}
            />
          ))}
        </div>
      )}

      <AlternativaModal
        alternativa={seleccionada}
        isGeneratingIA={isGeneratingIA}
        onClose={handleCloseModal}
        onConsultIA={handleConsultIA}
      />
    </div>
  );
}

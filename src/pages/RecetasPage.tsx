import { useMemo, useState } from 'react';
import { BookOpen, RefreshCw, Search } from 'lucide-react';
import { RecetaCard } from '../components/domain/RecetaCard';
import { RecetaModal } from '../components/domain/RecetaModal';
import { PageHeader } from '../components/layout/PageHeader';
import { Alert } from '../components/ui/Alert';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Input } from '../components/ui/Input';
import { Skeleton } from '../components/ui/Skeleton';
import { useRecetas } from '../hooks/useRecetas';
import type { Receta } from '../types/receta.types';
import { cn } from '../utils/cn';

export function RecetasPage() {
  const { recetas, isLoading, error, recargar } = useRecetas(true);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaActiva, setCategoriaActiva] = useState('Todas');
  const [recetaSeleccionada, setRecetaSeleccionada] = useState<Receta | null>(
    null,
  );

  const categorias = useMemo(() => {
    const set = new Set<string>();
    recetas.forEach((r) => set.add(r.categoria));
    return ['Todas', ...Array.from(set).sort()];
  }, [recetas]);

  const recetasFiltradas = useMemo(() => {
    const query = busqueda.trim().toLowerCase();
    return recetas.filter((receta) => {
      const coincideCategoria =
        categoriaActiva === 'Todas' || receta.categoria === categoriaActiva;
      if (!coincideCategoria) return false;
      if (!query) return true;
      const enNombre = receta.nombre.toLowerCase().includes(query);
      const enCategoria = receta.categoria.toLowerCase().includes(query);
      const enOrigen = receta.origen.toLowerCase().includes(query);
      const enIngredientes = receta.ingredientes.some((ing) =>
        ing.nombre.toLowerCase().includes(query),
      );
      return enNombre || enCategoria || enOrigen || enIngredientes;
    });
  }, [recetas, busqueda, categoriaActiva]);

  const limpiarFiltros = () => {
    setBusqueda('');
    setCategoriaActiva('Todas');
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Recetas con ricota"
        description="Preparaciones para valorizar ricota recuperada"
      />

      <div className="flex flex-col gap-3 rounded-xl border border-stone-200/80 bg-white p-3.5 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/90 dark:shadow-none lg:flex-row lg:items-center lg:justify-between">
        <div className="relative min-w-0 flex-1 lg:max-w-sm">
          <Search
            className="pointer-events-none absolute left-3.5 top-3 z-10 h-4 w-4 text-zinc-400 dark:text-zinc-500"
            aria-hidden="true"
          />
          <Input
            aria-label="Buscar receta o ingrediente"
            placeholder="Buscar receta o ingrediente..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="h-10 pl-10 text-sm"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 lg:justify-end">
          <div className="flex flex-wrap items-center gap-1.5">
            {categorias.map((categoria) => {
              const activa = categoria === categoriaActiva;
              return (
                <button
                  key={categoria}
                  type="button"
                  onClick={() => setCategoriaActiva(categoria)}
                  className={cn(
                    'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500',
                    activa
                      ? 'bg-amber-600 text-white dark:bg-amber-500 dark:text-zinc-950'
                      : 'bg-stone-100 text-zinc-700 hover:bg-stone-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700',
                  )}
                >
                  {categoria}
                </button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => void recargar()}
            disabled={isLoading}
            aria-label="Recargar catálogo de recetas"
            title="Recargar catálogo"
            className="h-8 px-2.5"
          >
            <RefreshCw
              className={cn('h-3.5 w-3.5', isLoading && 'animate-spin')}
              aria-hidden="true"
            />
          </Button>
        </div>
      </div>

      {error && (
        <Alert
          variant="error"
          title="No se pudieron consultar las recetas"
          action={
            <Button
              size="sm"
              variant="outline"
              onClick={() => void recargar()}
            >
              Reintentar
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {isLoading && recetas.length === 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="flex flex-col gap-3 rounded-xl border border-stone-200/80 bg-white p-4 dark:border-zinc-800/80 dark:bg-zinc-900/90"
            >
              <Skeleton className="aspect-video w-full" />
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : !error && recetasFiltradas.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="h-5 w-5" aria-hidden="true" />}
          title="No se encontraron recetas coincidentes"
          description={
            busqueda || categoriaActiva !== 'Todas'
              ? 'Ajusta la búsqueda o limpia los filtros aplicados.'
              : 'No hay recetas disponibles en este momento.'
          }
          action={
            (busqueda || categoriaActiva !== 'Todas') && (
              <Button variant="outline" size="sm" onClick={limpiarFiltros}>
                Limpiar filtros
              </Button>
            )
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recetasFiltradas.map((receta) => (
            <RecetaCard
              key={receta.id}
              receta={receta}
              onSelect={setRecetaSeleccionada}
            />
          ))}
        </div>
      )}

      <RecetaModal
        receta={recetaSeleccionada}
        onClose={() => setRecetaSeleccionada(null)}
      />
    </div>
  );
}

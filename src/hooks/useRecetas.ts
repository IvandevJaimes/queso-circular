import { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';

export function useRecetas(autoFetch = true) {
  const recetas = useAppStore((state) => state.recetas);
  const recetasCargadas = useAppStore((state) => state.recetasCargadas);
  const isLoading = useAppStore((state) => state.isLoadingRecetas);
  const error = useAppStore((state) => state.errorRecetas);
  const cargarRecetas = useAppStore((state) => state.cargarRecetas);

  useEffect(() => {
    if (autoFetch && !recetasCargadas && !isLoading) {
      void cargarRecetas(false);
    }
  }, [autoFetch, recetasCargadas, isLoading, cargarRecetas]);

  return {
    recetas,
    isLoading,
    error,
    recargar: () => cargarRecetas(true),
  };
}

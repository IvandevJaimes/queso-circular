import { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';

export function useProducciones(autoFetch = true) {
  const producciones = useAppStore((state) => state.producciones);
  const produccionesCargadas = useAppStore(
    (state) => state.produccionesCargadas,
  );
  const isLoading = useAppStore((state) => state.isLoadingProducciones);
  const isSaving = useAppStore((state) => state.isSavingProduccion);
  const deletingId = useAppStore((state) => state.deletingId);
  const error = useAppStore((state) => state.errorProducciones);
  const cargarProducciones = useAppStore((state) => state.cargarProducciones);
  const guardarProduccion = useAppStore((state) => state.guardarProduccion);
  const eliminarProduccion = useAppStore((state) => state.eliminarProduccion);

  useEffect(() => {
    if (autoFetch && !produccionesCargadas && !isLoading) {
      void cargarProducciones();
    }
  }, [autoFetch, produccionesCargadas, isLoading, cargarProducciones]);

  return {
    producciones,
    isLoading,
    isSaving,
    deletingId,
    error,
    recargar: cargarProducciones,
    guardarProduccion,
    eliminarProduccion,
  };
}

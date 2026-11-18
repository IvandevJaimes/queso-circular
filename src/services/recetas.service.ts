import {
  RECETAS_QUESO_CIRCULAR,
  type RecetaLocal,
} from '../config/recetas.data';

export const recetasService = {
  async obtenerRecetas(busqueda?: string): Promise<RecetaLocal[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (!busqueda || busqueda.trim() === '') {
      return RECETAS_QUESO_CIRCULAR;
    }

    const query = busqueda.toLowerCase().trim();
    return RECETAS_QUESO_CIRCULAR.filter(
      (r) =>
        r.titulo.toLowerCase().includes(query) ||
        r.categoria.toLowerCase().includes(query) ||
        r.ingredientes.some((i) => i.toLowerCase().includes(query)),
    );
  },

  async obtenerRecetaPorId(id: string): Promise<RecetaLocal | null> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return RECETAS_QUESO_CIRCULAR.find((r) => r.id === id) || null;
  },
};

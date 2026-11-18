import { THEMEALDB_RICOTTA_URL } from '../config/constants';
import type {
  Receta,
  RecetaApiItem,
  RecetaApiResponse,
  RecetaIngrediente,
} from '../types/receta.types';
import {
  traducirCategoria,
  traducirIngrediente,
  traducirMedida,
  traducirOrigen,
} from '../utils/translations';
import { fetchJson, HttpError } from './http';

function extraerIngredientes(item: RecetaApiItem): RecetaIngrediente[] {
  const ingredientes: RecetaIngrediente[] = [];

  for (let i = 1; i <= 20; i++) {
    const nombreOriginal = item[`strIngredient${i}`]?.trim();
    const medidaOriginal = item[`strMeasure${i}`]?.trim() ?? '';

    if (nombreOriginal) {
      ingredientes.push({
        nombre: traducirIngrediente(nombreOriginal),
        medida: traducirMedida(medidaOriginal),
      });
    }
  }

  return ingredientes;
}

function normalizarReceta(item: RecetaApiItem): Receta {
  return {
    id: item.idMeal,
    nombre: item.strMeal,
    categoria: traducirCategoria(item.strCategory?.trim() || 'Miscellaneous'),
    origen: traducirOrigen(item.strArea?.trim() || 'Unknown'),
    imagen: item.strMealThumb?.trim() || '',
    instrucciones:
      item.strInstructions?.trim() || 'Sin instrucciones disponibles.',
    ingredientes: extraerIngredientes(item),
    videoUrl: item.strYoutube?.trim() || null,
  };
}

export const recetasService = {
  async buscarRecetasRicota(): Promise<Receta[]> {
    try {
      const data = await fetchJson<RecetaApiResponse>(THEMEALDB_RICOTTA_URL);
      if (!data.meals) return [];
      return data.meals.map(normalizarReceta);
    } catch (error) {
      if (error instanceof HttpError && error.status === 0) {
        throw new HttpError(
          'No fue posible consultar el catálogo de recetas. Verifica tu conexión a internet.',
          0,
        );
      }
      throw error;
    }
  },
};

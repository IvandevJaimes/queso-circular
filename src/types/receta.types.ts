export interface RecetaApiItem {
  idMeal: string;
  strMeal: string;
  strCategory: string | null;
  strArea: string | null;
  strInstructions: string | null;
  strMealThumb: string | null;
  strYoutube: string | null;
  [key: string]: string | null | undefined;
}

export interface RecetaApiResponse {
  meals: RecetaApiItem[] | null;
}

export interface RecetaIngrediente {
  nombre: string;
  medida: string;
}

export interface Receta {
  id: string;
  nombre: string;
  categoria: string;
  origen: string;
  imagen: string;
  instrucciones: string;
  ingredientes: RecetaIngrediente[];
  videoUrl: string | null;
}

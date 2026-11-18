export type AlternativaId = 'ricota' | 'agricola' | 'animal' | 'intercambio';

export type AlternativaIcono = 'chef-hat' | 'sprout' | 'heart-pulse' | 'handshake';

export interface Produccion {
  id: number;
  litrosLeche: number;
  quesoEstimado: number;
  sueroEstimado: number;
  fecha: string;
}

export interface CrearProduccionDTO {
  litrosLeche: number;
}

export interface EstimacionResultado {
  litrosLeche: number;
  quesoEstimado: number;
  sueroEstimado: number;
  guardadaEnHistorial: boolean;
}

export interface Alternativa {
  id: AlternativaId;
  titulo: string;
  resumen: string;
  descripcion: string;
  precaucion: string;
  precaucionesLista: string[];
  condicionesUso: string[];
  equipamientoBasico: string[];
  escalaIdeal: string;
  icono: AlternativaIcono;
}

export type RecomendacionNivel = 'bajo' | 'medio' | 'alto';

export interface Recomendacion {
  nivel: RecomendacionNivel;
  escalaBadge: string;
  categoria: string;
  alternativaId: AlternativaId;
  titulo: string;
  motivo: string;
}

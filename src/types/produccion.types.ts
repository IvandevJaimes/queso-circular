export type AlternativaId =
  | 'ricota'
  | 'bebida_lactea'
  | 'dulce_suero'
  | 'panificados'
  | 'requeson_untable'
  | 'vinagre_suero'
  | 'agricola'
  | 'compostaje'
  | 'biofertilizante_foliar'
  | 'animal'
  | 'ensilaje'
  | 'intercambio'
  | 'biogas'
  | 'secado_concentrado';

export type AlternativaCategoria =
  | 'Alimentación humana'
  | 'Agro y bioinsumos'
  | 'Nutrición animal'
  | 'Energía y red';

export type AlternativaIcono =
  | 'chef-hat'
  | 'glass-water'
  | 'flame'
  | 'wheat'
  | 'cookie'
  | 'flask'
  | 'sprout'
  | 'recycle'
  | 'leaf'
  | 'heart-pulse'
  | 'layers'
  | 'handshake'
  | 'droplets'
  | 'factory';

export type ContextoEstablecimientoId =
  | 'fuente_termica'
  | 'huerta_propia'
  | 'cria_animal'
  | 'red_tambos';

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
  categoria: AlternativaCategoria;
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

export interface RecomendacionIAResponse {
  origen: string;
  alternativaId: AlternativaId;
  titulo: string;
  viabilidad: 'Óptima' | 'Alta' | 'Moderada';
  rendimientoSecundario: string;
  justificacion: string;
  pasosAccion: [string, string, string];
  precaucionClave: string;
}

export interface ChatIAResponse {
  origen: string;
  mensaje: string;
  alternativaSugerida?: AlternativaId;
  tituloRecomendacion?: string;
  rendimientoSimple?: string;
  pasosSimples?: string[];
  consejoClave?: string;
  recetasSugeridas?: string[];
  sugerenciasSeguimiento: string[];
}

export interface HistorialChatItem {
  role: 'assistant' | 'user';
  texto: string;
}

export interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  texto: string;
  data?: ChatIAResponse;
  litrosContexto?: number;
}

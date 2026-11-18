import type { Alternativa } from '../types/produccion.types';

export const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const THEMEALDB_RICOTTA_URL =
  'https://www.themealdb.com/api/json/v1/1/search.php?s=ricotta';

export const RENDIMIENTO_QUESO = 0.12;
export const RENDIMIENTO_SUERO = 0.88;
export const PORCENTAJE_QUESO = 12;
export const PORCENTAJE_SUERO = 88;

export const MAX_LITROS_OPERATIVO = 50000;
export const PRESETS_LITROS = [25, 50, 120, 250] as const;

export const UMBRAL_VOLUMEN_BAJO_SUERO = 30;
export const UMBRAL_VOLUMEN_MEDIO_SUERO = 150;

export const ALTERNATIVAS: Alternativa[] = [
  {
    id: 'ricota',
    titulo: 'Elaboración de ricota',
    resumen:
      'Recupera proteínas séricas por calentamiento y acidificación suave para consumo directo o venta local.',
    descripcion:
      'El lactosuero dulce conserva proteínas de alto valor biológico precipitables entre 85 °C y 90 °C mediante coagulación ácida suave.',
    precaucion:
      'Respetar higiene alimentaria, control térmico y cadena de frío bajo 4 °C.',
    precaucionesLista: [
      'Controlar temperatura uniforme para evitar quemado proteico.',
      'Enfriar rápido tras el desuerado y refrigerar bajo 4 °C.',
      'Mantener utensilios sanitizados durante todo el proceso.',
    ],
    condicionesUso: [
      'Procesar suero fresco dentro de las 4 horas posteriores.',
      'Trabajar con baja acidez titulable en tina limpia.',
      'Escurrir en moldes o telas sanitizadas sin presión.',
    ],
    equipamientoBasico: [
      'Olla o tina térmica',
      'Termómetro (95 °C)',
      'Acidificante',
      'Moldes perforados',
    ],
    escalaIdeal: '> 30 L',
    icono: 'chef-hat',
  },
  {
    id: 'agricola',
    titulo: 'Enmiendas agrícolas controladas',
    resumen:
      'Aporte dosificado de nutrientes y materia orgánica en suelos, pasturas o pilas de compostaje.',
    descripcion:
      'El suero diluido aporta fósforo, potasio y calcio al suelo, potenciando la actividad microbiana en planes de fertirriego o compost.',
    precaucion:
      'Controlar dosis por hectárea y distancia a napas para evitar salinización.',
    precaucionesLista: [
      'Evitar aplicar sobre suelos saturados o antes de lluvias.',
      'Respetar distancia mínima a cursos de agua superficiales.',
      'Monitorear pH y conductividad para evitar acidificación.',
    ],
    condicionesUso: [
      'Analizar pH y salinidad del suelo antes de aplicar.',
      'Diluir con agua de riego o mezclar en compost.',
      'Aplicar de forma homogénea en parcelas definidas.',
    ],
    equipamientoBasico: [
      'Tanque de mezcla',
      'Bomba dosificadora',
      'Medidor de pH',
    ],
    escalaIdeal: '< 150 L',
    icono: 'sprout',
  },
  {
    id: 'animal',
    titulo: 'Suplementación animal',
    resumen:
      'Complemento líquido energético en dietas balanceadas para ganado porcino o bovino bajo control.',
    descripcion:
      'Por su contenido de lactosa y minerales, el suero fresco se integra como suplemento energético en raciones animales planificadas.',
    precaucion:
      'Ajustar dosis diaria según especie y retirar cualquier partida fermentada.',
    precaucionesLista: [
      'Descartar suero con fermentación indeseada o contaminación.',
      'Lavar diariamente bebederos para evitar carga bacteriana.',
      'Introducir de forma gradual junto a ración seca.',
    ],
    condicionesUso: [
      'Suministrar suero fresco del día y estabilizado.',
      'Dosificar volumen máximo según especie y peso.',
      'Registrar consumo diario por lote animal.',
    ],
    equipamientoBasico: [
      'Bebederos lavables',
      'Bidones con tapa',
      'Planilla de lote',
    ],
    escalaIdeal: '< 30 L',
    icono: 'heart-pulse',
  },
  {
    id: 'intercambio',
    titulo: 'Intercambio entre productores',
    resumen:
      'Articulación con tambos, granjas o plantas vecinas para valorizar excedentes diarios a mayor escala.',
    descripcion:
      'Coordinar retiros programados con establecimientos cercanos transforma excedentes diarios en insumo compartido reduciendo costos.',
    precaucion:
      'Garantizar retiro diario, trazabilidad sanitaria y transporte en envases cerrados.',
    precaucionesLista: [
      'Retirar en el día para evitar acidificación excesiva.',
      'Desinfectar tanques y válvulas tras cada descarga.',
      'Cumplir normativa sanitaria local de traslado lácteo.',
    ],
    condicionesUso: [
      'Acordar frecuencia fija de recolección diaria.',
      'Disponer punto de carga con tanque cerrado.',
      'Emitir remito interno con volumen y destino.',
    ],
    equipamientoBasico: [
      'Tanque pulmón limpio',
      'Contenedores rotulados',
      'Remito de entrega',
    ],
    escalaIdeal: '> 150 L',
    icono: 'handshake',
  },
];

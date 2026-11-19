export interface HistorialMensajeInput {
  role: 'user' | 'assistant';
  texto: string;
}

export interface ChatProduccionInput {
  litrosLeche?: number | string;
  litrosAnteriores?: number | string;
  tipoInteraccion?: 'inicial' | 'cambio_litros' | 'pregunta';
  alternativaObjetivo?: string;
  preguntaUsuario?: string;
  historial?: HistorialMensajeInput[];
  recetasPrevias?: string[];
  alternativasPrevias?: string[];
}

export interface RecomendarProduccionInput {
  litrosLeche: number | string;
  contexto?: string[];
}

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

interface GeminiGenerateResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
}

const GEMINI_BASE_URL =
  'https://generativelanguage.googleapis.com/v1beta/models';

const GEMINI_MODELOS_RESPALDO = [
  'gemini-3.1-flash-lite',
  'gemini-3.5-flash-lite',
  'gemini-3.8-flash',
];

const UMBRAL_SUERO_MUY_BAJO = 20;
const UMBRAL_SUERO_BAJO = 30;
const UMBRAL_SUERO_MEDIO = 150;

type EscalaLote = 'muy_bajo' | 'bajo' | 'medio' | 'alto';
type VariacionLitros = 'primero' | 'subio' | 'bajo' | 'igual';
type AnguloRespuesta =
  | 'practico_directo'
  | 'comparacion_rapida'
  | 'receta_destacada'
  | 'precaucion_manejo';

const ANGULOS_ROTATIVOS: readonly AnguloRespuesta[] = [
  'practico_directo',
  'comparacion_rapida',
  'receta_destacada',
  'precaucion_manejo',
];

const SYSTEM_INSTRUCTION =
  'Eres el motor experto de Queso Circular IA, especialista en ingeniería láctea y economía circular para pequeños productores queseros. ' +
  'A partir de los litros de leche, queso estimado (12%), lactosuero residual (88%), la escala del lote y los recursos disponibles del productor, ' +
  'devuelve EXCLUSIVAMENTE un objeto JSON válido con la mejor estrategia de valorización del lactosuero. ' +
  'Todas las cifras son orientativas. Cuando el suero estimado sea menor a 20 litros, prioriza salidas inmediatas en el día (cocina, ración animal directa o riego diluido) y evita recomendar acopio prolongado, logística compartida o procesos industriales. ' +
  'Prohibido usar emojis. Respeta estrictamente la longitud máxima de cada campo.';

const CATALOGO_RECETAS_IA = [
  { id: 'ricota-casera-tradicional', titulo: 'Ricota Fresca Artesanal', uso: 'suero >= 15 L en olla' },
  { id: 'noquis-de-ricota-suaves', titulo: 'Ñoquis Caseros de Ricota', uso: 'pasta con ricota' },
  { id: 'tarta-frola-ricota', titulo: 'Tarta Húmeda de Ricota, Limón y Canela', uso: 'postre con ricota' },
  { id: 'pan-casero-lactosuero', titulo: 'Pan Artesanal con Lactosuero', uso: 'uso directo desde 1 L de suero' },
  { id: 'focaccia-suero-romero', titulo: 'Focaccia de Suero y Romero', uso: 'panificado directo con poco suero' },
  { id: 'canelones-espinaca-ricota', titulo: 'Canelones de Espinaca y Ricota', uso: 'plato relleno con ricota' },
  { id: 'budin-citrico-ricota', titulo: 'Budín Húmedo de Ricota y Limón', uso: 'repostería con ricota' },
  { id: 'requeson-untable-hierbas', titulo: 'Requesón Cremoso Untable', uso: 'valor agregado con ricota' },
  { id: 'dulce-de-suero-artesanal', titulo: 'Dulce de Suero Caramelizado', uso: 'aprovechamiento directo de suero dulce' },
  { id: 'masa-pizza-suero', titulo: 'Masa Crujiente de Pizza con Suero', uso: 'lote muy bajo de suero' },
  { id: 'flan-cremoso-ricota', titulo: 'Flan Casero de Ricota y Caramelo', uso: 'postre tradicional' },
  { id: 'ravioles-ricota-espinaca', titulo: 'Ravioles de Ricota y Espinaca', uso: 'pasta rellena' },
  { id: 'sopa-crema-calabaza-suero', titulo: 'Sopa Crema de Calabaza y Suero', uso: 'lote muy bajo uso inmediato' },
  { id: 'salsa-cremosa-ricota-pasta', titulo: 'Salsa Cremosa de Ricota', uso: 'salsa rápida con ricota' },
] as const;

const RECETAS_VALIDAS: ReadonlySet<string> = new Set(
  CATALOGO_RECETAS_IA.map((r) => r.id),
);
const RECETAS_ENUM: string[] = Array.from(RECETAS_VALIDAS);

const CHAT_SYSTEM_INSTRUCTION =
  'Eres el asistente cercano y práctico de Queso Circular IA para pequeños productores queseros. ' +
  'Responde en español cotidiano, claro y directo, evitando fórmulas robóticas y tecnicismos académicos. ' +
  'Si contextoLoteActual incluye litrosLeche, usa sus valores orientativos exactos (12% queso en kg, 88% suero en litros, ricota ~6% del suero). Si volumenDefinido es false, evalúa la viabilidad técnica general de la alternativa o consulta (escala recomendada, equipo necesario, condiciones y precauciones) sin inventar que el usuario ya ingresó un lote; al final puedes mencionar brevemente que si ingresa sus litros arriba afinarás los cálculos. ' +
  'Regla de escala muy baja (suero < 20 L): aclara con naturalidad que es una partida chica o de prueba, que no justifica acopio de varios días, biogás ni logística compartida, y prioriza usos inmediatos del día (cocina casera puntual, dosis moderada en animales o riego muy diluido 1:2-1:3 en huerta) con sus precauciones sanitarias breves. ' +
  'Regla anti-repetición: prohibido abrir todos los mensajes con muletillas fijas como "Con X L de leche..." o "Tu mejor opción es...". Varía el inicio según tipoTurno y anguloSugerido (ve directo al grano, compara dos salidas, abre por una receta o destaca primero una precaución clave). Si el usuario cambió los litros respecto a litrosAnteriores, comenta brevemente qué cambia al subir o bajar de escala. Si responde una pregunta de seguimiento, contesta la duda sin recitar de nuevo toda la introducción general. ' +
  'Prohibido usar emojis. Sé conciso (máximo 55 palabras en "mensaje") y devuelve 3 preguntas sugeridas cortas y distintas entre sí. ' +
  'Selecciona 2 o 3 IDs exactos de recetasDisponibles en "recetasSugeridas" adaptados al volumen y consulta, procurando variar respecto a evitarRepetirRecetas cuando haya otras opciones válidas.';

const GUIA_VIABILIDAD_SIN_LOTE: Record<
  AlternativaId,
  {
    titulo: string;
    mensaje: string;
    escala: string;
    pasos: [string, string, string];
    consejo: string;
    recetas: string[];
  }
> = {
  ricota: {
    titulo: 'Viabilidad de Elaboración de Ricota',
    mensaje:
      'Es muy viable desde unos 30 L de suero dulce fresco (rinde ~6% del suero, unos 1,8 kg cada 30 L). Si aún no definiste litros, verifica tener olla térmica, acidificante y frío bajo 4 °C.',
    escala: 'Recomendada desde 30 L de suero (~6% de rinde)',
    pasos: [
      'Asegura suero dulce fresco procesado antes de 4 horas.',
      'Ten termómetro, olla limpia y vinagre o ácido cítrico.',
      'Prevé frío bajo 4 °C y destino para el permeado tibio.',
    ],
    consejo:
      'Si tu lote diario es menor a 20 L de suero, suele rendir mejor panificados.',
    recetas: ['ricota-casera-tradicional', 'tarta-frola-ricota', 'noquis-de-ricota-suaves'],
  },
  bebida_lactea: {
    titulo: 'Viabilidad de Bebida Láctea Fermentada',
    mensaje:
      'Conviene a partir de ~20 L de suero dulce sin sal agregada. Requiere pasteurizar a 72–75 °C, pulpa o cultivo y cadena de frío continua para durar 5 a 7 días.',
    escala: 'Recomendada desde 20 L de suero dulce',
    pasos: [
      'Confirma que el suero sea dulce y sin salmuera.',
      'Pasteuriza a 72–75 °C antes de sumar fruta o fermento.',
      'Envasa en botellas sanitizadas y refrigera entre 2 y 4 °C.',
    ],
    consejo:
      'Nunca mezcles suero salado ni omitas la pasteurización previa.',
    recetas: ['dulce-de-suero-artesanal', 'pan-casero-lactosuero', 'flan-cremoso-ricota'],
  },
  dulce_suero: {
    titulo: 'Viabilidad de Dulce de Suero',
    mensaje:
      'Funciona bien en tandas de 20 a 100 L de suero dulce sin sal. Exige tiempo de fuego lento y paila gruesa para evaporar agua con azúcar (12–15%) hasta lograr untable.',
    escala: 'Ideal entre 20 y 100 L de suero dulce',
    pasos: [
      'Parte de suero dulce fresco neutralizando leve acidez.',
      'Añade 12–15% de azúcar y cocina en paila gruesa sin quemar.',
      'Envasa en caliente en frascos limpios y esterilizados.',
    ],
    consejo:
      'Ten en cuenta el consumo de gas o leña frente al precio de venta local.',
    recetas: ['dulce-de-suero-artesanal', 'budin-citrico-ricota', 'flan-cremoso-ricota'],
  },
  panificados: {
    titulo: 'Viabilidad como Sustituto en Panadería',
    mensaje:
      'Es la opción más flexible: viable desde menos de 5 L hasta lotes medianos, sin inversión extra. Sustituye el agua en panes, pizzas y focaccias mejorando miga y corteza.',
    escala: 'Viable desde 1 L de suero (toda escala)',
    pasos: [
      'Usa suero fresco del día o refrigerado limpio en vez de agua.',
      'Ajusta la sal de la receta si el suero proviene de quesos salados.',
      'Vigila tiempos de leudado porque fermenta más rápido.',
    ],
    consejo:
      'Si ingresas tus litros en la calculadora te indico cuántas tandas salen.',
    recetas: ['pan-casero-lactosuero', 'focaccia-suero-romero', 'masa-pizza-suero'],
  },
  requeson_untable: {
    titulo: 'Viabilidad de Requesón Cremoso Untable',
    mensaje:
      'Viable desde ~25 L de suero (o partiendo de ricota recién escurrida). Agrega valor comercial con bajo equipamiento extra usando procesador y frascos sanitizados.',
    escala: 'Recomendada desde 25 L de suero o 1,5 kg de ricota',
    pasos: [
      'Obtén ricota tibia bien escurrida sin dejar que se seque de más.',
      'Emulsiona con un toque de crema o suero fresco y hierbas.',
      'Envasa hermético y conserva siempre bajo 4 °C.',
    ],
    consejo:
      'Consume dentro de 5 a 7 días manteniendo estricta higiene en frascos.',
    recetas: ['requeson-untable-hierbas', 'ricota-casera-tradicional', 'salsa-cremosa-ricota-pasta'],
  },
  vinagre_suero: {
    titulo: 'Viabilidad de Vinagre Artesanal de Suero',
    mensaje:
      'Apto para partidas de 15 a 80 L si tienes paciencia de fermentación (2 a 4 semanas). Requiere suero filtrado, azúcar/levadura y madre de vinagre en ambiente cálido.',
    escala: 'Escala chica/media (15–80 L), ciclo lento',
    pasos: [
      'Filtra y clarifica el suero dulce antes de iniciar fermentación.',
      'Realiza fermentación alcohólica previa y luego inocula madre acética.',
      'Controla acidez y filtra para embotellar producto estable.',
    ],
    consejo:
      'No es una salida inmediata para vaciar tanques en el día.',
    recetas: ['pan-casero-lactosuero', 'sopa-crema-calabaza-suero', 'focaccia-suero-romero'],
  },
  agricola: {
    titulo: 'Viabilidad de Riego Agrícola Diluido',
    mensaje:
      'Viable a cualquier escala si cuentas con pastura o huerta propia. Nunca se aplica puro: exige diluir 1 parte de suero en 2 a 3 de agua y evitar quesos muy salados.',
    escala: 'Apta para cualquier volumen con dilución 1:2–1:3',
    pasos: [
      'Confirma que el suero no tenga exceso de sal ni químicos.',
      'Diluye mínimo 1:2 (o 1:3 en huerta sensible) con agua limpia.',
      'Riega lejos de pozos, arroyos y evita suelos encharcados.',
    ],
    consejo:
      'Si luego cargas tus litros arriba te calculo el agua exacta de dilución.',
    recetas: ['pan-casero-lactosuero', 'sopa-crema-calabaza-suero'],
  },
  compostaje: {
    titulo: 'Viabilidad como Acelerador de Compost',
    mensaje:
      'Muy viable en pequeña y mediana escala siempre que tengas suficiente material seco (hojas, paja, aserrín). Aporta humedad y nitrógeno sin riesgo si no se encharca.',
    escala: 'Escala chica/media (hasta 100 L/semana)',
    pasos: [
      'Alterna capas abundantes de material seco rico en carbono.',
      'Humedece con suero sin saturar ni generar escurrimientos.',
      'Voltea la pila periódicamente para asegurar aireación y sin olor.',
    ],
    consejo:
      'El exceso líquido pudre la pila; compensa siempre con fibra seca.',
    recetas: ['pan-casero-lactosuero', 'masa-pizza-suero'],
  },
  biofertilizante_foliar: {
    titulo: 'Viabilidad de Biofertilizante Foliar Fermentado',
    mensaje:
      'Viable entre 10 y 100 L para uso en quinta o pasturas. Necesitas biodigestor o tanque plástico cerrado con trampa de aire por 15 a 30 días y posterior dilución al 5–10%.',
    escala: '10–100 L en fermentación controlada',
    pasos: [
      'Mezcla suero dulce con agua no clorada y melaza en tanque cerrado.',
      'Coloca salida de gases con manguera en botella de agua (anaerobio).',
      'Diluye al 5–10% antes de pulverizar en horas frescas.',
    ],
    consejo:
      'Prueba primero en pocas plantas para verificar tolerancia del cultivo.',
    recetas: ['pan-casero-lactosuero', 'sopa-crema-calabaza-suero'],
  },
  animal: {
    titulo: 'Viabilidad en Suplementación Animal',
    mensaje:
      'Viable desde pocos litros hasta volúmenes altos si tienes cerdos, bovinos o aves. Requiere entrega fresca en el día, adaptación gradual y lavado diario de bebederos.',
    escala: 'Todas las escalas con animales en predio',
    pasos: [
      'Entrega suero fresco del día acompañado de pasto o grano seco.',
      'Aumenta la dosis gradualmente durante la primera semana.',
      'Lava los bebederos a diario y deja agua limpia siempre aparte.',
    ],
    consejo:
      'Nunca des suero viejo o muy agrio porque provoca diarreas.',
    recetas: ['pan-casero-lactosuero', 'sopa-crema-calabaza-suero'],
  },
  ensilaje: {
    titulo: 'Viabilidad como Inoculante de Ensilaje',
    mensaje:
      'Conviene en tambos o campos con volumen medio/alto (> 80 L) durante confección de silos de pasto o maíz. Mejora la fermentación láctica aportando lactosa y bacterias benéficas.',
    escala: 'Escala media/alta (> 80 L) en época de silo',
    pasos: [
      'Rocía uniformemente el forraje picado al compactar el silo.',
      'Controla que no drene líquido por exceso de humedad.',
      'Sella hermético de inmediato para asegurar fermentación anaerobia.',
    ],
    consejo:
      'Asegura que el forraje tenga buena materia seca antes de aplicar.',
    recetas: ['ricota-casera-tradicional', 'pan-casero-lactosuero'],
  },
  intercambio: {
    titulo: 'Viabilidad de Intercambio entre Productores',
    mensaje:
      'Solo justifica logística a partir de unos 120–150 L diarios o acumulables en frío en el día. En lotes muy chicos el costo de flete o traslado supera el valor del suero.',
    escala: 'Escala media/alta (> 150 L/día)',
    pasos: [
      'Verifica un volumen diario constante que justifique el retiro.',
      'Acopia en tanque cerrado higienizable bajo techo máximo 24 h.',
      'Acuerda horario fijo con granjas porcinas o tambos cercanos.',
    ],
    consejo:
      'Ingresa tus litros en la calculadora para confirmar si superas el umbral.',
    recetas: ['ricota-casera-tradicional', 'dulce-de-suero-artesanal'],
  },
  biogas: {
    titulo: 'Viabilidad de Biodigestión para Biogás',
    mensaje:
      'Solo es viable en escalas grandes y continuas (> 300–500 L diarios) junto a estiércol bovino o porcino, por la inversión en biodigestor y necesidad de carga estable.',
    escala: 'Escala alta (> 300 L diarios continuos)',
    pasos: [
      'Confirma flujo diario constante y disponibilidad de estiércol para co-digestión.',
      'Controla el pH para que la lactosa no acidifique el biodigestor.',
      'Dimensiona trampa de seguridad y aprovechamiento térmico del gas.',
    ],
    consejo:
      'Para partidas chicas o esporádicas no es viable; elige panificados o uso directo.',
    recetas: ['pan-casero-lactosuero', 'ricota-casera-tradicional'],
  },
  secado_concentrado: {
    titulo: 'Viabilidad de Secado / Concentrado Proteico',
    mensaje:
      'Requiere escala industrial (miles de litros diarios) y equipos de ultrafiltración o torre spray. Para pequeños queseros no es viable individualmente salvo en cooperativa.',
    escala: 'Escala industrial o cooperativa (> 2.000 L/día)',
    pasos: [
      'Evalúa asociarte con otros tambos para reunir volumen industrial.',
      'Garantiza cadena de frío a 4 °C antes de trasladar a planta.',
      'Como alternativa local individual, prioriza ricota o dulce concentrado.',
    ],
    consejo:
      'En tambos artesanales la ricota o el dulce sustituyen esa inversión con retorno inmediato.',
    recetas: ['ricota-casera-tradicional', 'dulce-de-suero-artesanal'],
  },
};

const ALTERNATIVAS_VALIDAS: ReadonlySet<AlternativaId> = new Set([
  'ricota',
  'bebida_lactea',
  'dulce_suero',
  'panificados',
  'requeson_untable',
  'vinagre_suero',
  'agricola',
  'compostaje',
  'biofertilizante_foliar',
  'animal',
  'ensilaje',
  'intercambio',
  'biogas',
  'secado_concentrado',
]);

const ALTERNATIVAS_ENUM: AlternativaId[] = Array.from(ALTERNATIVAS_VALIDAS);

const VIABILIDADES_VALIDAS: ReadonlySet<RecomendacionIAResponse['viabilidad']> =
  new Set(['Óptima', 'Alta', 'Moderada']);

const CONTEXTO_DESCRIPCION: Record<string, string> = {
  fuente_termica: 'Calor disponible (85-90 C)',
  huerta_propia: 'Suelo o pastura propia',
  cria_animal: 'Cria animal en predio',
  red_tambos: 'Productores cercanos para intercambio',
};

const PREGUNTAS_BASE = [
  '¿Cómo hago la ricota paso a paso?',
  'No tengo fuego ni olla grande, ¿qué otra opción hay?',
  '¿Cómo se lo doy a los animales sin que les haga mal?',
  '¿Cómo lo uso para regar la huerta o pastura?',
];

const PREGUNTAS_MUY_BAJO = [
  '¿Conviene hacer ricota con tan poco suero o mejor panificados?',
  '¿Cómo diluyo estos pocos litros para huerta o macetas?',
  '¿Cuánto le puedo dar hoy a aves o cerdos sin excederme?',
  '¿Cuánto tiempo dura este suero sin enfriar?',
];

function limpiarTexto(texto: unknown, maxLen: number): string {
  const textoStr =
    typeof texto === 'string'
      ? texto
      : typeof texto === 'number'
        ? String(texto)
        : '';
  const sinEmojis = textoStr
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (sinEmojis.length <= maxLen) return sinEmojis;
  return `${sinEmojis.slice(0, maxLen - 1).trimEnd()}.`;
}

function limitarPalabras(texto: unknown, maxPalabras: number): string {
  const limpio = limpiarTexto(texto, 360);
  const palabras = limpio.split(' ').filter(Boolean);
  if (palabras.length <= maxPalabras) return limpio;
  return palabras.slice(0, maxPalabras).join(' ');
}

function formatearDecimal(valor: number): string {
  return valor.toFixed(1).replace('.', ',');
}

function formatearEnteroOUnDecimal(valor: number): string {
  return Number.isInteger(valor)
    ? String(valor)
    : valor.toFixed(1).replace('.', ',');
}

function clasificarEscalaSuero(sueroEstimado: number): EscalaLote {
  if (sueroEstimado < UMBRAL_SUERO_MUY_BAJO) return 'muy_bajo';
  if (sueroEstimado < UMBRAL_SUERO_BAJO) return 'bajo';
  if (sueroEstimado <= UMBRAL_SUERO_MEDIO) return 'medio';
  return 'alto';
}

function elegirVariante<T>(opciones: readonly T[], semilla: number): T {
  const idx = Math.abs(Math.trunc(semilla)) % opciones.length;
  return opciones[idx];
}

function calcularVariacionLitros(
  litrosActuales: number,
  litrosAnteriores?: number,
): VariacionLitros {
  if (!litrosAnteriores || litrosAnteriores <= 0) return 'primero';
  if (litrosActuales > litrosAnteriores) return 'subio';
  if (litrosActuales < litrosAnteriores) return 'bajo';
  return 'igual';
}

function rotarSinRepetir(
  candidatas: readonly string[],
  previas: ReadonlySet<string>,
  desplazamiento = 0,
): string[] {
  const nuevas = candidatas.filter((id) => !previas.has(id));
  const repetidas = candidatas.filter((id) => previas.has(id));
  const combinadas = [...nuevas, ...repetidas];
  if (combinadas.length <= 3) return combinadas;
  const start = desplazamiento % combinadas.length;
  const rotadas = [
    ...combinadas.slice(start),
    ...combinadas.slice(0, start),
  ];
  return rotadas.slice(0, 3);
}

function seleccionarRecetasPorDefecto(
  sueroEstimado: number,
  pregunta: string,
  recetasPrevias: string[] = [],
  semilla = 0,
): string[] {
  const q = pregunta.toLowerCase();
  const previas = new Set(recetasPrevias);

  if (
    q.includes('pasta') ||
    q.includes('ñoqui') ||
    q.includes('canelon') ||
    q.includes('raviol')
  ) {
    return rotarSinRepetir(
      [
        'noquis-de-ricota-suaves',
        'ravioles-ricota-espinaca',
        'salsa-cremosa-ricota-pasta',
        'canelones-espinaca-ricota',
      ],
      previas,
      semilla,
    );
  }
  if (q.includes('postre') || q.includes('dulce') || q.includes('tarta') || q.includes('flan')) {
    return rotarSinRepetir(
      sueroEstimado < UMBRAL_SUERO_MUY_BAJO
        ? [
            'dulce-de-suero-artesanal',
            'budin-citrico-ricota',
            'flan-cremoso-ricota',
            'tarta-frola-ricota',
          ]
        : [
            'tarta-frola-ricota',
            'flan-cremoso-ricota',
            'dulce-de-suero-artesanal',
            'budin-citrico-ricota',
          ],
      previas,
      semilla,
    );
  }
  if (q.includes('pan') || q.includes('pizza') || q.includes('masa') || q.includes('fuego')) {
    return rotarSinRepetir(
      [
        'pan-casero-lactosuero',
        'focaccia-suero-romero',
        'masa-pizza-suero',
        'sopa-crema-calabaza-suero',
      ],
      previas,
      semilla,
    );
  }

  const escala = clasificarEscalaSuero(sueroEstimado);
  if (escala === 'muy_bajo') {
    return rotarSinRepetir(
      [
        'masa-pizza-suero',
        'pan-casero-lactosuero',
        'sopa-crema-calabaza-suero',
        'focaccia-suero-romero',
        'dulce-de-suero-artesanal',
      ],
      previas,
      semilla,
    );
  }
  if (escala === 'bajo') {
    return rotarSinRepetir(
      [
        'pan-casero-lactosuero',
        'focaccia-suero-romero',
        'dulce-de-suero-artesanal',
        'masa-pizza-suero',
        'sopa-crema-calabaza-suero',
      ],
      previas,
      semilla,
    );
  }
  if (escala === 'medio') {
    return rotarSinRepetir(
      [
        'ricota-casera-tradicional',
        'tarta-frola-ricota',
        'noquis-de-ricota-suaves',
        'requeson-untable-hierbas',
        'canelones-espinaca-ricota',
      ],
      previas,
      semilla,
    );
  }
  return rotarSinRepetir(
    [
      'ricota-casera-tradicional',
      'dulce-de-suero-artesanal',
      'requeson-untable-hierbas',
      'pan-casero-lactosuero',
      'budin-citrico-ricota',
    ],
    previas,
    semilla,
  );
}


function obtenerModelosCandidatos(): string[] {
    const personalizado = process.env.GEMINI_MODEL?.trim();
    if (!personalizado) return GEMINI_MODELOS_RESPALDO;
    return [
      personalizado,
      ...GEMINI_MODELOS_RESPALDO.filter((m) => m !== personalizado),
    ];
  }

async function llamarGeminiConRespaldo(
    apiKey: string,
    payload: Record<string, unknown>,
  ): Promise<{ modelo: string; rawText: string } | null> {
    const modelos = obtenerModelosCandidatos();

    for (const modelo of modelos) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5500);

      try {
        const response = await fetch(
          `${GEMINI_BASE_URL}/${modelo}:generateContent?key=${encodeURIComponent(apiKey)}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal,
            body: JSON.stringify(payload),
          },
        );

        if (!response.ok) {
          const errBody = await response.text().catch(() => '');
          console.error('[IaEngine]', `Modelo ${modelo} devolvió estado ${response.status}: ${errBody.slice(0, 200)}`);
          continue;
        }

        const data = (await response.json()) as GeminiGenerateResponse;
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          return { modelo, rawText };
        }
      } catch (error) {
        const reason = error instanceof Error ? error.message : 'Error de red';
        console.warn('[IaEngine]', `Fallo llamando a ${modelo}: ${reason}`);
      } finally {
        clearTimeout(timeoutId);
      }
    }

    return null;
  }

export async function generarRecomendacionEngine(
  dto: RecomendarProduccionInput,
  ): Promise<RecomendacionIAResponse> {
    const litros = Number(dto?.litrosLeche);
    const litrosSeguros = Number.isFinite(litros) && litros > 0 ? litros : 0;
    const quesoEstimado = +(litrosSeguros * 0.12).toFixed(2);
    const sueroEstimado = +(litrosSeguros * 0.88).toFixed(2);
    const escala = clasificarEscalaSuero(sueroEstimado);
    const contexto = Array.isArray(dto?.contexto)
      ? dto.contexto
          .map((item) => (typeof item === 'string' ? item.trim() : ''))
          .filter(Boolean)
      : [];

    try {
      const apiKey = process.env.GEMINI_API_KEY?.trim();
      if (!apiKey || apiKey === 'tu_api_key_de_google_ai_studio') {
        console.warn('[IaEngine] GEMINI_API_KEY no configurada; usando motor-local en /recomendar.');
        return generarFallbackLocal(sueroEstimado, contexto);
      }

      const contextoLegible =
        contexto.length > 0
          ? contexto.map((key) => CONTEXTO_DESCRIPCION[key] ?? key)
          : ['Sin recursos especificados'];

      const resultado = await llamarGeminiConRespaldo(apiKey, {
        systemInstruction: {
          parts: [{ text: SYSTEM_INSTRUCTION }],
        },
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: JSON.stringify({
                  litrosLeche: litrosSeguros,
                  quesoEstimadoKg: quesoEstimado,
                  sueroEstimadoLitros: sueroEstimado,
                  escalaLote: escala,
                  notaEscala:
                    escala === 'muy_bajo'
                      ? 'Partida muy chica (<20 L de suero). Valores orientativos. Priorizar uso inmediato (panificados, animal o riego muy diluido). No recomendar intercambio, biogás ni secado.'
                      : undefined,
                  recursosDisponibles: contextoLegible,
                  restriccionesSalida: {
                    alternativaId: ALTERNATIVAS_ENUM.join(' | '),
                    titulo: 'máximo 7 palabras',
                    viabilidad: 'Óptima | Alta | Moderada',
                    rendimientoSecundario:
                      'cifra estimada corta en español (ej: ~5,3 kg de ricota + 83 L permeado)',
                    justificacion: '1 oración directa, máximo 140 caracteres',
                    pasosAccion:
                      'exactamente 3 pasos cortos, máximo 10 palabras cada uno',
                    precaucionClave:
                      '1 línea corta de inocuidad o ambiente, máximo 90 caracteres',
                  },
                }),
              },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.45,
          responseSchema: {
            type: 'OBJECT',
            properties: {
              alternativaId: {
                type: 'STRING',
                enum: ALTERNATIVAS_ENUM,
              },
              titulo: { type: 'STRING' },
              viabilidad: {
                type: 'STRING',
                enum: ['Óptima', 'Alta', 'Moderada'],
              },
              rendimientoSecundario: { type: 'STRING' },
              justificacion: { type: 'STRING' },
              pasosAccion: {
                type: 'ARRAY',
                items: { type: 'STRING' },
              },
              precaucionClave: { type: 'STRING' },
            },
            required: [
              'alternativaId',
              'titulo',
              'viabilidad',
              'rendimientoSecundario',
              'justificacion',
              'pasosAccion',
              'precaucionClave',
            ],
          },
        },
      });

      if (!resultado) {
        return generarFallbackLocal(sueroEstimado, contexto);
      }

      const parsed = JSON.parse(
        resultado.rawText,
      ) as Partial<RecomendacionIAResponse>;
      return normalizarRespuestaGemini(
        parsed,
        resultado.modelo,
        sueroEstimado,
        contexto,
      );
    } catch (error) {
      const reason = error instanceof Error ? error.message : 'Error inesperado';
      console.error('[IaEngine]', `Error en generarRecomendacion: ${reason}`);
      return generarFallbackLocal(sueroEstimado, contexto);
    }
  }

export async function responderChatEngine(
  dto: ChatProduccionInput,
): Promise<ChatIAResponse> {
    const litrosRaw = Number(dto?.litrosLeche);
    const tieneLitros = Number.isFinite(litrosRaw) && litrosRaw > 0;
    const litrosLeche = tieneLitros ? litrosRaw : 0;
    const quesoEstimado = tieneLitros ? +(litrosLeche * 0.12).toFixed(2) : 0;
    const sueroEstimado = tieneLitros ? +(litrosLeche * 0.88).toFixed(2) : 0;
    const ricotaEstimada = tieneLitros ? +(sueroEstimado * 0.06).toFixed(1) : 0;
    const escala = clasificarEscalaSuero(sueroEstimado);
    const alternativaObjetivo =
      dto?.alternativaObjetivo &&
      ALTERNATIVAS_VALIDAS.has(dto.alternativaObjetivo as AlternativaId)
        ? (dto.alternativaObjetivo as AlternativaId)
        : undefined;
    const pregunta =
      typeof dto?.preguntaUsuario === 'string' ? dto.preguntaUsuario.trim() : '';
    const historialReciente = Array.isArray(dto?.historial)
      ? dto.historial
          .slice(-6)
          .filter(
            (item) =>
              item &&
              typeof item.texto === 'string' &&
              (item.role === 'user' || item.role === 'assistant'),
          )
      : [];
    const litrosAnterioresNum = Number(dto?.litrosAnteriores);
    const litrosAnteriores =
      Number.isFinite(litrosAnterioresNum) && litrosAnterioresNum > 0
        ? litrosAnterioresNum
        : undefined;
    const variacionLitros = tieneLitros
      ? calcularVariacionLitros(litrosLeche, litrosAnteriores)
      : 'primero';
    const tipoInteraccion: 'inicial' | 'cambio_litros' | 'pregunta' =
      dto?.tipoInteraccion ??
      (pregunta || !tieneLitros
        ? 'pregunta'
        : variacionLitros === 'subio' || variacionLitros === 'bajo'
          ? 'cambio_litros'
          : 'inicial');
    const recetasPrevias = Array.isArray(dto?.recetasPrevias)
      ? dto.recetasPrevias.filter((id) => RECETAS_VALIDAS.has(id)).slice(-6)
      : [];
    const alternativasPrevias = Array.isArray(dto?.alternativasPrevias)
      ? dto.alternativasPrevias.slice(-3)
      : [];
    const semillaVariacion =
      historialReciente.length +
      (variacionLitros === 'subio' ? 1 : variacionLitros === 'bajo' ? 2 : 0) +
      pregunta.length;
    const angulo = elegirVariante(ANGULOS_ROTATIVOS, semillaVariacion);

    const contextoChat = {
      tieneLitros,
      escala,
      alternativaObjetivo,
      litrosAnteriores,
      variacionLitros,
      tipoInteraccion,
      angulo,
      recetasPrevias,
      alternativasPrevias,
      semillaVariacion,
    };

    try {
      const apiKey = process.env.GEMINI_API_KEY?.trim();
      if (!apiKey || apiKey === 'tu_api_key_de_google_ai_studio') {
        console.warn('[IaEngine] GEMINI_API_KEY no configurada; usando motor-local en /chat.');
        return generarChatFallbackLocal(
          litrosLeche,
          sueroEstimado,
          ricotaEstimada,
          pregunta,
          contextoChat,
        );
      }

      const contents: Array<{
        role: 'user' | 'model';
        parts: Array<{ text: string }>;
      }> = historialReciente.map((item) => ({
        role: item.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: item.texto }],
      }));

      const consultaPorDefecto = !tieneLitros
        ? 'Evalúa de forma práctica qué se necesita y para qué escala es viable esta alternativa antes de definir los litros.'
        : tipoInteraccion === 'cambio_litros' && litrosAnteriores
          ? `Actualicé la partida de ${formatearEnteroOUnDecimal(litrosAnteriores)} L a ${formatearEnteroOUnDecimal(litrosLeche)} L de leche. Comenta brevemente qué cambia según la nueva escala, sugiere una estrategia práctica con un enfoque fresco y 2-3 recetas del catálogo.`
          : 'Evalúa esta partida de forma natural y práctica según la escala del suero, con enfoque útil para hoy y 2-3 recetas del catálogo.';

      contents.push({
        role: 'user',
        parts: [
          {
            text: JSON.stringify({
              contextoLoteActual: tieneLitros
                ? {
                    volumenDefinido: true,
                    litrosLeche,
                    quesoEstimadoKg: quesoEstimado,
                    sueroEstimadoLitros: sueroEstimado,
                    ricotaPotencialKg: ricotaEstimada,
                    escalaLote: escala,
                    caracterCifras:
                      'Todas las cantidades son estimaciones orientativas.',
                    ...(escala === 'muy_bajo'
                      ? {
                          criterioEscalaMinima:
                            'Volumen muy bajo (<20 L de suero). Aclara que es insuficiente para procesos de mayor escala, acopio prolongado o logística compartida. Prioriza aprovechamiento inmediato: cocina casera puntual, ración animal directa en dosis moderada o riego muy diluido (1:2-1:3) con cuidado de salinidad.',
                        }
                      : {}),
                  }
                : {
                    volumenDefinido: false,
                    ...(alternativaObjetivo
                      ? { alternativaConsultada: alternativaObjetivo }
                      : {}),
                    nota: 'El productor aún no ingresó una cantidad de leche en la calculadora. Evalúa viabilidad técnica general, escala mínima recomendada, requisitos y precauciones sin inventar que ya cargó litros.',
                  },
              memoriaConversacion: {
                tipoTurno: tipoInteraccion,
                litrosAnteriores: litrosAnteriores ?? null,
                variacionRespectoAnterior: variacionLitros,
                anguloSugerido: angulo,
                alternativasYaComentadas: alternativasPrevias,
                evitarRepetirRecetas: recetasPrevias,
              },
              recetasDisponibles: CATALOGO_RECETAS_IA,
              consultaProductor: pregunta || consultaPorDefecto,
            }),
          },
        ],
      });

      const resultado = await llamarGeminiConRespaldo(apiKey, {
        systemInstruction: {
          parts: [{ text: CHAT_SYSTEM_INSTRUCTION }],
        },
        contents,
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.72,
          responseSchema: {
            type: 'OBJECT',
            properties: {
              mensaje: { type: 'STRING' },
              alternativaSugerida: {
                type: 'STRING',
                enum: ALTERNATIVAS_ENUM,
              },
              tituloRecomendacion: { type: 'STRING' },
              rendimientoSimple: { type: 'STRING' },
              pasosSimples: {
                type: 'ARRAY',
                items: { type: 'STRING' },
              },
              consejoClave: { type: 'STRING' },
              recetasSugeridas: {
                type: 'ARRAY',
                items: {
                  type: 'STRING',
                  enum: RECETAS_ENUM,
                },
              },
              sugerenciasSeguimiento: {
                type: 'ARRAY',
                items: { type: 'STRING' },
              },
            },
            required: ['mensaje', 'recetasSugeridas', 'sugerenciasSeguimiento'],
          },
        },
      });

      if (!resultado) {
        console.warn('[IaEngine]', 
          'Ningún modelo Gemini disponible respondió; usando motor-local.',
        );
        return generarChatFallbackLocal(
          litrosLeche,
          sueroEstimado,
          ricotaEstimada,
          pregunta,
          contextoChat,
        );
      }

      const parsed = JSON.parse(resultado.rawText) as Partial<ChatIAResponse>;
      return normalizarChatGemini(
        parsed,
        resultado.modelo,
        litrosLeche,
        sueroEstimado,
        ricotaEstimada,
        pregunta,
        contextoChat,
      );
    } catch (error) {
      const reason = error instanceof Error ? error.message : 'Error inesperado';
      console.error('[IaEngine]', `Error en responderChat: ${reason}`);
      return generarChatFallbackLocal(
        litrosLeche,
        sueroEstimado,
        ricotaEstimada,
        pregunta,
        contextoChat,
      );
    }
  }

function normalizarChatGemini(
    parsed: Partial<ChatIAResponse>,
    modelo: string,
    litrosLeche: number,
    sueroEstimado: number,
    ricotaEstimada: number,
    pregunta: string,
    contextoChat: {
      tieneLitros: boolean;
      escala: EscalaLote;
      alternativaObjetivo?: AlternativaId;
      litrosAnteriores?: number;
      variacionLitros: VariacionLitros;
      tipoInteraccion: 'inicial' | 'cambio_litros' | 'pregunta';
      angulo: AnguloRespuesta;
      recetasPrevias: string[];
      alternativasPrevias: string[];
      semillaVariacion: number;
    },
  ): ChatIAResponse {
    if (!parsed.mensaje) {
      return generarChatFallbackLocal(
        litrosLeche,
        sueroEstimado,
        ricotaEstimada,
        pregunta,
        contextoChat,
      );
    }

    const alternativasNoAptaMuyBajo: ReadonlySet<AlternativaId> = new Set([
      'intercambio',
      'biogas',
      'secado_concentrado',
    ]);

    let alternativaSugerida =
      parsed.alternativaSugerida &&
      ALTERNATIVAS_VALIDAS.has(parsed.alternativaSugerida)
        ? parsed.alternativaSugerida
        : contextoChat.alternativaObjetivo;

    if (
      contextoChat.tieneLitros &&
      contextoChat.escala === 'muy_bajo' &&
      alternativaSugerida &&
      alternativasNoAptaMuyBajo.has(alternativaSugerida)
    ) {
      alternativaSugerida = 'panificados';
    }

    const pasosSimples = Array.isArray(parsed.pasosSimples)
      ? parsed.pasosSimples
          .slice(0, 3)
          .map((p) => limitarPalabras(p, 14))
          .filter(Boolean)
      : undefined;

    const sugerencias = Array.isArray(parsed.sugerenciasSeguimiento)
      ? parsed.sugerenciasSeguimiento
          .slice(0, 3)
          .map((s) => limpiarTexto(s, 80))
          .filter(Boolean)
      : [];

    const recetasValidas = Array.isArray(parsed.recetasSugeridas)
      ? Array.from(
          new Set(
            parsed.recetasSugeridas.filter((id) => RECETAS_VALIDAS.has(id)),
          ),
        ).slice(0, 3)
      : [];

    const recetasSugeridas =
      recetasValidas.length >= 2
        ? recetasValidas
        : seleccionarRecetasPorDefecto(
            contextoChat.tieneLitros ? sueroEstimado : 45,
            pregunta,
            contextoChat.recetasPrevias,
            contextoChat.semillaVariacion,
          );

    const sugerenciasRespaldo =
      contextoChat.tieneLitros && contextoChat.escala === 'muy_bajo'
        ? PREGUNTAS_MUY_BAJO.slice(0, 3)
        : PREGUNTAS_BASE.slice(0, 3);

    return {
      origen: modelo,
      mensaje: limitarPalabras(parsed.mensaje, 65),
      alternativaSugerida,
      tituloRecomendacion: parsed.tituloRecomendacion
        ? limitarPalabras(parsed.tituloRecomendacion, 7)
        : undefined,
      rendimientoSimple: parsed.rendimientoSimple
        ? limpiarTexto(parsed.rendimientoSimple, 80)
        : undefined,
      pasosSimples:
        pasosSimples && pasosSimples.length > 0 ? pasosSimples : undefined,
      consejoClave: parsed.consejoClave
        ? limpiarTexto(parsed.consejoClave, 110)
        : undefined,
      recetasSugeridas,
      sugerenciasSeguimiento:
        sugerencias.length >= 2 ? sugerencias : sugerenciasRespaldo,
    };
  }

function generarChatFallbackLocal(
    litrosLeche: number,
    sueroEstimado: number,
    ricotaEstimada: number,
    pregunta: string,
    contextoChat: {
      tieneLitros: boolean;
      escala: EscalaLote;
      alternativaObjetivo?: AlternativaId;
      litrosAnteriores?: number;
      variacionLitros: VariacionLitros;
      tipoInteraccion: 'inicial' | 'cambio_litros' | 'pregunta';
      angulo: AnguloRespuesta;
      recetasPrevias: string[];
      alternativasPrevias: string[];
      semillaVariacion: number;
    },
  ): ChatIAResponse {
    if (!contextoChat.tieneLitros) {
      const altId = contextoChat.alternativaObjetivo ?? 'panificados';
      const guia = GUIA_VIABILIDAD_SIN_LOTE[altId];
      if (contextoChat.alternativaObjetivo || !pregunta) {
        return {
          origen: 'motor-local',
          mensaje: guia.mensaje,
          alternativaSugerida: altId,
          tituloRecomendacion: guia.titulo,
          rendimientoSimple: guia.escala,
          pasosSimples: guia.pasos,
          consejoClave: guia.consejo,
          recetasSugeridas: guia.recetas,
          sugerenciasSeguimiento: [
            '¿Qué equipamiento mínimo necesito para empezar?',
            'Si tengo menos de 20 L de suero, ¿sigue conviniendo?',
            '¿Cómo conservo el suero fresco mientras lo proceso?',
          ],
        };
      }

      const referenciaSuero = 40;
      const referenciaRicota = 2.4;
      return generarChatFallbackLocal(
        45,
        referenciaSuero,
        referenciaRicota,
        pregunta,
        {
          ...contextoChat,
          tieneLitros: true,
          escala: 'medio',
        },
      );
    }
    const litrosTxt = formatearEnteroOUnDecimal(litrosLeche);
    const sueroTxt = formatearEnteroOUnDecimal(sueroEstimado);
    const ricotaTxt = formatearDecimal(ricotaEstimada);
    const prevTxt = contextoChat.litrosAnteriores
      ? formatearEnteroOUnDecimal(contextoChat.litrosAnteriores)
      : '';
    const s = contextoChat.semillaVariacion;
    const esMuyBajo = contextoChat.escala === 'muy_bajo';
    const recetas = seleccionarRecetasPorDefecto(
      sueroEstimado,
      pregunta,
      contextoChat.recetasPrevias,
      s,
    );
    const q = pregunta.toLowerCase();

    const notaCambio =
      contextoChat.tipoInteraccion === 'cambio_litros' && prevTxt
        ? contextoChat.variacionLitros === 'subio'
          ? `Al subir de ${prevTxt} L a ${litrosTxt} L de leche, ajusta el plan. `
          : `Al bajar de ${prevTxt} L a ${litrosTxt} L de leche, ajusta el plan. `
        : '';

    if (q) {
      if (
        q.includes('dura') ||
        q.includes('tiempo') ||
        q.includes('guardar') ||
        q.includes('conservar')
      ) {
        const variantes = [
          `A temperatura ambiente el suero se acidifica rápido: conviene usarlo dentro de las 3 a 4 horas posteriores al desuerado. Si necesitas estirarlo al día siguiente, refrigéralo bajo 4 °C en envase limpio cerrado.`,
          `No conviene acumular partidas de varios días, menos en volúmenes chicos. Úsalo fresco en el día o enfríalo por debajo de 4 °C antes de las 4 horas para aprovecharlo sin mal olor.`,
        ];
        return {
          origen: 'motor-local',
          mensaje: elegirVariante(variantes, s),
          alternativaSugerida: esMuyBajo ? 'panificados' : 'ricota',
          tituloRecomendacion: 'Frescura y Límite de Conservación',
          rendimientoSimple: 'Ventana óptima de 3–4 horas en fresco',
          pasosSimples: [
            'Mantén el recipiente tapado, limpio y fuera del sol directo.',
            'Si no lo procesas hoy, enfría rápido bajo 4 °C máximo 24 h.',
            'Descarta para cocina o animales si presenta olor agrio intenso.',
          ],
          consejoClave:
            'El suero fresco rinde mejor en cocina y reduce riesgos digestivos en animales.',
          recetasSugeridas: recetas,
          sugerenciasSeguimiento: esMuyBajo
            ? PREGUNTAS_MUY_BAJO.slice(0, 3)
            : PREGUNTAS_BASE.slice(0, 3),
        };
      }

      if (
        q.includes('vinagre') ||
        q.includes('ácido') ||
        q.includes('acido') ||
        q.includes('limón') ||
        q.includes('limon') ||
        q.includes('ricota') ||
        q.includes('paso a paso') ||
        q.includes('hacer')
      ) {
        const vinagreMl = Math.max(8, Math.round(sueroEstimado * 1.8));
        const acidoGr = +(sueroEstimado * 0.2).toFixed(1);

        if (esMuyBajo) {
          const variantesMuyBajo = [
            `Con unos ${sueroTxt} L orientativos de suero sacarías cerca de ${ricotaTxt} kg de ricota en olla chica. Si no quieres encender fuego para tan poco rinde, aprovéchalo directo en panificados o sopas.`,
            `Para ${sueroTxt} L en escala mínima usarías ~${vinagreMl} ml de vinagre y obtendrías ~${ricotaTxt} kg orientativos de ricota. Es viable en cocina doméstica, aunque reemplazar agua en masas rinde más práctico.`,
          ];
          return {
            origen: 'motor-local',
            mensaje: elegirVariante(variantesMuyBajo, s),
            alternativaSugerida: 'ricota',
            tituloRecomendacion: 'Ricota en Olla Chica o Uso Directo',
            rendimientoSimple: `~${ricotaTxt} kg orientativos o ${sueroTxt} L directo en cocina`,
            pasosSimples: [
              'Si eliges ricota, calienta en olla chica hasta 88 °C sin hervir.',
              `Agrega ${vinagreMl} ml de vinagre, reposa 10 minutos y cuela en lienzo.`,
              'Si prefieres evitar gas y tiempo, reemplaza agua en pan o pizza hoy.',
            ],
            consejoClave:
              'Usa suero dulce sin sal añadida y refrigera la ricota al instante.',
            recetasSugeridas: recetas,
            sugerenciasSeguimiento: [
              '¿Cómo diluyo estos pocos litros para huerta o macetas?',
              '¿Cuánto le puedo dar hoy a aves o cerdos sin excederme?',
              '¿Cuánto tiempo dura este suero sin enfriar?',
            ],
          };
        }

        const variantesRicota = [
          `Para trabajar ${sueroTxt} L orientativos de suero dulce calcula ~${vinagreMl} ml de vinagre blanco o ${formatearDecimal(acidoGr)} g de ácido cítrico disuelto en agua.`,
          `Si vas por ricota fresca con estos ${sueroTxt} L de suero, el corte suave pide cerca de ${vinagreMl} ml de vinagre (o ${formatearDecimal(acidoGr)} g de ácido cítrico) cerca de 88 °C.`,
          `En tu lote de ${sueroTxt} L orientativos puedes recuperar ~${ricotaTxt} kg de ricota usando ${vinagreMl} ml de vinagre o ${formatearDecimal(acidoGr)} g de ácido cítrico sin agitar brusco.`,
        ];
        return {
          origen: 'motor-local',
          mensaje: elegirVariante(variantesRicota, s),
          alternativaSugerida: 'ricota',
          tituloRecomendacion: 'Elaboración de Ricota Artesanal',
          rendimientoSimple: `~${ricotaTxt} kg orientativos de ricota fresca`,
          pasosSimples: [
            'Calienta el suero fresco a fuego suave hasta 88 °C sin hervir.',
            'Incorpora el acidificante despacio y deja reposar 10 minutos.',
            'Recoge la cuajada flotante, escurre en tela limpia y lleva a frío.',
          ],
          consejoClave:
            'Procesa dentro de las primeras 4 horas y mantén la ricota bajo 4 °C.',
          recetasSugeridas: recetas,
          sugerenciasSeguimiento: [
            '¿Qué hago con el líquido que sobra después de la ricota?',
            'No tengo fuego ni olla grande, ¿qué otra opción hay?',
            '¿Cómo se lo doy a los animales sin que les haga mal?',
          ],
        };
      }

      if (
        q.includes('fuego') ||
        q.includes('olla') ||
        q.includes('calor') ||
        q.includes('sin ') ||
        q.includes('otra opción') ||
        q.includes('otra opcion')
      ) {
        const mezclaTotal = Math.round(sueroEstimado * 3);
        const variantesSinFuego = esMuyBajo
          ? [
              `Sin fuego, estos ${sueroTxt} L orientativos se resuelven rápido en el día: amasado casero, ración animal moderada o riego diluido en huerta chica.`,
              `Al no tener olla ni quemador y tratarse de un volumen chico (${sueroTxt} L), evita acopiarlo: úsalo hoy en panadería o dilúyelo bien para suelo.`,
            ]
          : [
              `Sin fuego ni olla grande, destina los ${sueroTxt} L orientativos directamente en frío hoy mismo a masas, ración animal o riego diluido.`,
              `Para resolver estos ${sueroTxt} L sin cocción, repártelos en el día entre panadería artesanal, consumo animal gradual o riego diluido 1:2.`,
            ];
        return {
          origen: 'motor-local',
          mensaje: elegirVariante(variantesSinFuego, s),
          alternativaSugerida: 'panificados',
          tituloRecomendacion: 'Salidas Directas sin Cocción',
          rendimientoSimple: `${sueroTxt} L en uso directo o ${mezclaTotal} L diluidos`,
          pasosSimples: [
            'Separa suero limpio del día para reemplazar agua en pan o pizza.',
            'Ofrece fresco junto a ración seca si cuentas con animales en predio.',
            'Para huerta o pasto, diluye mínimo 1 parte de suero en 2 de agua.',
          ],
          consejoClave:
            'No dejes el recipiente al sol ni utilices suero con fermentación agria.',
          recetasSugeridas: recetas,
          sugerenciasSeguimiento: esMuyBajo
            ? [
                '¿Cómo diluyo estos pocos litros para huerta o macetas?',
                '¿Cuánto le puedo dar hoy a aves o cerdos sin excederme?',
                '¿Cuánto tiempo dura este suero sin enfriar?',
              ]
            : [
                '¿Cómo se lo doy a los animales sin que les haga mal?',
                '¿Cómo lo uso para regar la huerta o pastura?',
                '¿Cuánto tiempo dura este suero sin enfriar?',
              ],
        };
      }

      if (
        q.includes('animal') ||
        q.includes('cerdo') ||
        q.includes('chancho') ||
        q.includes('vaca') ||
        q.includes('ternero') ||
        q.includes('ave') ||
        q.includes('gallina') ||
        q.includes('mal')
      ) {
        const variantesAnimal = esMuyBajo
          ? [
              `Al ser solo ${sueroTxt} L orientativos, alcanza como complemento puntual del día para pocas aves o cerdos, siempre fresco, en bebedero limpio y junto a alimento seco.`,
              `Con este volumen chico (${sueroTxt} L), intégralo de forma inmediata en la ración de hoy en dosis moderada; así evitas que fermente en el corral.`,
            ]
          : [
              `Estos ${sueroTxt} L orientativos sirven como aporte energético líquido para cerdos o bovinos si se introducen gradualmente y siempre con alimento seco.`,
              `Para aprovechar los ${sueroTxt} L en dieta animal sin trastornos digestivos, repártelos frescos del día acompañados de fibra, grano y agua limpia aparte.`,
            ];
        return {
          origen: 'motor-local',
          mensaje: elegirVariante(variantesAnimal, s),
          alternativaSugerida: 'animal',
          tituloRecomendacion: 'Uso Seguro en Ración Animal',
          rendimientoSimple: `${sueroTxt} L orientativos de suplemento fresco`,
          pasosSimples: [
            'Introduce de a poco los primeros días para evitar diarreas.',
            'Entrega suero del día junto con pasto, grano o balanceado seco.',
            'Lava los comederos diariamente y deja agua limpia siempre disponible.',
          ],
          consejoClave:
            'Descarta suero viejo, con espuma o muy salado y valida según especie.',
          recetasSugeridas: recetas,
          sugerenciasSeguimiento: esMuyBajo
            ? [
                '¿Cómo diluyo estos pocos litros para huerta o macetas?',
                '¿Conviene hacer ricota con tan poco suero o mejor panificados?',
                '¿Cuánto tiempo dura este suero sin enfriar?',
              ]
            : [
                '¿Cómo lo uso para regar la huerta o pastura?',
                '¿Cómo hago la ricota paso a paso?',
                '¿Cuánto tiempo dura este suero sin enfriar?',
              ],
        };
      }

      if (
        q.includes('huerta') ||
        q.includes('maceta') ||
        q.includes('regar') ||
        q.includes('riego') ||
        q.includes('pasto') ||
        q.includes('pastura') ||
        q.includes('suelo') ||
        q.includes('compost') ||
        q.includes('sobra')
      ) {
        const factorAgua = esMuyBajo ? 3 : 2;
        const aguaLitros = Math.max(1, Math.round(sueroEstimado * factorAgua));
        const mezclaTotal = Math.round(sueroEstimado + aguaLitros);
        const variantesRiego = esMuyBajo
          ? [
              `En partida chica (${sueroTxt} L orientativos), diluye 1 parte de suero en ${factorAgua} de agua (${aguaLitros} L de agua) para huerta o compost sin quemar raíces ni salinizar.`,
              `Para aplicar ${sueroTxt} L en suelo o compostera sin riesgos, llévalo a unos ${mezclaTotal} L diluidos y verifica que el suero no tenga sal agregada.`,
            ]
          : [
              `Antes de aplicar ${sueroTxt} L orientativos en suelo o pastura, dilúyelo con ${aguaLitros} L de agua (1:2) para evitar acidez brusca o quema foliar.`,
              `La clave con ${sueroTxt} L en riego o compost es bajar su concentración mezclándolo con ${aguaLitros} L de agua limpia y repartirlo sobre suelo aireado.`,
            ];
        return {
          origen: 'motor-local',
          mensaje: elegirVariante(variantesRiego, s),
          alternativaSugerida: 'agricola',
          tituloRecomendacion: 'Riego Muy Diluido y Compostaje',
          rendimientoSimple: `~${mezclaTotal} L orientativos de mezcla diluida`,
          pasosSimples: [
            `Mezcla 1 parte de suero sin sal con ${factorAgua} partes de agua limpia.`,
            'Aplica en la base de pastura, suelo o pila de compost con hojas secas.',
            'Evita regar suelos encharcados, plántulas tiernas o días de lluvia.',
          ],
          consejoClave:
            'Aplica lejos de pozos, arroyos o acequias y evita suero de quesos muy salados.',
          recetasSugeridas: recetas,
          sugerenciasSeguimiento: esMuyBajo
            ? [
                '¿Cuánto le puedo dar hoy a aves o cerdos sin excederme?',
                '¿Conviene hacer ricota con tan poco suero o mejor panificados?',
                '¿Cuánto tiempo dura este suero sin enfriar?',
              ]
            : [
                '¿Cómo hago la ricota paso a paso?',
                '¿Cómo se lo doy a los animales sin que les haga mal?',
                '¿Cuánto tiempo dura este suero sin enfriar?',
              ],
        };
      }

      const variantesConsultaLibre = esMuyBajo
        ? [
            `Para estos ${sueroTxt} L orientativos (${litrosTxt} L de leche), al ser una escala mínima conviene salida inmediata en panificados, ración fresca o riego bien diluido.`,
            `Como ${sueroTxt} L es una partida chica, no justifica acopio ni retiro compartido: aprovecha las recetas sugeridas abajo o úsalo hoy en granja o huerta.`,
          ]
        : [
            `Tomando tus ${sueroTxt} L orientativos de suero, puedes orientar la tanda a ricota (~${ricotaTxt} kg), panadería o uso agropecuario según los recursos del día.`,
            `Para resolver tu consulta con ${litrosTxt} L de leche (~${sueroTxt} L de suero), define primero si dispones de fuego o si prefieres salida directa en frío.`,
          ];
      return {
        origen: 'motor-local',
        mensaje: elegirVariante(variantesConsultaLibre, s),
        alternativaSugerida:
          esMuyBajo || sueroEstimado < UMBRAL_SUERO_BAJO
            ? 'panificados'
            : sueroEstimado <= UMBRAL_SUERO_MEDIO
              ? 'ricota'
              : 'intercambio',
        tituloRecomendacion: esMuyBajo
          ? 'Salidas Prácticas a Escala Mínima'
          : 'Opciones Prácticas para tu Lote',
        rendimientoSimple: `${sueroTxt} L orientativos aprovechables hoy`,
        pasosSimples: esMuyBajo
          ? [
              'Úsalo hoy mismo en cocina casera, ración animal o riego diluido 1:3.',
              'Evita acumular el suero de un día para otro a temperatura ambiente.',
              'Abre las recetas recomendadas abajo para aprovecharlo sin desperdicio.',
            ]
          : [
              'Define si trabajarás con calor (ricota/dulce) o en frío.',
              'Actúa antes de 4 horas para mantener acidez controlada.',
              'Revisa las recetas sugeridas abajo según lo que quieras elaborar.',
            ],
        consejoClave:
          'Los volúmenes son orientativos; prioriza siempre higiene y suero fresco del día.',
        recetasSugeridas: recetas,
        sugerenciasSeguimiento: esMuyBajo
          ? PREGUNTAS_MUY_BAJO.slice(0, 3)
          : PREGUNTAS_BASE.slice(0, 3),
      };
    }

    if (esMuyBajo) {
      const mensajesMuyBajo = [
        `${notaCambio}Al ser una partida chica (~${sueroTxt} L orientativos de suero), no justifica procesos de mayor escala ni acopio. Lo más práctico es aprovecharlo hoy en cocina, ración animal o riego diluido.`,
        `${notaCambio}Este volumen estimado (${sueroTxt} L de suero para ${litrosTxt} L de leche) corresponde a una escala mínima o de prueba: conviene darle salida directa en el día sin acumular ni complicar logística.`,
        `${notaCambio}Con apenas ~${sueroTxt} L orientativos de suero te conviene ir directo a uso casero puntual (panificados o sopa), complemento fresco para animales o mezcla muy diluida en huerta.`,
      ];
      const titulosMuyBajo = [
        'Uso Inmediato en Escala Mínima',
        'Salida Práctica para Partida Chica',
        'Aprovechamiento Directo en el Día',
      ];
      return {
        origen: 'motor-local',
        mensaje: elegirVariante(mensajesMuyBajo, s),
        alternativaSugerida:
          contextoChat.angulo === 'precaucion_manejo' ? 'agricola' : 'panificados',
        tituloRecomendacion: elegirVariante(titulosMuyBajo, s),
        rendimientoSimple: `~${sueroTxt} L orientativos (escala mínima)`,
        pasosSimples: [
          'En cocina: sustituye agua en masas de pan, pizza o sopas crema hoy mismo.',
          'En animales: ofrece fresco del día en dosis moderada junto a ración seca.',
          'En huerta: diluye 1 parte de suero sin sal en 3 de agua lejos de pozos.',
        ],
        consejoClave:
          'Cifras orientativas: no acopies por varios días ni viertas concentrado al suelo.',
        recetasSugeridas: recetas,
        sugerenciasSeguimiento: rotarSinRepetir(
          PREGUNTAS_MUY_BAJO,
          new Set(),
          s,
        ),
      };
    }

    if (sueroEstimado < UMBRAL_SUERO_BAJO) {
      const mensajesBajo = [
        `${notaCambio}En esta escala chica (~${sueroTxt} L orientativos de suero), el calentamiento largo para ricota (~${ricotaTxt} kg) rinde justo; suele convenir más panadería artesanal, dulce de suero o uso animal directo.`,
        `${notaCambio}Tienes unos ${sueroTxt} L orientativos de suero. Es un lote manejable en el día mediante panificados, bebida láctea casera o suplementación animal controlada.`,
        `${notaCambio}Para ~${sueroTxt} L de suero la clave es la agilidad: reemplaza líquido en panificados, prepara dulce de suero en olla o repártelo fresco en granja.`,
      ];
      return {
        origen: 'motor-local',
        mensaje: elegirVariante(mensajesBajo, s),
        alternativaSugerida:
          contextoChat.angulo === 'receta_destacada' ? 'dulce_suero' : 'panificados',
        tituloRecomendacion: elegirVariante(
          [
            'Panificados, Dulce o Uso en Granja',
            'Valorización Ágil en Lote Chico',
          ],
          s,
        ),
        rendimientoSimple: `~${sueroTxt} L orientativos listos para hoy`,
        pasosSimples: [
          'Destina parte del suero dulce del día a pan casero, focaccia o dulce.',
          'Si tienes cerdos o aves, entrega el sobrante fresco junto a grano.',
          'Si riegas pastura, diluye 1:2 en agua limpia lejos de cursos de agua.',
        ],
        consejoClave:
          'Procesa dentro de las 4 horas; valores orientativos según acidez y sal.',
        recetasSugeridas: recetas,
        sugerenciasSeguimiento: [
          '¿Cómo se lo doy a los animales sin que les haga mal?',
          '¿Cómo lo uso para regar la huerta o pastura?',
          '¿Cómo hago la ricota paso a paso?',
        ],
      };
    }

    if (sueroEstimado <= UMBRAL_SUERO_MEDIO) {
      const mensajesMedio = [
        `${notaCambio}En este rango (~${sueroTxt} L orientativos de suero) ya rinde encender fuego: puedes recuperar ~${ricotaTxt} kg de ricota fresca y derivar el permeado sobrante a suelo o animales.`,
        `${notaCambio}Con ~${sueroTxt} L orientativos de suero entras en la escala artesanal ideal para ricota o requesón untable, logrando producto vendible en el mismo día.`,
        `${notaCambio}Si trabajas ${litrosTxt} L de leche (~${sueroTxt} L orientativos de suero), compara dos salidas: hacer ~${ricotaTxt} kg de ricota ahora o combinar dulce de suero y panificados.`,
      ];
      return {
        origen: 'motor-local',
        mensaje: elegirVariante(mensajesMedio, s),
        alternativaSugerida: 'ricota',
        tituloRecomendacion: elegirVariante(
          [
            'Ricota Artesanal y Permeado Útil',
            'Valorización Láctea en Escala Media',
            'Producción de Ricota del Día',
          ],
          s,
        ),
        rendimientoSimple: `~${ricotaTxt} kg orientativos de ricota fresca`,
        pasosSimples: [
          'Calienta el suero fresco a fuego suave hasta 88 °C sin que hierva.',
          'Acidifica despacio con vinagre o ácido cítrico para precipitar proteína.',
          'Escurre en tela limpia, lleva bajo 4 °C y aprovecha el líquido tibio.',
        ],
        consejoClave:
          'Cuida la higiene de telas y enfría rápido bajo 4 °C para buena vida útil.',
        recetasSugeridas: recetas,
        sugerenciasSeguimiento: rotarSinRepetir(PREGUNTAS_BASE, new Set(), s),
      };
    }

    const mensajesAlto = [
      `${notaCambio}Al superar los ${UMBRAL_SUERO_MEDIO} L (~${sueroTxt} L orientativos de suero), conviene dividir el lote: elabora ricota con lo que puedas enfriar y coordina retiro diario vecinal con el resto.`,
      `${notaCambio}Es un volumen alto (~${sueroTxt} L orientativos): ninguna cocina sola absorbe todo, así que combina elaboración de ricota (~${ricotaTxt} kg) con entrega programada a granjas o tambos.`,
      `${notaCambio}Para manejar ~${sueroTxt} L orientativos sin saturar desagües, planifica una fracción en ricota/dulce y otra en tanques limpios para retiro diario o biodigestión.`,
    ];
    return {
      origen: 'motor-local',
      mensaje: elegirVariante(mensajesAlto, s),
      alternativaSugerida: 'intercambio',
      tituloRecomendacion: elegirVariante(
        [
          'Ricota + Retiro Vecinal Programado',
          'Gestión Dividida de Alto Volumen',
        ],
        s,
      ),
      rendimientoSimple: `~${ricotaTxt} kg ricota o ${sueroTxt} L para entrega`,
      pasosSimples: [
        'Procesa en ricota o dulce de suero la fracción con capacidad de frío.',
        'Almacena el resto en tanque cerrado limpio bajo sombra por máximo 24 h.',
        'Acuerda retiros diarios con criadores de cerdos o productores cercanos.',
      ],
      consejoClave:
        'Evita acumular más de un día sin frío para prevenir olores y acidez excesiva.',
      recetasSugeridas: recetas,
      sugerenciasSeguimiento: rotarSinRepetir(PREGUNTAS_BASE, new Set(), s),
    };
  }

function normalizarRespuestaGemini(
    parsed: Partial<RecomendacionIAResponse>,
    modelo: string,
    sueroEstimado: number,
    contexto: string[],
  ): RecomendacionIAResponse {
    if (
      !parsed.alternativaId ||
      !ALTERNATIVAS_VALIDAS.has(parsed.alternativaId) ||
      !parsed.titulo ||
      !parsed.justificacion ||
      !parsed.rendimientoSecundario ||
      !parsed.precaucionClave ||
      !Array.isArray(parsed.pasosAccion) ||
      parsed.pasosAccion.length < 3
    ) {
      return generarFallbackLocal(sueroEstimado, contexto);
    }

    const escala = clasificarEscalaSuero(sueroEstimado);
    const noAptasMuyBajo: ReadonlySet<AlternativaId> = new Set([
      'intercambio',
      'biogas',
      'secado_concentrado',
    ]);
    if (escala === 'muy_bajo' && noAptasMuyBajo.has(parsed.alternativaId)) {
      return generarFallbackLocal(sueroEstimado, contexto);
    }

    const viabilidad =
      parsed.viabilidad && VIABILIDADES_VALIDAS.has(parsed.viabilidad)
        ? parsed.viabilidad
        : 'Alta';

    return {
      origen: modelo,
      alternativaId: parsed.alternativaId,
      titulo: limitarPalabras(parsed.titulo, 7),
      viabilidad,
      rendimientoSecundario: limpiarTexto(parsed.rendimientoSecundario, 60),
      justificacion: limpiarTexto(parsed.justificacion, 140),
      pasosAccion: [
        limitarPalabras(parsed.pasosAccion[0], 10),
        limitarPalabras(parsed.pasosAccion[1], 10),
        limitarPalabras(parsed.pasosAccion[2], 10),
      ],
      precaucionClave: limpiarTexto(parsed.precaucionClave, 90),
    };
  }

function generarFallbackLocal(
    sueroEstimado: number,
    contexto: string[],
  ): RecomendacionIAResponse {
    const tieneCalor = contexto.includes('fuente_termica');
    const tieneHuerta = contexto.includes('huerta_propia');
    const tieneCria = contexto.includes('cria_animal');
    const tieneRed = contexto.includes('red_tambos');

    if (sueroEstimado < UMBRAL_SUERO_MUY_BAJO) {
      if (tieneCria && !tieneHuerta) {
        return {
          origen: 'motor-local',
          alternativaId: 'animal',
          titulo: 'Uso inmediato en ración animal controlada',
          viabilidad: 'Alta',
          rendimientoSecundario: `~${formatearDecimal(sueroEstimado)} L orientativos frescos`,
          justificacion:
            'Volumen muy bajo sin justificación de acopio; ideal como complemento fresco del día en dieta animal.',
          pasosAccion: [
            'Separar suero dulce fresco del mismo día',
            'Entregar dosis moderada junto a ración seca',
            'Lavar bebederos al terminar y no acumular',
          ],
          precaucionClave:
            'Valores orientativos; descartar suero fermentado y validar por especie.',
        };
      }
      if (tieneHuerta) {
        const mezclaRiego = Math.max(1, Math.round(sueroEstimado * 4));
        return {
          origen: 'motor-local',
          alternativaId: 'agricola',
          titulo: 'Riego muy diluido o compost en partida chica',
          viabilidad: 'Alta',
          rendimientoSecundario: `~${mezclaRiego} L orientativos de mezcla 1:3`,
          justificacion:
            'A escala mínima conviene diluir al 1:3 en el día para huerta o compost sin almacenar.',
          pasosAccion: [
            'Diluir 1 parte de suero sin sal en 3 de agua',
            'Aplicar en suelo aireado o pila seca de compost',
            'Mantener distancia segura de pozos y acequias',
          ],
          precaucionClave:
            'Evitar suero de quesos salados y no regar suelos saturados.',
        };
      }
      return {
        origen: 'motor-local',
        alternativaId: 'panificados',
        titulo: 'Aprovechamiento directo en cocina casera',
        viabilidad: 'Alta',
        rendimientoSecundario: `~${formatearDecimal(sueroEstimado)} L orientativos para hoy`,
        justificacion:
          'Partida reducida donde no conviene acopio ni escala industrial; rinde mejor en masas o sopas del día.',
        pasosAccion: [
          'Usar suero tibio del día en lugar de agua',
          'Ajustar sal de la receta según el queso elaborado',
          'Consumir o refrigerar bajo 4 °C antes de 4 horas',
        ],
        precaucionClave:
          'Cifras orientativas; utilizar únicamente suero fresco e higiénico.',
      };
    }

    if (
      (sueroEstimado >= 30 && tieneCalor) ||
      (sueroEstimado >= 30 && sueroEstimado <= 150 && contexto.length === 0)
    ) {
      const ricotaKg = +(sueroEstimado * 0.06).toFixed(1);
      const permeadoL = Math.max(1, Math.round(sueroEstimado * 0.94));
      return {
        origen: 'motor-local',
        alternativaId: 'ricota',
        titulo: 'Elaboración artesanal de ricota fresca',
        viabilidad: tieneCalor ? 'Óptima' : 'Alta',
        rendimientoSecundario: `~${formatearDecimal(ricotaKg)} kg ricota + ${permeadoL} L permeado`,
        justificacion:
          'Volumen apto para precipitar proteínas séricas entre 85 y 90 °C con alto valor comercial.',
        pasosAccion: [
          'Filtrar suero dulce fresco antes de cuatro horas',
          'Calentar a 88 °C y acidificar suavemente sin agitar',
          'Escurrir en moldes sanitizados y refrigerar bajo 4 °C',
        ],
        precaucionClave:
          'Mantener cadena de frío e higiene estricta en tina y telas.',
      };
    }

    if (sueroEstimado > 150 && (tieneRed || !tieneCalor)) {
      const retirosL = Math.round(sueroEstimado);
      return {
        origen: 'motor-local',
        alternativaId: 'intercambio',
        titulo: 'Intercambio programado entre productores locales',
        viabilidad: tieneRed ? 'Óptima' : 'Alta',
        rendimientoSecundario: `~${retirosL} L diarios para red productiva`,
        justificacion:
          'El excedente diario supera la escala artesanal y conviene derivarlo mediante retiro asociado.',
        pasosAccion: [
          'Almacenar el suero fresco en tanque cerrado limpio',
          'Coordinar retiro diario con granjas o tambos vecinos',
          'Registrar volumen entregado y horario en remito interno',
        ],
        precaucionClave:
          'Evitar almacenamiento prolongado sin refrigeración por acidificación rápida.',
      };
    }

    if (tieneCria || (sueroEstimado < 30 && !tieneHuerta)) {
      return {
        origen: 'motor-local',
        alternativaId: 'animal',
        titulo: 'Suplementación líquida controlada en dieta animal',
        viabilidad: tieneCria ? 'Óptima' : 'Moderada',
        rendimientoSecundario: `${formatearDecimal(sueroEstimado)} L de suplemento energético`,
        justificacion:
          'A baja escala evita gasto térmico de ricota y aporta lactosa y minerales al ganado.',
        pasosAccion: [
          'Separar suero fresco del día libre de contaminantes',
          'Dosificar ración gradual combinada con fibra seca',
          'Lavar bebederos diariamente tras finalizar el suministro',
        ],
        precaucionClave:
          'Descartar partidas fermentadas y validar dosis por especie.',
      };
    }

    const mezclaRiego = Math.round(sueroEstimado * 3);
    return {
      origen: 'motor-local',
      alternativaId: 'agricola',
      titulo: 'Enmienda orgánica diluida en suelo propio',
      viabilidad: tieneHuerta ? 'Óptima' : 'Moderada',
      rendimientoSecundario: `~${mezclaRiego} L de mezcla diluida para riego`,
      justificacion:
        'Diluyendo el suero se aportan minerales al suelo o compost sin requerir energía térmica.',
      pasosAccion: [
        'Diluir una parte de suero en dos de agua',
        'Verificar pH neutro de mezcla antes de aplicar',
        'Distribuir en compost o pastura lejos de napas',
      ],
      precaucionClave:
        'No aplicar sobre suelos saturados ni cerca de cursos de agua.',
    };
  }

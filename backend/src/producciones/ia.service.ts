import { Injectable, Logger } from '@nestjs/common';
import { ChatProduccionDto } from './dto/chat-produccion.dto';
import { RecomendarProduccionDto } from './dto/recomendar-produccion.dto';

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

const SYSTEM_INSTRUCTION =
  'Eres el motor experto de Queso Circular IA, especialista en ingeniería láctea y economía circular para pequeños productores queseros. ' +
  'A partir de los litros de leche, queso estimado (12%), lactosuero residual (88%) y los recursos disponibles del productor, ' +
  'devuelve EXCLUSIVAMENTE un objeto JSON válido con la mejor estrategia de valorización del lactosuero. ' +
  'Prohibido usar emojis. Respeta estrictamente la longitud máxima de cada campo.';

const CATALOGO_RECETAS_IA = [
  { id: 'ricota-casera-tradicional', titulo: 'Ricota Fresca Artesanal', uso: 'suero >= 10 L' },
  { id: 'noquis-de-ricota-suaves', titulo: 'Ñoquis Caseros de Ricota', uso: 'pasta con ricota' },
  { id: 'tarta-frola-ricota', titulo: 'Tarta Húmeda de Ricota, Limón y Canela', uso: 'postre con ricota' },
  { id: 'pan-casero-lactosuero', titulo: 'Pan Artesanal con Lactosuero', uso: 'suero directo en panadería' },
  { id: 'focaccia-suero-romero', titulo: 'Focaccia de Suero y Romero', uso: 'panificado con suero' },
  { id: 'canelones-espinaca-ricota', titulo: 'Canelones de Espinaca y Ricota', uso: 'plato relleno con ricota' },
  { id: 'budin-citrico-ricota', titulo: 'Budín Húmedo de Ricota y Limón', uso: 'repostería con ricota' },
  { id: 'requeson-untable-hierbas', titulo: 'Requesón Cremoso Untable', uso: 'valor agregado con ricota' },
  { id: 'dulce-de-suero-artesanal', titulo: 'Dulce de Suero Caramelizado', uso: 'aprovechamiento directo de suero dulce' },
  { id: 'masa-pizza-suero', titulo: 'Masa Crujiente de Pizza con Suero', uso: 'volumen bajo de suero' },
  { id: 'flan-cremoso-ricota', titulo: 'Flan Casero de Ricota y Caramelo', uso: 'postre tradicional' },
  { id: 'ravioles-ricota-espinaca', titulo: 'Ravioles de Ricota y Espinaca', uso: 'pasta rellena' },
  { id: 'sopa-crema-calabaza-suero', titulo: 'Sopa Crema de Calabaza y Suero', uso: 'volumen bajo de suero' },
  { id: 'salsa-cremosa-ricota-pasta', titulo: 'Salsa Cremosa de Ricota', uso: 'salsa rápida con ricota' },
] as const;

const RECETAS_VALIDAS: ReadonlySet<string> = new Set(
  CATALOGO_RECETAS_IA.map((r) => r.id),
);
const RECETAS_ENUM: string[] = Array.from(RECETAS_VALIDAS);

const CHAT_SYSTEM_INSTRUCTION =
  'Eres el asistente cercano y práctico de Queso Circular IA para pequeños productores queseros. ' +
  'Responde directamente la pregunta concreta del usuario en español cotidiano, claro y sin tecnicismos académicos. ' +
  'Usa siempre los valores exactos de litrosLeche (12% queso en kg, 88% suero en litros; para ricota ~6% del volumen de suero, nunca del total de leche). ' +
  'Prohibido usar emojis. Sé conciso (máximo 55 palabras en "mensaje") y devuelve 3 preguntas sugeridas cortas de seguimiento. ' +
  'Siempre selecciona 2 o 3 IDs exactos del catálogo recetasDisponibles en "recetasSugeridas" que mejor se adapten al volumen de suero o consulta culinaria. ' +
  'Incluye tituloRecomendacion, rendimientoSimple, pasosSimples (3 pasos cortos) y consejoClave cuando ayude a ejecutar una acción práctica.';

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

function limpiarTexto(texto: string, maxLen: number): string {
  const sinEmojis = texto
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (sinEmojis.length <= maxLen) return sinEmojis;
  return `${sinEmojis.slice(0, maxLen - 1).trimEnd()}.`;
}

function limitarPalabras(texto: string, maxPalabras: number): string {
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

function seleccionarRecetasPorDefecto(
  sueroEstimado: number,
  pregunta: string,
): string[] {
  const q = pregunta.toLowerCase();
  if (
    q.includes('pasta') ||
    q.includes('ñoqui') ||
    q.includes('canelon') ||
    q.includes('raviol')
  ) {
    return [
      'noquis-de-ricota-suaves',
      'ravioles-ricota-espinaca',
      'salsa-cremosa-ricota-pasta',
    ];
  }
  if (q.includes('postre') || q.includes('dulce') || q.includes('tarta') || q.includes('flan')) {
    return [
      'tarta-frola-ricota',
      'flan-cremoso-ricota',
      'dulce-de-suero-artesanal',
    ];
  }
  if (q.includes('pan') || q.includes('pizza') || q.includes('masa') || q.includes('fuego')) {
    return [
      'pan-casero-lactosuero',
      'focaccia-suero-romero',
      'masa-pizza-suero',
    ];
  }
  if (sueroEstimado < 30) {
    return [
      'pan-casero-lactosuero',
      'masa-pizza-suero',
      'sopa-crema-calabaza-suero',
    ];
  }
  if (sueroEstimado <= 150) {
    return [
      'ricota-casera-tradicional',
      'tarta-frola-ricota',
      'noquis-de-ricota-suaves',
    ];
  }
  return [
    'ricota-casera-tradicional',
    'dulce-de-suero-artesanal',
    'requeson-untable-hierbas',
  ];
}

@Injectable()
export class IaService {
  private readonly logger = new Logger(IaService.name);

  private obtenerModelosCandidatos(): string[] {
    const personalizado = process.env.GEMINI_MODEL?.trim();
    if (!personalizado) return GEMINI_MODELOS_RESPALDO;
    return [
      personalizado,
      ...GEMINI_MODELOS_RESPALDO.filter((m) => m !== personalizado),
    ];
  }

  private async llamarGeminiConRespaldo(
    apiKey: string,
    payload: Record<string, unknown>,
  ): Promise<{ modelo: string; rawText: string } | null> {
    const modelos = this.obtenerModelosCandidatos();

    for (const modelo of modelos) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

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
          this.logger.warn(
            `Modelo ${modelo} devolvió estado ${response.status}.`,
          );
          continue;
        }

        const data = (await response.json()) as GeminiGenerateResponse;
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          return { modelo, rawText };
        }
      } catch (error) {
        const reason = error instanceof Error ? error.message : 'Error de red';
        this.logger.warn(`Fallo llamando a ${modelo}: ${reason}`);
      } finally {
        clearTimeout(timeoutId);
      }
    }

    return null;
  }

  async generarRecomendacion(
    dto: RecomendarProduccionDto,
  ): Promise<RecomendacionIAResponse> {
    const quesoEstimado = +(dto.litrosLeche * 0.12).toFixed(2);
    const sueroEstimado = +(dto.litrosLeche * 0.88).toFixed(2);
    const contexto = Array.isArray(dto.contexto)
      ? dto.contexto.map((item) => item.trim()).filter(Boolean)
      : [];

    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey || apiKey === 'tu_api_key_de_google_ai_studio') {
      return this.generarFallbackLocal(sueroEstimado, contexto);
    }

    const contextoLegible =
      contexto.length > 0
        ? contexto.map((key) => CONTEXTO_DESCRIPCION[key] ?? key)
        : ['Sin recursos especificados'];

    const resultado = await this.llamarGeminiConRespaldo(apiKey, {
      systemInstruction: {
        parts: [{ text: SYSTEM_INSTRUCTION }],
      },
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: JSON.stringify({
                litrosLeche: dto.litrosLeche,
                quesoEstimadoKg: quesoEstimado,
                sueroEstimadoLitros: sueroEstimado,
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
        temperature: 0.25,
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
      return this.generarFallbackLocal(sueroEstimado, contexto);
    }

    try {
      const parsed = JSON.parse(
        resultado.rawText,
      ) as Partial<RecomendacionIAResponse>;
      return this.normalizarRespuestaGemini(
        parsed,
        resultado.modelo,
        sueroEstimado,
        contexto,
      );
    } catch {
      return this.generarFallbackLocal(sueroEstimado, contexto);
    }
  }

  async responderChat(dto: ChatProduccionDto): Promise<ChatIAResponse> {
    const quesoEstimado = +(dto.litrosLeche * 0.12).toFixed(2);
    const sueroEstimado = +(dto.litrosLeche * 0.88).toFixed(2);
    const ricotaEstimada = +(sueroEstimado * 0.06).toFixed(1);
    const pregunta = dto.preguntaUsuario?.trim() || '';
    const historialReciente = Array.isArray(dto.historial)
      ? dto.historial.slice(-6)
      : [];

    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey || apiKey === 'tu_api_key_de_google_ai_studio') {
      return this.generarChatFallbackLocal(
        dto.litrosLeche,
        sueroEstimado,
        ricotaEstimada,
        pregunta,
      );
    }

    const contents: Array<{
      role: 'user' | 'model';
      parts: Array<{ text: string }>;
    }> = historialReciente.map((item) => ({
      role: item.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: item.texto }],
    }));

    contents.push({
      role: 'user',
      parts: [
        {
          text: JSON.stringify({
            contextoLoteActual: {
              litrosLeche: dto.litrosLeche,
              quesoEstimadoKg: quesoEstimado,
              sueroEstimadoLitros: sueroEstimado,
              ricotaPotencialKg: ricotaEstimada,
            },
            recetasDisponibles: CATALOGO_RECETAS_IA,
            consultaProductor:
              pregunta ||
              'Dame la recomendación principal según estos litros de suero y sugiere 2 o 3 recetas ideales.',
          }),
        },
      ],
    });

    const resultado = await this.llamarGeminiConRespaldo(apiKey, {
      systemInstruction: {
        parts: [{ text: CHAT_SYSTEM_INSTRUCTION }],
      },
      contents,
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.35,
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
      this.logger.warn(
        'Ningún modelo Gemini disponible respondió; usando motor-local.',
      );
      return this.generarChatFallbackLocal(
        dto.litrosLeche,
        sueroEstimado,
        ricotaEstimada,
        pregunta,
      );
    }

    try {
      const parsed = JSON.parse(resultado.rawText) as Partial<ChatIAResponse>;
      return this.normalizarChatGemini(
        parsed,
        resultado.modelo,
        dto.litrosLeche,
        sueroEstimado,
        ricotaEstimada,
        pregunta,
      );
    } catch {
      return this.generarChatFallbackLocal(
        dto.litrosLeche,
        sueroEstimado,
        ricotaEstimada,
        pregunta,
      );
    }
  }

  private normalizarChatGemini(
    parsed: Partial<ChatIAResponse>,
    modelo: string,
    litrosLeche: number,
    sueroEstimado: number,
    ricotaEstimada: number,
    pregunta: string,
  ): ChatIAResponse {
    if (!parsed.mensaje) {
      return this.generarChatFallbackLocal(
        litrosLeche,
        sueroEstimado,
        ricotaEstimada,
        pregunta,
      );
    }

    const alternativaSugerida =
      parsed.alternativaSugerida &&
      ALTERNATIVAS_VALIDAS.has(parsed.alternativaSugerida)
        ? parsed.alternativaSugerida
        : undefined;

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
        : seleccionarRecetasPorDefecto(sueroEstimado, pregunta);

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
        sugerencias.length >= 2 ? sugerencias : PREGUNTAS_BASE.slice(0, 3),
    };
  }

  private generarChatFallbackLocal(
    litrosLeche: number,
    sueroEstimado: number,
    ricotaEstimada: number,
    pregunta: string,
  ): ChatIAResponse {
    const litrosTxt = formatearEnteroOUnDecimal(litrosLeche);
    const sueroTxt = formatearEnteroOUnDecimal(sueroEstimado);
    const ricotaTxt = formatearDecimal(ricotaEstimada);
    const q = pregunta.toLowerCase();

    if (q) {
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
        const vinagreMl = Math.max(10, Math.round(sueroEstimado * 1.8));
        const acidoGr = +(sueroEstimado * 0.2).toFixed(1);
        return {
          origen: 'motor-local',
          mensaje: `Para estos ${sueroTxt} L de suero dulce necesitas unos ${vinagreMl} ml de vinagre blanco o ${formatearDecimal(acidoGr)} g de ácido cítrico disuelto en agua.`,
          alternativaSugerida: 'ricota',
          tituloRecomendacion: 'Hacer Ricota Artesanal',
          rendimientoSimple: `Puedes sacar unos ${ricotaTxt} kg de ricota fresca`,
          pasosSimples: [
            'Calienta el suero fresco a fuego suave hasta 88 °C sin hervir.',
            'Agrega el vinagre o ácido cítrico y deja reposar 10 minutos.',
            'Recoge la cuajada que flota y escúrrela en tela limpia.',
          ],
          consejoClave:
            'Usa el suero dentro de las primeras 4 horas y guarda la ricota en frío.',
          recetasSugeridas: [
            'ricota-casera-tradicional',
            'tarta-frola-ricota',
            'requeson-untable-hierbas',
          ],
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
        return {
          origen: 'motor-local',
          mensaje: `Si no tienes fuego ni olla grande para ricota, puedes usar los ${sueroTxt} L en panadería, animales o riego diluido en el mismo día.`,
          alternativaSugerida: 'panificados',
          tituloRecomendacion: 'Panificados, Animales o Riego en Frío',
          rendimientoSimple: `${sueroTxt} L para masas/bebida o ${mezclaTotal} L diluidos para riego`,
          pasosSimples: [
            'Separa unos litros para reemplazar agua en pan casero o pizza.',
            'Si tienes cerdos o vacas, dáselo fresco del día junto a ración seca.',
            'Para huerta o pasto, mezcla 1 parte de suero con 2 partes de agua.',
          ],
          consejoClave:
            'Nunca dejes el suero al sol ni lo uses si ya tomó olor agrio fuerte.',
          recetasSugeridas: [
            'pan-casero-lactosuero',
            'focaccia-suero-romero',
            'masa-pizza-suero',
          ],
          sugerenciasSeguimiento: [
            '¿Cómo se lo doy a los animales sin que les haga mal?',
            '¿Cómo lo uso para regar la huerta o pastura?',
            '¿Cómo coordino el retiro con otros productores?',
          ],
        };
      }

      if (
        q.includes('animal') ||
        q.includes('cerdo') ||
        q.includes('chancho') ||
        q.includes('vaca') ||
        q.includes('ternero') ||
        q.includes('mal')
      ) {
        return {
          origen: 'motor-local',
          mensaje: `Puedes darles estos ${sueroTxt} L de suero fresco a cerdos o vacas como complemento energético, siempre de a poco y acompañado de alimento seco.`,
          alternativaSugerida: 'animal',
          tituloRecomendacion: 'Suplementación Animal Segura',
          rendimientoSimple: `${sueroTxt} L de aporte líquido nutritivo en ración`,
          pasosSimples: [
            'Empieza con poca cantidad los primeros días para que se acostumbren.',
            'Sírvelo siempre fresco del día y mezclado o junto a pasto y grano.',
            'Lava muy bien los bebederos todos los días para evitar diarreas.',
          ],
          consejoClave:
            'Evita dar suero viejo o muy ácido y deja siempre agua limpia aparte.',
          recetasSugeridas: [
            'pan-casero-lactosuero',
            'sopa-crema-calabaza-suero',
          ],
          sugerenciasSeguimiento: [
            '¿Cómo lo uso para regar la huerta o pastura?',
            '¿Cómo hago la ricota paso a paso?',
            'No tengo animales ni fuego, ¿qué puedo hacer?',
          ],
        };
      }

      if (
        q.includes('huerta') ||
        q.includes('regar') ||
        q.includes('riego') ||
        q.includes('pasto') ||
        q.includes('pastura') ||
        q.includes('suelo') ||
        q.includes('compost') ||
        q.includes('sobra')
      ) {
        const aguaLitros = Math.round(sueroEstimado * 2);
        const mezclaTotal = Math.round(sueroEstimado * 3);
        return {
          origen: 'motor-local',
          mensaje: `Para regar pastura o huerta con ${sueroTxt} L de suero, siempre dilúyelo primero en ${aguaLitros} L de agua para no quemar las plantas.`,
          alternativaSugerida: 'agricola',
          tituloRecomendacion: 'Riego Diluido y Compostaje',
          rendimientoSimple: `Obtienes ${mezclaTotal} L de mezcla nutritiva lista para suelo`,
          pasosSimples: [
            'Mezcla 1 balde de suero por cada 2 baldes de agua limpia.',
            'Riega directo la base de pasturas o pilas de compost con hojas secas.',
            'No riegues si el suelo está encharcado o si va a llover fuerte.',
          ],
          consejoClave:
            'Mantente lejos de pozos de agua, arroyos o acequias para cuidar el ambiente.',
          recetasSugeridas: [
            'ricota-casera-tradicional',
            'pan-casero-lactosuero',
          ],
          sugerenciasSeguimiento: [
            '¿Cómo hago la ricota paso a paso?',
            '¿Cómo se lo doy a los animales sin que les haga mal?',
            '¿Cómo coordino el retiro con otros productores?',
          ],
        };
      }

      return {
        origen: 'motor-local',
        mensaje: `Con ${litrosTxt} L de leche generas ${sueroTxt} L de suero. Puedes hacer unos ${ricotaTxt} kg de ricota, panificados artesanales o suplementar animales.`,
        alternativaSugerida:
          sueroEstimado < 30
            ? 'panificados'
            : sueroEstimado <= 150
              ? 'ricota'
              : 'intercambio',
        tituloRecomendacion: 'Resumen de Opciones para tu Lote',
        rendimientoSimple: `${sueroTxt} L de suero aprovechables hoy`,
        pasosSimples: [
          'Define si tienes fuego disponible para recuperar ricota fresca.',
          'Si prefieres en frío, destínalo a panadería, animales o riego 1:2.',
          'Explora las recetas sugeridas abajo para darle salida directa.',
        ],
        consejoClave:
          'Actúa dentro de las primeras 4 horas mientras el suero sigue dulce y fresco.',
        recetasSugeridas: seleccionarRecetasPorDefecto(sueroEstimado, pregunta),
        sugerenciasSeguimiento: PREGUNTAS_BASE.slice(0, 3),
      };
    }

    if (sueroEstimado < 30) {
      return {
        origen: 'motor-local',
        mensaje: `Con ${litrosTxt} L de leche te quedan unos ${sueroTxt} L de suero. Por ser un volumen chico, tu mejor opción práctica es:`,
        alternativaSugerida: 'panificados',
        tituloRecomendacion: 'Panificados, Animales o Huerta',
        rendimientoSimple: `${sueroTxt} L listos para aprovechar en el día`,
        pasosSimples: [
          'Úsalo tibio en reemplazo del agua para amasar pan casero o pizzas.',
          'También puedes dárselo fresco del día a cerdos o aves junto con ración.',
          'Si sobra, diluye 1 parte de suero en 2 de agua para regar.',
        ],
        consejoClave:
          'En lotes chicos es ideal aprovechar el suero directo en cocina o granja.',
        recetasSugeridas: [
          'pan-casero-lactosuero',
          'masa-pizza-suero',
          'sopa-crema-calabaza-suero',
        ],
        sugerenciasSeguimiento: [
          '¿Cómo se lo doy a los animales sin que les haga mal?',
          '¿Cómo lo uso para regar la huerta o pastura?',
          '¿Cómo hago la ricota paso a paso?',
        ],
      };
    }

    if (sueroEstimado <= 150) {
      return {
        origen: 'motor-local',
        mensaje: `Con ${litrosTxt} L de leche te quedarán unos ${sueroTxt} L de suero. Por este volumen, tu mejor opción es:`,
        alternativaSugerida: 'ricota',
        tituloRecomendacion: 'Hacer Ricota Artesanal',
        rendimientoSimple: `Puedes sacar unos ${ricotaTxt} kg de ricota fresca`,
        pasosSimples: [
          'Calienta el suero fresco a fuego suave hasta 88 °C sin que hierva.',
          'Agrega un chorrito de vinagre o ácido cítrico para cortar las proteínas.',
          'Recoge la ricota con espumadera, escúrrela en tela y llévala a frío.',
        ],
        consejoClave:
          'Procesa el suero antes de 4 horas y conserva la ricota por debajo de 4 °C.',
        recetasSugeridas: [
          'ricota-casera-tradicional',
          'tarta-frola-ricota',
          'noquis-de-ricota-suaves',
        ],
        sugerenciasSeguimiento: [
          '¿Cómo hago la ricota paso a paso?',
          'No tengo fuego ni olla grande, ¿qué otra opción hay?',
          '¿Cómo lo uso para regar la huerta o pastura?',
        ],
      };
    }

    return {
      origen: 'motor-local',
      mensaje: `Con ${litrosTxt} L de leche tendrás unos ${sueroTxt} L de suero. Es un volumen grande que conviene dividir o entregar así:`,
      alternativaSugerida: 'intercambio',
      tituloRecomendacion: 'Ricota, Dulce e Intercambio Vecinal',
      rendimientoSimple: `Hasta ${ricotaTxt} kg de ricota o ${sueroTxt} L para retiro diario`,
      pasosSimples: [
        'Elabora ricota o dulce de suero con la parte que puedas procesar.',
        'Guarda el excedente en un tanque limpio y cerrado bajo techo.',
        'Coordina retiro diario con criadores de cerdos o productores vecinos.',
      ],
      consejoClave:
        'Asegura retiros diarios para que el suero no se acidifique ni genere olores.',
      recetasSugeridas: [
        'ricota-casera-tradicional',
        'dulce-de-suero-artesanal',
        'requeson-untable-hierbas',
      ],
      sugerenciasSeguimiento: [
        '¿Cómo hago la ricota paso a paso?',
        '¿Cómo se lo doy a los animales sin que les haga mal?',
        '¿Cómo lo uso para regar la huerta o pastura?',
      ],
    };
  }

  private normalizarRespuestaGemini(
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
      return this.generarFallbackLocal(sueroEstimado, contexto);
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

  private generarFallbackLocal(
    sueroEstimado: number,
    contexto: string[],
  ): RecomendacionIAResponse {
    const tieneCalor = contexto.includes('fuente_termica');
    const tieneHuerta = contexto.includes('huerta_propia');
    const tieneCria = contexto.includes('cria_animal');
    const tieneRed = contexto.includes('red_tambos');

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
}

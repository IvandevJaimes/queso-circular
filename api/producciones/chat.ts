import {
  type ChatProduccionInput,
  responderChatEngine,
} from '../../backend/src/producciones/ia.engine';
import {
  type VercelRequestLike,
  type VercelResponseLike,
  parseJsonBody,
  parsePositiveNumber,
  sendJson,
  setCorsHeaders,
} from '../_shared/http';

export default async function handler(
  req: VercelRequestLike,
  res: VercelResponseLike,
): Promise<void> {
  if (req.method === 'OPTIONS') {
    setCorsHeaders(res);
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    sendJson(res, 405, { message: 'Método no permitido' });
    return;
  }

  try {
    const body = await parseJsonBody(req);
    const litrosLeche = parsePositiveNumber(body.litrosLeche);
    const litrosAnteriores = parsePositiveNumber(body.litrosAnteriores);

    const input: ChatProduccionInput = {
      ...(litrosLeche ? { litrosLeche } : {}),
      ...(litrosAnteriores ? { litrosAnteriores } : {}),
      ...(body.tipoInteraccion === 'inicial' ||
      body.tipoInteraccion === 'cambio_litros' ||
      body.tipoInteraccion === 'pregunta'
        ? { tipoInteraccion: body.tipoInteraccion }
        : {}),
      ...(typeof body.alternativaObjetivo === 'string'
        ? { alternativaObjetivo: body.alternativaObjetivo }
        : {}),
      ...(typeof body.preguntaUsuario === 'string'
        ? { preguntaUsuario: body.preguntaUsuario.slice(0, 400) }
        : {}),
      ...(Array.isArray(body.historial)
        ? { historial: body.historial as ChatProduccionInput['historial'] }
        : {}),
      ...(Array.isArray(body.recetasPrevias)
        ? {
            recetasPrevias: body.recetasPrevias.filter(
              (item): item is string => typeof item === 'string',
            ),
          }
        : {}),
      ...(Array.isArray(body.alternativasPrevias)
        ? {
            alternativasPrevias: body.alternativasPrevias.filter(
              (item): item is string => typeof item === 'string',
            ),
          }
        : {}),
    };

    const respuesta = await responderChatEngine(input);
    sendJson(res, 200, respuesta);
  } catch (error) {
    console.error('[api/producciones/chat] Error inesperado:', error);
    const fallback = await responderChatEngine({});
    sendJson(res, 200, fallback);
  }
}

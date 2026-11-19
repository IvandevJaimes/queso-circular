import { generarRecomendacionEngine } from '../../backend/src/producciones/ia.engine';
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
    const litrosLeche = parsePositiveNumber(body.litrosLeche) ?? 50;
    const contexto = Array.isArray(body.contexto)
      ? body.contexto.filter((item): item is string => typeof item === 'string')
      : [];

    const respuesta = await generarRecomendacionEngine({
      litrosLeche,
      contexto,
    });
    sendJson(res, 200, respuesta);
  } catch (error) {
    console.error('[api/producciones/recomendar] Error inesperado:', error);
    const fallback = await generarRecomendacionEngine({
      litrosLeche: 50,
      contexto: [],
    });
    sendJson(res, 200, fallback);
  }
}

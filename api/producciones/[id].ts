import {
  type VercelRequestLike,
  type VercelResponseLike,
  sendJson,
  setCorsHeaders,
} from '../_shared/http';
import {
  guardarProducciones,
  leerProducciones,
} from '../_shared/producciones-store';

function extractId(req: VercelRequestLike): number | null {
  const queryId = req.query?.id;
  const rawQuery = Array.isArray(queryId) ? queryId[0] : queryId;
  const candidate =
    rawQuery ?? req.url?.split('?')[0]?.split('/').filter(Boolean).pop();
  if (!candidate) return null;
  const parsed = Number(candidate);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

export default function handler(
  req: VercelRequestLike,
  res: VercelResponseLike,
): void {
  if (req.method === 'OPTIONS') {
    setCorsHeaders(res);
    res.statusCode = 204;
    res.end();
    return;
  }

  const id = extractId(req);
  if (!id) {
    sendJson(res, 400, { message: 'ID de producción inválido' });
    return;
  }

  const actuales = leerProducciones();

  if (req.method === 'GET') {
    const encontrada = actuales.find((item) => item.id === id);
    if (!encontrada) {
      sendJson(res, 404, { message: 'Producción no encontrada' });
      return;
    }
    sendJson(res, 200, encontrada);
    return;
  }

  if (req.method === 'DELETE') {
    const filtradas = actuales.filter((item) => item.id !== id);
    if (filtradas.length === actuales.length) {
      sendJson(res, 404, { message: 'Producción no encontrada' });
      return;
    }
    guardarProducciones(filtradas);
    sendJson(res, 200, { mensaje: 'Producción eliminada correctamente' });
    return;
  }

  sendJson(res, 405, { message: 'Método no permitido' });
}

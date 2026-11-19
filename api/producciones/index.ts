import {
  type VercelRequestLike,
  type VercelResponseLike,
  parseJsonBody,
  parsePositiveNumber,
  sendJson,
  setCorsHeaders,
} from '../_shared/http';
import {
  guardarProducciones,
  leerProducciones,
} from '../_shared/producciones-store';

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

  if (req.method === 'GET') {
    sendJson(res, 200, leerProducciones());
    return;
  }

  if (req.method === 'POST') {
    const body = await parseJsonBody(req);
    const litrosLeche = parsePositiveNumber(body.litrosLeche);
    if (!litrosLeche) {
      sendJson(res, 400, {
        message: 'litrosLeche debe ser un número positivo.',
      });
      return;
    }

    const actuales = leerProducciones();
    const nextId =
      actuales.reduce((max, item) => Math.max(max, item.id), 0) + 1;
    const nueva = {
      id: nextId,
      litrosLeche,
      quesoEstimado: litrosLeche * 0.12,
      sueroEstimado: litrosLeche * 0.88,
      fecha: new Date().toISOString(),
    };
    guardarProducciones([nueva, ...actuales]);
    sendJson(res, 201, nueva);
    return;
  }

  sendJson(res, 405, { message: 'Método no permitido' });
}

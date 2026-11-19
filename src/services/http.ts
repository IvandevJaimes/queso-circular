export class HttpError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }
}

interface RequestOptions extends RequestInit {
  timeoutMs?: number;
}

export async function fetchJson<T>(
  url: string,
  options: RequestOptions = {},
): Promise<T> {
  const { timeoutMs = 10000, headers, ...rest } = options;
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const mergedHeaders = new Headers(headers);
    if (rest.body && !mergedHeaders.has('Content-Type')) {
      mergedHeaders.set('Content-Type', 'application/json');
    }

    const response = await fetch(url, {
      ...rest,
      headers: mergedHeaders,
      signal: controller.signal,
    });

    if (!response.ok) {
      let detail = `Error HTTP ${response.status}`;
      try {
        const body = (await response.json()) as { message?: string | string[] };
        if (Array.isArray(body.message)) {
          detail = body.message.join(', ');
        } else if (typeof body.message === 'string') {
          detail = body.message;
        }
      } catch {
        // Sin cuerpo JSON parseable
      }
      throw new HttpError(detail, response.status);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new HttpError(
        'La solicitud tardó demasiado en responder. Verifica la conexión.',
        408,
      );
    }
    throw new HttpError(
      'No se pudo conectar con el servidor de Queso Circular IA. Verifica que el backend esté disponible.',
      0,
    );
  } finally {
    window.clearTimeout(timeoutId);
  }
}

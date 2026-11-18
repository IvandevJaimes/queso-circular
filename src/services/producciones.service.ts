import { API_URL } from '../config/constants';
import type {
  CrearProduccionDTO,
  Produccion,
} from '../types/produccion.types';
import { fetchJson } from './http';

const BASE_ENDPOINT = `${API_URL}/producciones`;

export const produccionesService = {
  listar(): Promise<Produccion[]> {
    return fetchJson<Produccion[]>(BASE_ENDPOINT);
  },

  obtenerPorId(id: number): Promise<Produccion> {
    return fetchJson<Produccion>(`${BASE_ENDPOINT}/${id}`);
  },

  crear(datos: CrearProduccionDTO): Promise<Produccion> {
    return fetchJson<Produccion>(BASE_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify(datos),
    });
  },

  eliminar(id: number): Promise<{ mensaje: string }> {
    return fetchJson<{ mensaje: string }>(`${BASE_ENDPOINT}/${id}`, {
      method: 'DELETE',
    });
  },
};

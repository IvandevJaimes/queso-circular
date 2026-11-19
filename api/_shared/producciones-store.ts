import { existsSync, readFileSync, writeFileSync } from 'node:fs';

export interface ProduccionRegistro {
  id: number;
  litrosLeche: number;
  quesoEstimado: number;
  sueroEstimado: number;
  fecha: string;
}

const TMP_DB_PATH = '/tmp/queso-producciones.json';
let memoryFallback: ProduccionRegistro[] = [];

export function leerProducciones(): ProduccionRegistro[] {
  try {
    if (existsSync(TMP_DB_PATH)) {
      const parsed = JSON.parse(
        readFileSync(TMP_DB_PATH, 'utf8'),
      ) as ProduccionRegistro[];
      if (Array.isArray(parsed)) {
        memoryFallback = parsed;
        return parsed;
      }
    }
  } catch {
    // Usar memoria si /tmp no está disponible
  }
  return memoryFallback;
}

export function guardarProducciones(items: ProduccionRegistro[]): void {
  memoryFallback = items;
  try {
    writeFileSync(TMP_DB_PATH, JSON.stringify(items), 'utf8');
  } catch {
    // Conservar copia en memoria
  }
}

import { z } from 'zod';
import { MAX_LITROS_OPERATIVO } from '../config/constants';

export function parseLitrosInput(raw: string): number | null {
  const normalizado = raw.trim().replace(',', '.');
  if (!normalizado) return null;
  if (!/^-?\d+(\.\d+)?$/.test(normalizado)) return null;
  const numero = Number(normalizado);
  return Number.isFinite(numero) ? numero : null;
}

export const produccionFormSchema = z.object({
  litrosLeche: z
    .string()
    .trim()
    .min(1, 'Ingresa la cantidad de litros de leche procesados.')
    .refine((val) => parseLitrosInput(val) !== null, {
      message: 'Ingresa un valor numérico válido (puedes usar punto o coma decimal).',
    })
    .refine(
      (val) => {
        const num = parseLitrosInput(val);
        return num !== null && num > 0;
      },
      {
        message: 'La cantidad de leche debe ser mayor a 0 litros.',
      },
    )
    .refine(
      (val) => {
        const num = parseLitrosInput(val);
        return num !== null && num <= MAX_LITROS_OPERATIVO;
      },
      {
        message: `El límite operativo por partida es de ${MAX_LITROS_OPERATIVO.toLocaleString('es-AR')} litros.`,
      },
    ),
});

export type ProduccionFormValues = z.infer<typeof produccionFormSchema>;

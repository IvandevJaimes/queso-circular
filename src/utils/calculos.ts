import {
  RENDIMIENTO_QUESO,
  RENDIMIENTO_SUERO,
  UMBRAL_VOLUMEN_BAJO_SUERO,
  UMBRAL_VOLUMEN_MEDIO_SUERO,
} from '../config/constants';
import type {
  EstimacionResultado,
  Recomendacion,
} from '../types/produccion.types';

export function calcularProduccion(
  litrosLeche: number,
  guardadaEnHistorial = false,
): EstimacionResultado {
  return {
    litrosLeche,
    quesoEstimado: litrosLeche * RENDIMIENTO_QUESO,
    sueroEstimado: litrosLeche * RENDIMIENTO_SUERO,
    guardadaEnHistorial,
  };
}

export function generarRecomendacion(sueroEstimado: number): Recomendacion {
  if (sueroEstimado < UMBRAL_VOLUMEN_BAJO_SUERO) {
    return {
      nivel: 'bajo',
      escalaBadge: '< 30 L',
      categoria: 'Uso directo',
      alternativaId: 'animal',
      titulo: 'Suplementación animal o enmienda en huerta',
      motivo:
        'A baja escala, calentar el suero para ricota tiene alto costo energético; conviene uso animal directo o dilución en suelo.',
    };
  }

  if (sueroEstimado <= UMBRAL_VOLUMEN_MEDIO_SUERO) {
    return {
      nivel: 'medio',
      escalaBadge: '30–150 L',
      categoria: 'Valorización láctea',
      alternativaId: 'ricota',
      titulo: 'Elaboración artesanal de ricota fresca',
      motivo:
        'Rango óptimo para recuperar proteínas séricas de alto valor comercial y aprovechar el permeado en suelo.',
    };
  }

  return {
    nivel: 'alto',
    escalaBadge: '> 150 L',
    categoria: 'Escala asociativa',
    alternativaId: 'intercambio',
    titulo: 'Ricota sistemática e intercambio entre productores',
    motivo:
      'Volumen ideal para combinar producción continua de ricota con retiros programados junto a granjas o tambos vecinos.',
  };
}

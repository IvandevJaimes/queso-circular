export function formatNumero(valor: number, decimales = 2): string {
  if (!Number.isFinite(valor)) return '0';
  return new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
  }).format(valor);
}

export function formatLitros(valor: number): string {
  return `${formatNumero(valor, 2)} L`;
}

export function formatKilogramos(valor: number): string {
  return `${formatNumero(valor, 2)} kg`;
}

export function formatFecha(fechaIso: string): string {
  if (!fechaIso) return 'Fecha no disponible';
  const fecha = new Date(fechaIso);
  if (Number.isNaN(fecha.getTime())) return fechaIso;
  const dia = new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(fecha);
  const hora = new Intl.DateTimeFormat('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(fecha);
  return `${dia} · ${hora}`;
}

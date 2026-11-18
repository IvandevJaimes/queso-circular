import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { generarRecomendacion } from '../../utils/calculos';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

interface RecomendacionBannerProps {
  sueroEstimado: number;
}

export function RecomendacionBanner({
  sueroEstimado,
}: RecomendacionBannerProps) {
  const recomendacion = generarRecomendacion(sueroEstimado);

  return (
    <Card className="flex flex-col gap-2.5 p-4 sm:p-5">
      <div className="flex items-center gap-2">
        <Badge variant="sky">{recomendacion.escalaBadge}</Badge>
        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
          {recomendacion.categoria}
        </span>
      </div>

      <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
        {recomendacion.titulo}
      </h3>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {recomendacion.motivo}
        </p>
        <Link
          to={`/alternativas?destacada=${recomendacion.alternativaId}`}
          className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-amber-600 transition-colors hover:text-amber-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 dark:text-amber-400 dark:hover:text-amber-300"
        >
          <span>Ver ficha técnica</span>
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>
    </Card>
  );
}

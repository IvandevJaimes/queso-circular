import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, Clock, RefreshCw } from 'lucide-react';
import { ProduccionRow } from '../components/domain/ProduccionRow';
import { PageHeader } from '../components/layout/PageHeader';
import { Alert } from '../components/ui/Alert';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { Modal } from '../components/ui/Modal';
import { Skeleton } from '../components/ui/Skeleton';
import { useProducciones } from '../hooks/useProducciones';
import type { Produccion } from '../types/produccion.types';
import { cn } from '../utils/cn';
import {
  formatFecha,
  formatKilogramos,
  formatLitros,
} from '../utils/formatters';

export function HistorialPage() {
  const {
    producciones,
    isLoading,
    deletingId,
    error,
    recargar,
    eliminarProduccion,
  } = useProducciones(true);

  const [pendienteEliminar, setPendienteEliminar] = useState<Produccion | null>(
    null,
  );

  const resumen = useMemo(() => {
    return producciones.reduce(
      (acc, item) => ({
        partidas: acc.partidas + 1,
        leche: acc.leche + Number(item.litrosLeche || 0),
        queso: acc.queso + Number(item.quesoEstimado || 0),
        suero: acc.suero + Number(item.sueroEstimado || 0),
      }),
      { partidas: 0, leche: 0, queso: 0, suero: 0 },
    );
  }, [producciones]);

  const handleConfirmDelete = async () => {
    if (!pendienteEliminar) return;
    const ok = await eliminarProduccion(pendienteEliminar.id);
    if (ok) {
      setPendienteEliminar(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Historial de producciones"
        description="Registro de partidas y volúmenes acumulados"
        action={
          <button
            type="button"
            disabled={isLoading}
            onClick={() => void recargar()}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800 cursor-pointer"
          >
            <RefreshCw
              className={cn('h-3.5 w-3.5', isLoading && 'animate-spin')}
              aria-hidden="true"
            />
            <span>Actualizar</span>
          </button>
        }
      />

      <section
        aria-label="Métricas acumuladas"
        className="grid grid-cols-2 gap-3 lg:grid-cols-4"
      >
        <Card className="p-4">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Partidas registradas
          </p>
          <p className="mt-1 text-xl font-bold tabular-nums text-zinc-900 dark:text-zinc-100 sm:text-2xl">
            {resumen.partidas}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Leche procesada
          </p>
          <p className="mt-1 text-xl font-bold tabular-nums text-zinc-900 dark:text-zinc-100 sm:text-2xl">
            {formatLitros(resumen.leche)}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-amber-700 dark:text-amber-400">
            Queso estimado
          </p>
          <p className="mt-1 text-xl font-bold tabular-nums text-zinc-900 dark:text-zinc-100 sm:text-2xl">
            {formatKilogramos(resumen.queso)}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-sky-600 dark:text-sky-400">
            Lactosuero valorizable
          </p>
          <p className="mt-1 text-xl font-bold tabular-nums text-zinc-900 dark:text-zinc-100 sm:text-2xl">
            {formatLitros(resumen.suero)}
          </p>
        </Card>
      </section>

      {error && (
        <Alert
          variant="error"
          title="Error al consultar el historial"
          action={
            <Button
              size="sm"
              variant="outline"
              onClick={() => void recargar()}
            >
              Reintentar
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {isLoading && producciones.length === 0 ? (
        <div className="space-y-2.5">
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
        </div>
      ) : !error && producciones.length === 0 ? (
        <EmptyState
          icon={<Clock className="h-5 w-5" aria-hidden="true" />}
          title="Todavía no hay producciones guardadas"
          description="Calcula una partida desde la calculadora y guárdala para verla aquí."
          action={
            <Link
              to="/"
              className="inline-flex h-9 items-center gap-2 rounded-lg bg-amber-600 px-4 text-sm font-medium text-white transition-colors hover:bg-amber-500 dark:bg-amber-500 dark:text-zinc-950 dark:hover:bg-amber-400"
            >
              <Calculator className="h-4 w-4" aria-hidden="true" />
              <span>Ir a la calculadora</span>
            </Link>
          }
        />
      ) : (
        <div className="space-y-2.5">
          {producciones.map((item) => (
            <ProduccionRow
              key={item.id}
              produccion={item}
              isDeleting={deletingId === item.id}
              onRequestDelete={setPendienteEliminar}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={Boolean(pendienteEliminar)}
        onClose={() => setPendienteEliminar(null)}
        title="Confirmar eliminación"
        subtitle="Esta acción elimina el registro de la base de datos."
        size="md"
        footer={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPendienteEliminar(null)}
              disabled={deletingId !== null}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              size="sm"
              isLoading={deletingId !== null}
              onClick={() => void handleConfirmDelete()}
            >
              Eliminar partida
            </Button>
          </>
        }
      >
        {pendienteEliminar && (
          <div className="rounded-xl bg-stone-50 p-3.5 text-sm text-zinc-700 dark:bg-zinc-950/70 dark:text-zinc-300">
            <p className="font-medium text-zinc-900 dark:text-zinc-100">
              Partida #{pendienteEliminar.id} ·{' '}
              {formatFecha(pendienteEliminar.fecha)}
            </p>
            <p className="mt-1 tabular-nums">
              {formatLitros(pendienteEliminar.litrosLeche)} leche •{' '}
              {formatKilogramos(pendienteEliminar.quesoEstimado)} queso •{' '}
              {formatLitros(pendienteEliminar.sueroEstimado)} suero
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}

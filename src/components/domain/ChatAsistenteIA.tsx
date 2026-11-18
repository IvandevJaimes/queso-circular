import { useEffect, useRef, useState } from 'react';
import {
  Bot,
  ChevronRight,
  Clock,
  Info,
  Loader2,
  Maximize2,
  Minimize2,
  Send,
  Sparkles,
  Trash2,
  User,
  Utensils,
} from 'lucide-react';
import {
  RECETAS_QUESO_CIRCULAR,
  type RecetaLocal,
} from '../../config/recetas.data';
import type {
  AlternativaId,
  ChatMessage,
} from '../../types/produccion.types';
import { cn } from '../../utils/cn';
import { formatNumero } from '../../utils/formatters';
import { Badge } from '../ui/Badge';

interface ChatAsistenteIAProps {
  litrosLeche: number;
  sueroEstimado: number;
  messages: ChatMessage[];
  isLoading: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onCloseExpand: () => void;
  onSendQuestion: (pregunta: string) => void;
  onClearChat: () => void;
  onOpenAlternativa: (id: AlternativaId) => void;
  onOpenReceta: (receta: RecetaLocal) => void;
}

const PREGUNTAS_RAPIDAS_DEFAULT = [
  '¿Cómo hago la ricota paso a paso?',
  'No tengo fuego ni olla grande, ¿qué otra opción hay?',
  '¿Cómo se lo doy a los animales sin que les haga mal?',
  '¿Cómo lo uso para regar la huerta o pastura?',
];

function RecetaMiniCard({
  receta,
  onSelect,
}: {
  receta: RecetaLocal;
  onSelect: (receta: RecetaLocal) => void;
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <button
      type="button"
      onClick={() => onSelect(receta)}
      className="group flex w-full items-center gap-2.5 rounded-xl border border-stone-200/80 bg-white p-2 text-left transition-colors hover:border-amber-500/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-amber-500/50 cursor-pointer"
    >
      <div className="h-12 w-14 shrink-0 overflow-hidden rounded-lg bg-stone-100 dark:bg-zinc-800">
        {receta.imagenUrl && !imgError ? (
          <img
            src={receta.imagenUrl}
            alt={receta.titulo}
            loading="lazy"
            onError={() => setImgError(true)}
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-zinc-400">
            <Utensils className="h-4 w-4" aria-hidden="true" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="line-clamp-1 text-xs font-semibold text-zinc-900 dark:text-zinc-100">
          {receta.titulo}
        </p>
        <div className="mt-1 flex items-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" aria-hidden="true" />
            <span>{receta.tiempoPreparacion}</span>
          </span>
          <span className="truncate text-amber-600 dark:text-amber-400">
            {receta.categoria}
          </span>
        </div>
      </div>

      <ChevronRight
        className="h-4 w-4 shrink-0 text-zinc-400 transition-transform group-hover:translate-x-0.5 group-hover:text-amber-600 dark:group-hover:text-amber-400"
        aria-hidden="true"
      />
    </button>
  );
}

export function ChatAsistenteIA({
  litrosLeche,
  sueroEstimado,
  messages,
  isLoading,
  isExpanded,
  onToggleExpand,
  onCloseExpand,
  onSendQuestion,
  onClearChat,
  onOpenAlternativa,
  onOpenReceta,
}: ChatAsistenteIAProps) {
  const [inputText, setInputText] = useState('');
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, isLoading, isExpanded]);

  useEffect(() => {
    if (!isExpanded) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCloseExpand();
      }
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isExpanded, onCloseExpand]);

  const ultimoMensajeIA = [...messages]
    .reverse()
    .find((m) => m.role === 'assistant' && m.data);

  const sugerencias =
    ultimoMensajeIA?.data?.sugerenciasSeguimiento &&
    ultimoMensajeIA.data.sugerenciasSeguimiento.length > 0
      ? ultimoMensajeIA.data.sugerenciasSeguimiento
      : PREGUNTAS_RAPIDAS_DEFAULT;

  const origenActual = ultimoMensajeIA?.data?.origen;
  const etiquetaOrigen = !origenActual
    ? null
    : origenActual === 'motor-local'
      ? 'Motor Local'
      : origenActual
          .replace(/^gemini-/i, 'Gemini ')
          .replace(/-/g, ' ')
          .replace(/\b\w/g, (l) => l.toUpperCase());
  const sueroTexto = formatNumero(sueroEstimado, 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const limpio = inputText.trim();
    if (!limpio || litrosLeche <= 0 || isLoading) return;
    setInputText('');
    onSendQuestion(limpio);
  };

  return (
    <>
      {isExpanded && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-200"
          onClick={onCloseExpand}
          aria-hidden="true"
        />
      )}

      <div
        role={isExpanded ? 'dialog' : undefined}
        aria-modal={isExpanded ? true : undefined}
        aria-label={isExpanded ? 'Asistente Queso Circular IA expandido' : undefined}
        className={cn(
          'flex flex-col overflow-hidden transition-all duration-200',
          isExpanded
            ? 'fixed inset-4 z-50 rounded-2xl border border-amber-500/30 bg-white/95 shadow-2xl backdrop-blur-md dark:bg-zinc-950/95 md:inset-10'
            : 'rounded-xl border border-stone-200/80 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/90 dark:shadow-none',
        )}
      >
        <div className="flex items-center justify-between border-b border-stone-200/80 px-4 py-3 dark:border-zinc-800/80">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Asistente Queso Circular IA
            </span>
            {etiquetaOrigen && (
              <Badge variant="neutral" className="hidden sm:inline-flex">
                {etiquetaOrigen}
              </Badge>
            )}
            {isExpanded && litrosLeche > 0 && (
              <Badge variant="sky" className="hidden md:inline-flex">
                {sueroTexto} L de suero
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-1">
            {messages.length > 0 && (
              <button
                type="button"
                onClick={onClearChat}
                aria-label="Limpiar conversación"
                title="Limpiar conversación"
                className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-zinc-500 transition-colors hover:bg-stone-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">Limpiar</span>
              </button>
            )}

            <button
              type="button"
              onClick={onToggleExpand}
              aria-label={isExpanded ? 'Reducir chat' : 'Expandir chat'}
              title={isExpanded ? 'Reducir chat' : 'Expandir chat'}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-stone-100 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 cursor-pointer"
            >
              {isExpanded ? (
                <Minimize2 className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Maximize2 className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          className={cn(
            'flex flex-col overflow-y-auto',
            isExpanded
              ? 'flex-1 space-y-4 p-4 md:p-6'
              : 'h-[320px] space-y-3.5 p-4 sm:h-[360px]',
          )}
        >
          {messages.length === 0 && !isLoading && (
            <div className="flex items-start gap-2.5">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400">
                <Bot className="h-4 w-4" aria-hidden="true" />
              </span>
              <div className="max-w-[88%] rounded-2xl rounded-tl-sm border border-stone-200/80 bg-stone-50 px-3.5 py-2.5 text-sm leading-relaxed text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950/70 dark:text-zinc-300">
                Hola. Ingresa arriba los litros de leche que vas a elaborar y te diré la forma más simple y rentable de aprovechar el suero.
              </div>
            </div>
          )}

          {messages.map((msg) => {
            if (msg.role === 'user') {
              return (
                <div key={msg.id} className="flex items-start justify-end gap-2.5">
                  <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-amber-600 px-3.5 py-2.5 text-sm leading-relaxed text-white dark:bg-amber-500 dark:text-zinc-950">
                    {msg.texto}
                  </div>
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-stone-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                    <User className="h-4 w-4" aria-hidden="true" />
                  </span>
                </div>
              );
            }

            const recetasAsociadas = (msg.data?.recetasSugeridas ?? [])
              .map((id) => RECETAS_QUESO_CIRCULAR.find((r) => r.id === id))
              .filter((r): r is RecetaLocal => Boolean(r));

            return (
              <div key={msg.id} className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400">
                  <Bot className="h-4 w-4" aria-hidden="true" />
                </span>

                <div className="flex max-w-[90%] flex-col gap-2.5 rounded-2xl rounded-tl-sm border border-stone-200/80 bg-stone-50 px-3.5 py-3 text-sm text-zinc-800 dark:border-zinc-800 dark:bg-zinc-950/70 dark:text-zinc-200">
                  <p className="leading-relaxed">{msg.texto}</p>

                  {msg.data?.tituloRecomendacion && (
                    <div className="flex flex-col gap-2.5 rounded-xl border border-stone-200/80 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                          {msg.data.tituloRecomendacion}
                        </h4>
                        {msg.data.rendimientoSimple && (
                          <span className="text-xs font-semibold text-sky-600 dark:text-sky-400">
                            {msg.data.rendimientoSimple}
                          </span>
                        )}
                      </div>

                      {msg.data.pasosSimples &&
                        msg.data.pasosSimples.length > 0 && (
                          <ol className="flex flex-col gap-1.5">
                            {msg.data.pasosSimples.map((paso, idx) => (
                              <li
                                key={idx}
                                className="flex items-start gap-2 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300"
                              >
                                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded bg-amber-500/15 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                                  {idx + 1}
                                </span>
                                <span>{paso}</span>
                              </li>
                            ))}
                          </ol>
                        )}

                      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-stone-200/80 pt-2 dark:border-zinc-800">
                        {msg.data.consejoClave ? (
                          <p className="flex items-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                            <Info
                              className="h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400"
                              aria-hidden="true"
                            />
                            <span>{msg.data.consejoClave}</span>
                          </p>
                        ) : (
                          <span />
                        )}

                        {msg.data.alternativaSugerida && (
                          <button
                            type="button"
                            onClick={() =>
                              onOpenAlternativa(msg.data!.alternativaSugerida!)
                            }
                            className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-amber-600 transition-colors hover:text-amber-500 dark:text-amber-400 dark:hover:text-amber-300 cursor-pointer"
                          >
                            <span>Ver guía detallada</span>
                            <ChevronRight
                              className="h-3.5 w-3.5"
                              aria-hidden="true"
                            />
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {recetasAsociadas.length > 0 && (
                    <div className="flex flex-col gap-2 pt-0.5">
                      <span className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                        Recetas sugeridas para tu lote
                      </span>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {recetasAsociadas.map((receta) => (
                          <RecetaMiniCard
                            key={receta.id}
                            receta={receta}
                            onSelect={onOpenReceta}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-start gap-2.5" aria-live="polite">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400">
                <Bot className="h-4 w-4" aria-hidden="true" />
              </span>
              <div className="inline-flex items-center gap-2 rounded-2xl rounded-tl-sm border border-stone-200/80 bg-stone-50 px-3.5 py-2.5 text-xs font-medium text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950/70 dark:text-zinc-300">
                <Loader2
                  className="h-3.5 w-3.5 animate-spin text-amber-600 dark:text-amber-400"
                  aria-hidden="true"
                />
                <span>Queso Circular IA está escribiendo...</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2.5 border-t border-stone-200/80 bg-stone-50/70 p-3 dark:border-zinc-800/80 dark:bg-zinc-950/60">
          {litrosLeche > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {sugerencias.map((pregunta) => (
                <button
                  key={pregunta}
                  type="button"
                  disabled={isLoading}
                  onClick={() => onSendQuestion(pregunta)}
                  className="rounded-lg border border-stone-200 bg-white px-2.5 py-1 text-left text-xs font-medium text-zinc-700 transition-colors hover:border-amber-500/50 hover:text-amber-700 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-amber-500/50 dark:hover:text-amber-400 cursor-pointer"
                >
                  {pregunta}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={litrosLeche <= 0 || isLoading}
              placeholder={
                litrosLeche > 0
                  ? `Escribe tu duda sobre estos ${sueroTexto} L de suero...`
                  : 'Ingresa arriba los litros de leche para consultar...'
              }
              className="h-10 flex-1 rounded-xl border border-stone-300 bg-white px-3.5 text-sm text-zinc-900 placeholder:text-zinc-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || litrosLeche <= 0 || isLoading}
              aria-label="Enviar consulta"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-600 text-white transition-colors hover:bg-amber-500 disabled:pointer-events-none disabled:opacity-40 dark:bg-amber-500 dark:text-zinc-950 dark:hover:bg-amber-400 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Send className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

import { useEffect } from 'react';
import {
  CheckCircle2,
  Download,
  PlusSquare,
  Share,
  Smartphone,
  X,
} from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { useViewportKeyboard } from '../../hooks/useViewportKeyboard';

export function InstallPWAButton() {
  const { canShowInstallButton, isIOS, isGuideOpen, triggerInstall, closeGuide } =
    usePWAInstall();
  const { viewportOverlayStyle, getPanelMaxHeightStyle } =
    useViewportKeyboard();

  useEffect(() => {
    if (!isGuideOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeGuide();
      }
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isGuideOpen, closeGuide]);

  if (!canShowInstallButton) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => void triggerInstall()}
        aria-label="Instalar aplicación móvil"
        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/15 px-2.5 text-xs font-semibold text-amber-700 transition-colors hover:bg-amber-500/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 dark:border-amber-400/30 dark:bg-amber-500/15 dark:text-amber-300 dark:hover:bg-amber-500/25 cursor-pointer"
      >
        <Download className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span>Instalar app</span>
      </button>

      {isGuideOpen && (
        <div
          style={viewportOverlayStyle}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-3 backdrop-blur-sm sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pwa-install-guide-title"
        >
          <div
            className="fixed inset-0"
            onClick={closeGuide}
            aria-hidden="true"
          />

          <div
            style={getPanelMaxHeightStyle(24)}
            className="relative z-10 w-full max-w-md overflow-y-auto rounded-2xl border border-stone-200/80 bg-white p-5 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
                  <Smartphone className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h2
                    id="pwa-install-guide-title"
                    className="text-base font-semibold text-zinc-900 dark:text-zinc-100"
                  >
                    Instalar Queso Circular IA
                  </h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Acceso directo en tu pantalla de inicio
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeGuide}
                aria-label="Cerrar instrucciones de instalación"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-stone-100 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 cursor-pointer"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <ol className="mt-4 flex flex-col gap-3">
              {isIOS ? (
                <>
                  <li className="flex items-start gap-3 rounded-xl border border-stone-200/80 bg-stone-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-sky-500/15 text-sky-600 dark:text-sky-400">
                      <Share className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div className="text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                        1. Toca el icono Compartir
                      </span>{' '}
                      en la barra inferior de Safari.
                    </div>
                  </li>

                  <li className="flex items-start gap-3 rounded-xl border border-stone-200/80 bg-stone-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400">
                      <PlusSquare className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div className="text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                        2. Selecciona &quot;Agregar a pantalla de inicio&quot;
                      </span>{' '}
                      y confirma arriba a la derecha.
                    </div>
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-start gap-3 rounded-xl border border-stone-200/80 bg-stone-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-sky-500/15 text-sky-600 dark:text-sky-400">
                      <Smartphone className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div className="text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                        1. Abre el menú de tu navegador
                      </span>{' '}
                      en la esquina superior derecha.
                    </div>
                  </li>

                  <li className="flex items-start gap-3 rounded-xl border border-stone-200/80 bg-stone-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400">
                      <PlusSquare className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div className="text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                        2. Toca &quot;Instalar aplicación&quot;
                      </span>{' '}
                      o &quot;Agregar a pantalla de inicio&quot;.
                    </div>
                  </li>
                </>
              )}
            </ol>

            <div className="mt-4 flex items-center justify-between gap-3 border-t border-stone-200/80 pt-3.5 dark:border-zinc-800">
              <p className="flex items-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                <CheckCircle2
                  className="h-3.5 w-3.5 shrink-0 text-sky-600 dark:text-sky-400"
                  aria-hidden="true"
                />
                <span>Calculadora y guías disponibles sin conexión</span>
              </p>

              <button
                type="button"
                onClick={closeGuide}
                className="shrink-0 rounded-lg bg-amber-600 px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-amber-500 dark:bg-amber-500 dark:text-zinc-950 dark:hover:bg-amber-400 cursor-pointer"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

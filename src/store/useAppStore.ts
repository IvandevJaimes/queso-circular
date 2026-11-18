import { create } from 'zustand';
import { MAX_LITROS_OPERATIVO } from '../config/constants';
import { parseLitrosInput } from '../schemas/produccion.schema';
import { produccionesService } from '../services/producciones.service';
import { recetasService } from '../services/recetas.service';
import type {
  AlternativaId,
  ChatMessage,
  EstimacionResultado,
  Produccion,
} from '../types/produccion.types';
import type { RecetaLocal } from '../types/receta.types';
import { calcularProduccion } from '../utils/calculos';

export type ThemeMode = 'light' | 'dark';

export interface ToastMessage {
  id: number;
  tipo: 'success' | 'error' | 'info';
  titulo: string;
  descripcion?: string;
}

const THEME_STORAGE_KEY = 'queso-circular-theme';

function getInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'light';
  try {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  } catch {
    return 'light';
  }
}

function applyThemeToDom(theme: ThemeMode): void {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('dark', theme === 'dark');
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Ignorar error de almacenamiento si está restringido
  }
}

function crearIdMensaje(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

interface AppState {
  theme: ThemeMode;
  litrosInput: string;
  ultimaEstimacion: EstimacionResultado | null;
  chatMessages: ChatMessage[];
  chatConsultadoLitros: number | null;
  isChatLoading: boolean;
  isGeneratingIA: boolean;
  isChatExpanded: boolean;
  alternativaSeleccionadaParaIA: AlternativaId | null;
  producciones: Produccion[];
  produccionesCargadas: boolean;
  isLoadingProducciones: boolean;
  isSavingProduccion: boolean;
  deletingId: number | null;
  errorProducciones: string | null;
  recetas: RecetaLocal[];
  recetasCargadas: boolean;
  isLoadingRecetas: boolean;
  errorRecetas: string | null;
  toast: ToastMessage | null;

  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  setLitrosInput: (raw: string) => void;
  setUltimaEstimacion: (estimacion: EstimacionResultado | null) => void;
  enviarConsultaChat: (
    litrosLeche: number,
    preguntaUsuario?: string,
  ) => Promise<void>;
  limpiarChat: () => void;
  toggleChatExpanded: () => void;
  setChatExpanded: (expanded: boolean) => void;
  consultarAlternativaConIA: (
    alternativaId: AlternativaId,
    alternativaNombre: string,
  ) => Promise<void>;
  showToast: (payload: Omit<ToastMessage, 'id'>) => void;
  dismissToast: () => void;
  cargarProducciones: () => Promise<void>;
  guardarProduccion: (litrosLeche: number) => Promise<boolean>;
  eliminarProduccion: (id: number) => Promise<boolean>;
  cargarRecetas: (forzar?: boolean) => Promise<void>;
}

let toastTimer: number | undefined;
let activeChatRequestToken = 0;

export const useAppStore = create<AppState>((set, get) => ({
  theme: getInitialTheme(),
  litrosInput: '',
  ultimaEstimacion: null,
  chatMessages: [],
  chatConsultadoLitros: null,
  isChatLoading: false,
  isGeneratingIA: false,
  isChatExpanded: false,
  alternativaSeleccionadaParaIA: null,
  producciones: [],
  produccionesCargadas: false,
  isLoadingProducciones: false,
  isSavingProduccion: false,
  deletingId: null,
  errorProducciones: null,
  recetas: [],
  recetasCargadas: false,
  isLoadingRecetas: false,
  errorRecetas: null,
  toast: null,

  setTheme: (theme) => {
    applyThemeToDom(theme);
    set({ theme });
  },

  toggleTheme: () => {
    const nextTheme: ThemeMode = get().theme === 'dark' ? 'light' : 'dark';
    applyThemeToDom(nextTheme);
    set({ theme: nextTheme });
  },

  setLitrosInput: (raw) => {
    const parsed = parseLitrosInput(raw);
    const esValido =
      parsed !== null && parsed > 0 && parsed <= MAX_LITROS_OPERATIVO;
    const prevEst = get().ultimaEstimacion;

    if (!esValido || parsed === null) {
      set({ litrosInput: raw, ultimaEstimacion: null });
      return;
    }

    const yaGuardada = Boolean(
      prevEst && prevEst.litrosLeche === parsed && prevEst.guardadaEnHistorial,
    );

    set({
      litrosInput: raw,
      ultimaEstimacion: calcularProduccion(parsed, yaGuardada),
    });
  },

  setUltimaEstimacion: (estimacion) => {
    set({ ultimaEstimacion: estimacion });
  },

  enviarConsultaChat: async (litrosLeche, preguntaUsuario) => {
    const pregunta = preguntaUsuario?.trim();
    if (litrosLeche <= 0) return;
    if (get().isGeneratingIA) return;
    if (!pregunta && get().chatConsultadoLitros === litrosLeche) return;

    const requestToken = ++activeChatRequestToken;
    const historialPrevio = get()
      .chatMessages.slice(-6)
      .map((m) => ({ role: m.role, texto: m.texto }));

    if (pregunta) {
      set((state) => {
        const ultimo = state.chatMessages[state.chatMessages.length - 1];
        const yaRegistrada =
          ultimo?.role === 'user' && ultimo?.texto === pregunta;
        const userMsg: ChatMessage = {
          id: crearIdMensaje(),
          role: 'user',
          texto: pregunta,
          litrosContexto: litrosLeche,
        };
        return {
          chatMessages: yaRegistrada
            ? state.chatMessages
            : [...state.chatMessages, userMsg],
          chatConsultadoLitros: litrosLeche,
          isChatLoading: true,
          isGeneratingIA: true,
        };
      });
    } else {
      set({
        isChatLoading: true,
        isGeneratingIA: true,
        chatConsultadoLitros: litrosLeche,
      });
    }

    const minDelay = new Promise<void>((resolve) => {
      window.setTimeout(resolve, 450);
    });

    try {
      const [respuesta] = await Promise.all([
        produccionesService.enviarMensajeChat(
          litrosLeche,
          pregunta,
          historialPrevio,
        ),
        minDelay,
      ]);

      if (requestToken !== activeChatRequestToken) return;

      const assistantMsg: ChatMessage = {
        id: crearIdMensaje(),
        role: 'assistant',
        texto: respuesta.mensaje,
        data: respuesta,
        litrosContexto: litrosLeche,
      };

      set((state) => ({
        chatMessages: [...state.chatMessages, assistantMsg],
        chatConsultadoLitros: litrosLeche,
        isChatLoading: false,
        isGeneratingIA: false,
      }));
    } catch (error) {
      await minDelay;
      if (requestToken !== activeChatRequestToken) return;

      const mensajeError =
        error instanceof Error
          ? error.message
          : 'No se pudo conectar con Queso Circular IA.';

      const errorMsg: ChatMessage = {
        id: crearIdMensaje(),
        role: 'assistant',
        texto: `${mensajeError} Verifica que el servidor backend esté activo en el puerto 4000.`,
      };

      set((state) => ({
        chatMessages: [...state.chatMessages, errorMsg],
        isChatLoading: false,
        isGeneratingIA: false,
      }));
    }
  },

  limpiarChat: () => {
    activeChatRequestToken++;
    set({
      chatMessages: [],
      chatConsultadoLitros: null,
      isChatLoading: false,
      isGeneratingIA: false,
      alternativaSeleccionadaParaIA: null,
    });
  },

  toggleChatExpanded: () => {
    set((state) => ({ isChatExpanded: !state.isChatExpanded }));
  },

  setChatExpanded: (expanded) => {
    set({ isChatExpanded: expanded });
  },

  consultarAlternativaConIA: async (alternativaId, alternativaNombre) => {
    if (get().isGeneratingIA) return;

    const litrosActuales = get().ultimaEstimacion?.litrosLeche ?? 0;
    set({ alternativaSeleccionadaParaIA: alternativaId });

    if (litrosActuales > 0) {
      const litrosFmt = Number.isInteger(litrosActuales)
        ? String(litrosActuales)
        : litrosActuales.toFixed(1).replace('.', ',');
      const pregunta = `¿Qué necesito exactamente y es viable para mis ${litrosFmt} L de leche hacer ${alternativaNombre}?`;
      await get().enviarConsultaChat(litrosActuales, pregunta);
      return;
    }

    const textoAviso = `Ingresa primero los litros de leche arriba para que analice si puedes hacer ${alternativaNombre}.`;
    set((state) => {
      const ultimo = state.chatMessages[state.chatMessages.length - 1];
      if (ultimo?.role === 'assistant' && ultimo?.texto === textoAviso) {
        return state;
      }
      const avisoMsg: ChatMessage = {
        id: crearIdMensaje(),
        role: 'assistant',
        texto: textoAviso,
      };
      return {
        chatMessages: [...state.chatMessages, avisoMsg],
      };
    });
  },

  showToast: (payload) => {
    if (typeof window !== 'undefined' && toastTimer) {
      window.clearTimeout(toastTimer);
    }
    const id = Date.now();
    set({ toast: { ...payload, id } });
    if (typeof window !== 'undefined') {
      toastTimer = window.setTimeout(() => {
        if (get().toast?.id === id) {
          set({ toast: null });
        }
      }, 4500);
    }
  },

  dismissToast: () => {
    if (typeof window !== 'undefined' && toastTimer) {
      window.clearTimeout(toastTimer);
    }
    set({ toast: null });
  },

  cargarProducciones: async () => {
    set({ isLoadingProducciones: true, errorProducciones: null });
    try {
      const datos = await produccionesService.listar();
      set({
        producciones: datos,
        produccionesCargadas: true,
        isLoadingProducciones: false,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'No se pudo obtener el historial de producciones.';
      set({
        errorProducciones: message,
        isLoadingProducciones: false,
      });
    }
  },

  guardarProduccion: async (litrosLeche) => {
    set({ isSavingProduccion: true });
    try {
      const creada = await produccionesService.crear({ litrosLeche });
      set((state) => ({
        producciones: [creada, ...state.producciones],
        produccionesCargadas: true,
        isSavingProduccion: false,
        ultimaEstimacion: {
          ...calcularProduccion(creada.litrosLeche, true),
          quesoEstimado: creada.quesoEstimado,
          sueroEstimado: creada.sueroEstimado,
        },
      }));
      get().showToast({
        tipo: 'success',
        titulo: 'Partida registrada en historial',
        descripcion: `${creada.litrosLeche} L procesados guardados correctamente.`,
      });
      return true;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'No se pudo guardar la partida en el servidor.';
      set({ isSavingProduccion: false });
      get().showToast({
        tipo: 'error',
        titulo: 'Error al guardar partida',
        descripcion: message,
      });
      return false;
    }
  },

  eliminarProduccion: async (id) => {
    set({ deletingId: id });
    try {
      await produccionesService.eliminar(id);
      set((state) => ({
        producciones: state.producciones.filter((item) => item.id !== id),
        deletingId: null,
      }));
      get().showToast({
        tipo: 'info',
        titulo: 'Registro eliminado',
        descripcion: 'La partida fue removida del historial.',
      });
      return true;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'No se pudo eliminar el registro seleccionado.';
      set({ deletingId: null });
      get().showToast({
        tipo: 'error',
        titulo: 'No se pudo eliminar',
        descripcion: message,
      });
      return false;
    }
  },

  cargarRecetas: async (forzar = false) => {
    if (!forzar && get().recetasCargadas && get().recetas.length > 0) {
      return;
    }
    set({ isLoadingRecetas: true, errorRecetas: null });
    try {
      const recetas = await recetasService.obtenerRecetas();
      set({
        recetas,
        recetasCargadas: true,
        isLoadingRecetas: false,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'No fue posible cargar el catálogo de recetas.';
      set({
        errorRecetas: message,
        isLoadingRecetas: false,
      });
    }
  },
}));

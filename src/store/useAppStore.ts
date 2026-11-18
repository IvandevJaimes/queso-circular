import { create } from 'zustand';
import { produccionesService } from '../services/producciones.service';
import { recetasService } from '../services/recetas.service';
import type {
  EstimacionResultado,
  Produccion,
} from '../types/produccion.types';
import type { Receta } from '../types/receta.types';
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

interface AppState {
  theme: ThemeMode;
  ultimaEstimacion: EstimacionResultado | null;
  producciones: Produccion[];
  produccionesCargadas: boolean;
  isLoadingProducciones: boolean;
  isSavingProduccion: boolean;
  deletingId: number | null;
  errorProducciones: string | null;
  recetas: Receta[];
  recetasCargadas: boolean;
  isLoadingRecetas: boolean;
  errorRecetas: string | null;
  toast: ToastMessage | null;

  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  setUltimaEstimacion: (estimacion: EstimacionResultado | null) => void;
  showToast: (payload: Omit<ToastMessage, 'id'>) => void;
  dismissToast: () => void;
  cargarProducciones: () => Promise<void>;
  guardarProduccion: (litrosLeche: number) => Promise<boolean>;
  eliminarProduccion: (id: number) => Promise<boolean>;
  cargarRecetas: (forzar?: boolean) => Promise<void>;
}

let toastTimer: number | undefined;

export const useAppStore = create<AppState>((set, get) => ({
  theme: getInitialTheme(),
  ultimaEstimacion: null,
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

  setUltimaEstimacion: (estimacion) => {
    set({ ultimaEstimacion: estimacion });
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
      const recetas = await recetasService.buscarRecetasRicota();
      set({
        recetas,
        recetasCargadas: true,
        isLoadingRecetas: false,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'No fue posible cargar las recetas con ricota.';
      set({
        errorRecetas: message,
        isLoadingRecetas: false,
      });
    }
  },
}));

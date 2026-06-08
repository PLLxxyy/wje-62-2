import { create } from 'zustand';
import type { AppStatus, AppSettings, ImageInfo, HistoryItem } from '@/types';

const MAX_HISTORY = 20;

interface AppState {
  image: HTMLImageElement | null;
  imageData: ImageData | null;
  asciiText: string;
  imageInfo: ImageInfo | null;
  settings: AppSettings;
  status: AppStatus;
  errorMessage: string | null;
  previewLines: string[];
  history: HistoryItem[];
  activeHistoryId: string | null;

  setImage: (image: HTMLImageElement | null) => void;
  setImageData: (data: ImageData | null) => void;
  setAsciiText: (text: string) => void;
  setImageInfo: (info: ImageInfo | null) => void;
  setSettings: (settings: Partial<AppSettings>) => void;
  setStatus: (status: AppStatus) => void;
  setErrorMessage: (message: string | null) => void;
  setPreviewLines: (lines: string[]) => void;
  addHistory: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
  selectHistory: (id: string | null) => void;
  deleteHistory: (id: string) => void;
  clearHistory: () => void;
  reset: () => void;
}

const defaultSettings: AppSettings = {
  width: 100,
  charSet: 'standard',
  customChars: '',
  invert: false,
};

const generateId = () =>
  Date.now().toString(36) + Math.random().toString(36).substr(2);

const generateThumbnail = (lines: string[]): string => {
  const previewLines = lines.slice(0, 8);
  const maxLen = Math.min(30, ...previewLines.map((l) => l.length));
  return previewLines.map((l) => l.slice(0, maxLen)).join('\n');
};

export const useAppStore = create<AppState>((set, get) => ({
  image: null,
  imageData: null,
  asciiText: '',
  imageInfo: null,
  settings: defaultSettings,
  status: 'idle',
  errorMessage: null,
  previewLines: [],
  history: [],
  activeHistoryId: null,

  setImage: (image) => set({ image }),
  setImageData: (imageData) => set({ imageData }),
  setAsciiText: (asciiText) => set({ asciiText }),
  setImageInfo: (imageInfo) => set({ imageInfo }),
  setSettings: (newSettings) =>
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    })),
  setStatus: (status) => set({ status }),
  setErrorMessage: (errorMessage) => set({ errorMessage }),
  setPreviewLines: (previewLines) => set({ previewLines }),

  addHistory: (item) => {
    const state = get();
    const newItem: HistoryItem = {
      ...item,
      id: generateId(),
      timestamp: Date.now(),
      thumbnail: generateThumbnail(item.previewLines),
    };
    const newHistory = [newItem, ...state.history].slice(0, MAX_HISTORY);
    set({ history: newHistory, activeHistoryId: null });
  },

  selectHistory: (id) => {
    if (id === null) {
      set({ activeHistoryId: null });
      return;
    }
    const state = get();
    const item = state.history.find((h) => h.id === id);
    if (item) {
      set({
        activeHistoryId: id,
        asciiText: item.asciiText,
        previewLines: item.previewLines,
        settings: item.settings,
        imageInfo: item.imageInfo,
        status: 'ready',
      });
    }
  },

  deleteHistory: (id) => {
    set((state) => {
      const newHistory = state.history.filter((h) => h.id !== id);
      const newActiveId = state.activeHistoryId === id ? null : state.activeHistoryId;
      return { history: newHistory, activeHistoryId: newActiveId };
    });
  },

  clearHistory: () => set({ history: [], activeHistoryId: null }),

  reset: () =>
    set({
      image: null,
      imageData: null,
      asciiText: '',
      imageInfo: null,
      status: 'idle',
      errorMessage: null,
      previewLines: [],
      activeHistoryId: null,
    }),
}));

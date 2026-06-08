import { create } from 'zustand';
import type { AppStatus, AppSettings, ImageInfo } from '@/types';

interface AppState {
  image: HTMLImageElement | null;
  imageData: ImageData | null;
  asciiText: string;
  imageInfo: ImageInfo | null;
  settings: AppSettings;
  status: AppStatus;
  errorMessage: string | null;
  previewLines: string[];

  setImage: (image: HTMLImageElement | null) => void;
  setImageData: (data: ImageData | null) => void;
  setAsciiText: (text: string) => void;
  setImageInfo: (info: ImageInfo | null) => void;
  setSettings: (settings: Partial<AppSettings>) => void;
  setStatus: (status: AppStatus) => void;
  setErrorMessage: (message: string | null) => void;
  setPreviewLines: (lines: string[]) => void;
  reset: () => void;
}

const defaultSettings: AppSettings = {
  width: 100,
  charSet: 'standard',
  customChars: '',
  invert: false,
};

export const useAppStore = create<AppState>((set) => ({
  image: null,
  imageData: null,
  asciiText: '',
  imageInfo: null,
  settings: defaultSettings,
  status: 'idle',
  errorMessage: null,
  previewLines: [],

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
  reset: () =>
    set({
      image: null,
      imageData: null,
      asciiText: '',
      imageInfo: null,
      status: 'idle',
      errorMessage: null,
      previewLines: [],
    }),
}));

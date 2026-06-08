export type AppStatus = 'idle' | 'processing' | 'ready' | 'error';

export interface AppSettings {
  width: number;
  charSet: string;
  customChars: string;
  invert: boolean;
}

export interface CharSetOption {
  id: string;
  name: string;
  chars: string;
  description: string;
}

export interface ImageInfo {
  originalWidth: number;
  originalHeight: number;
  scaledWidth: number;
  scaledHeight: number;
}

export interface ExportOptions {
  fontSize: number;
  bgColor: string;
  textColor: string;
  format: 'png' | 'jpeg';
}

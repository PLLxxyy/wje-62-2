import type { ExportOptions } from '@/types';

export const exportAsciiToImage = (
  asciiText: string,
  options: ExportOptions
): string => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('无法获取 Canvas 上下文');

  const lines = asciiText.split('\n');
  const lineCount = lines.length;
  const maxLineLength = Math.max(...lines.map(l => l.length));

  const charWidth = options.fontSize * 0.6;
  const charHeight = options.fontSize * 1.0;
  const padding = options.fontSize * 2;

  canvas.width = maxLineLength * charWidth + padding * 2;
  canvas.height = lineCount * charHeight + padding * 2;

  ctx.fillStyle = options.bgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = `${options.fontSize}px "Courier New", "Lucida Console", Monaco, monospace`;
  ctx.textBaseline = 'top';
  ctx.fillStyle = options.textColor;

  if (options.textColor === '#39ff14' || options.textColor === '#ffffff') {
    ctx.shadowColor = options.textColor;
    ctx.shadowBlur = options.fontSize * 0.3;
  }

  lines.forEach((line, index) => {
    ctx.fillText(line, padding, padding + index * charHeight);
  });

  const mimeType = options.format === 'jpeg' ? 'image/jpeg' : 'image/png';
  return canvas.toDataURL(mimeType, 0.95);
};

export const downloadImage = (dataUrl: string, filename: string): void => {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textarea);
    return success;
  }
};

export const getExportFilename = (base: string, format: string): string => {
  const timestamp = new Date().toISOString().slice(0, 10);
  return `${base}-ascii-${timestamp}.${format}`;
};

export const rgbToGrayscale = (r: number, g: number, b: number): number => {
  return 0.299 * r + 0.587 * g + 0.114 * b;
};

export const grayscaleToAscii = (
  gray: number,
  charSet: string,
  invert: boolean
): string => {
  const normalized = invert ? (255 - gray) / 255 : gray / 255;
  const index = Math.floor(normalized * (charSet.length - 1));
  return charSet[Math.max(0, Math.min(index, charSet.length - 1))];
};

export const imageDataToAscii = (
  imageData: ImageData,
  width: number,
  height: number,
  charSet: string,
  invert: boolean
): string => {
  const data = imageData.data;
  const lines: string[] = [];

  for (let y = 0; y < height; y++) {
    let line = '';
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const gray = rgbToGrayscale(data[i], data[i + 1], data[i + 2]);
      line += grayscaleToAscii(gray, charSet, invert);
    }
    lines.push(line);
  }

  return lines.join('\n');
};

export const calculateScaledDimensions = (
  originalWidth: number,
  originalHeight: number,
  targetWidth: number,
  charAspectRatio: number = 2
): { width: number; height: number } => {
  const ratio = originalHeight / originalWidth;
  const scaledHeight = Math.round(targetWidth * ratio / charAspectRatio);
  return {
    width: targetWidth,
    height: Math.max(1, scaledHeight),
  };
};

export const resizeImageData = (
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  targetWidth: number,
  targetHeight: number
): ImageData => {
  const canvas = ctx.canvas;
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(image, 0, 0, targetWidth, targetHeight);

  return ctx.getImageData(0, 0, targetWidth, targetHeight);
};

import { useEffect, useCallback } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { imageDataToAscii } from '@/utils/asciiConverter';
import { getActiveChars } from '@/utils/charSets';

export const useAsciiGenerator = () => {
  const {
    imageData,
    imageInfo,
    settings,
    setAsciiText,
    setPreviewLines,
    setStatus,
  } = useAppStore();

  const generateAscii = useCallback(() => {
    if (!imageData || !imageInfo) return;

    setStatus('processing');

    const chars = getActiveChars(settings.charSet, settings.customChars);
    if (!chars || chars.length === 0) return;

    const text = imageDataToAscii(
      imageData,
      imageInfo.scaledWidth,
      imageInfo.scaledHeight,
      chars,
      settings.invert
    );

    setAsciiText(text);
    setPreviewLines(text.split('\n'));
    setStatus('ready');
  }, [
    imageData,
    imageInfo,
    settings.charSet,
    settings.customChars,
    settings.invert,
    setAsciiText,
    setPreviewLines,
    setStatus,
  ]);

  useEffect(() => {
    if (imageData && imageInfo) {
      const debounce = setTimeout(() => {
        generateAscii();
      }, 50);
      return () => clearTimeout(debounce);
    }
  }, [
    imageData,
    imageInfo,
    settings.charSet,
    settings.customChars,
    settings.invert,
    generateAscii,
  ]);

  return { generateAscii };
};

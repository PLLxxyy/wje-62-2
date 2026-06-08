import { useEffect, useCallback } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { imageDataToAscii } from '@/utils/asciiConverter';
import { getActiveChars } from '@/utils/charSets';

export const useAsciiGenerator = () => {
  const {
    imageData,
    imageInfo,
    settings,
    activeHistoryId,
    setAsciiText,
    setPreviewLines,
    setStatus,
    addHistory,
  } = useAppStore();

  const generateAscii = useCallback(() => {
    if (!imageData || !imageInfo) return;
    if (activeHistoryId !== null) return;

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

    const previewLines = text.split('\n');
    setAsciiText(text);
    setPreviewLines(previewLines);
    setStatus('ready');

    addHistory({
      asciiText: text,
      previewLines,
      settings: { ...settings },
      imageInfo: { ...imageInfo },
      thumbnail: '',
    });
  }, [
    imageData,
    imageInfo,
    settings.charSet,
    settings.customChars,
    settings.invert,
    settings,
    activeHistoryId,
    setAsciiText,
    setPreviewLines,
    setStatus,
    addHistory,
  ]);

  useEffect(() => {
    if (imageData && imageInfo && activeHistoryId === null) {
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
    activeHistoryId,
    generateAscii,
  ]);

  return { generateAscii };
};

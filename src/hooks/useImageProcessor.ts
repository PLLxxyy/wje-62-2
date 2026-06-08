import { useRef, useCallback } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { calculateScaledDimensions, resizeImageData } from '@/utils/asciiConverter';

export const useImageProcessor = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { setImage, setImageData, setImageInfo, setStatus, setErrorMessage } =
    useAppStore();

  const getCanvasContext = useCallback((): CanvasRenderingContext2D | null => {
    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas');
    }
    return canvasRef.current.getContext('2d', { willReadFrequently: true });
  }, []);

  const loadImage = useCallback(
    async (file: File): Promise<HTMLImageElement | null> => {
      setStatus('processing');
      setErrorMessage(null);

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            resolve(img);
          };
          img.onerror = () => {
            setErrorMessage('图片加载失败');
            setStatus('error');
            reject(new Error('图片加载失败'));
          };
          img.src = e.target?.result as string;
        };
        reader.onerror = () => {
          setErrorMessage('文件读取失败');
          setStatus('error');
          reject(new Error('文件读取失败'));
        };
        reader.readAsDataURL(file);
      });
    },
    [setStatus, setErrorMessage]
  );

  const processImage = useCallback(
    (image: HTMLImageElement, targetWidth: number) => {
      const ctx = getCanvasContext();
      if (!ctx) {
        setErrorMessage('无法创建 Canvas 上下文');
        setStatus('error');
        return;
      }

      const originalWidth = image.naturalWidth;
      const originalHeight = image.naturalHeight;

      const scaled = calculateScaledDimensions(
        originalWidth,
        originalHeight,
        targetWidth,
        2
      );

      const imageData = resizeImageData(
        ctx,
        image,
        scaled.width,
        scaled.height
      );

      setImage(image);
      setImageData(imageData);
      setImageInfo({
        originalWidth,
        originalHeight,
        scaledWidth: scaled.width,
        scaledHeight: scaled.height,
      });
      setStatus('ready');
    },
    [getCanvasContext, setImage, setImageData, setImageInfo, setStatus, setErrorMessage]
  );

  const handleFileUpload = useCallback(
    async (file: File, targetWidth: number) => {
      if (!file.type.startsWith('image/')) {
        setErrorMessage('请上传图片文件');
        setStatus('error');
        return;
      }

      try {
        const image = await loadImage(file);
        if (image) {
          processImage(image, targetWidth);
        }
      } catch (error) {
        console.error('图片处理失败:', error);
      }
    },
    [loadImage, processImage, setErrorMessage, setStatus]
  );

  const reprocessWithNewWidth = useCallback(
    (targetWidth: number) => {
      const { image } = useAppStore.getState();
      if (!image) return;
      processImage(image, targetWidth);
    },
    [processImage]
  );

  return {
    handleFileUpload,
    processImage,
    reprocessWithNewWidth,
    loadImage,
  };
};

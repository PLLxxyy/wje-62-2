import React, { useRef, useState, useCallback } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useImageProcessor } from '@/hooks/useImageProcessor';

export const ImageUploader: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { image, settings, reset } = useAppStore();
  const { handleFileUpload } = useImageProcessor();

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file, settings.width);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) {
        handleFileUpload(file, settings.width);
      }
    },
    [handleFileUpload, settings.width]
  );

  const handleRemove = () => {
    reset();
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-crt-green text-shadow-crt-sm font-bold tracking-wider text-lg flex items-center gap-2">
          <ImageIcon className="w-5 h-5" />
          图像输入
        </label>
        {image && (
          <button
            onClick={handleRemove}
            className="flex items-center gap-1 text-xs text-crt-green opacity-60 hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
            移除
          </button>
        )}
      </div>

      {!image ? (
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-lg p-8
            flex flex-col items-center justify-center gap-3
            cursor-pointer transition-all duration-200
            ${isDragging
              ? 'border-crt-green bg-crt-green/10 shadow-crt-glow'
              : 'border-crt-border hover:border-crt-green hover:bg-crt-green/5'
            }
          `}
        >
          <Upload
            className={`w-10 h-10 transition-all duration-200 ${
              isDragging ? 'text-crt-green scale-110' : 'text-crt-borderLight'
            }`}
          />
          <div className="text-center">
            <p className="text-crt-green text-shadow-crt-sm font-bold">
              {isDragging ? '释放以上传' : '点击或拖拽上传图片'}
            </p>
            <p className="text-crt-green opacity-50 text-sm mt-1">
              支持 JPG、PNG、GIF 等格式
            </p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      ) : (
        <div className="relative border-2 border-crt-border rounded-lg overflow-hidden bg-crt-bgDark">
          <div className="aspect-video flex items-center justify-center p-2">
            <img
              src={image.src}
              alt="Preview"
              className="max-w-full max-h-full object-contain"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>
          <div className="absolute inset-0 scanlines pointer-events-none opacity-30" />
          <div className="absolute bottom-1 right-2 text-xs text-crt-green opacity-50">
            {image.naturalWidth} × {image.naturalHeight}
          </div>
        </div>
      )}
    </div>
  );
};

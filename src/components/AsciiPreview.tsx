import React, { useState, useEffect, useRef } from 'react';
import { Monitor, FileText } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useAsciiGenerator } from '@/hooks/useAsciiGenerator';

export const AsciiPreview: React.FC = () => {
  const { previewLines, asciiText, status, settings } = useAppStore();
  const { generateAscii } = useAsciiGenerator();
  const [displayCount, setDisplayCount] = useState(0);
  const [viewMode, setViewMode] = useState<'preview' | 'text'>('preview');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === 'ready' && previewLines.length > 0) {
      setDisplayCount(0);
      const interval = setInterval(() => {
        setDisplayCount((prev) => {
          if (prev >= previewLines.length) {
            clearInterval(interval);
            return prev;
          }
          return prev + 3;
        });
      }, 20);
      return () => clearInterval(interval);
    }
  }, [status, previewLines.length, asciiText]);

  useEffect(() => {
    if (status === 'ready' && !asciiText && previewLines.length === 0) {
      generateAscii();
    }
  }, [status, asciiText, previewLines.length, generateAscii]);

  const bgColor = settings.invert ? 'bg-white' : 'bg-crt-bg';
  const textColor = settings.invert ? 'text-black' : 'text-crt-green';
  const textShadow = settings.invert ? '' : 'text-shadow-crt-sm';

  const displayedLines = previewLines.slice(0, displayCount);
  const isPrinting = displayCount < previewLines.length;

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between border-b border-crt-border pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Monitor className="w-5 h-5 text-crt-green" />
          <h2 className="text-crt-green text-shadow-crt-sm font-bold tracking-wider text-lg">
            ASCII 预览
          </h2>
          {isPrinting && (
            <span className="text-xs text-crt-amber animate-pulse ml-2">
              打印中... {Math.round((displayCount / previewLines.length) * 100)}%
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('preview')}
            className={`
              px-3 py-1 text-sm rounded border-2 transition-all flex items-center gap-1
              ${viewMode === 'preview'
                ? 'border-crt-green bg-crt-green/10 text-crt-green shadow-crt-glow-sm'
                : 'border-crt-border text-crt-green/60 hover:border-crt-borderLight'
              }
            `}
          >
            <Monitor className="w-4 h-4" />
            预览
          </button>
          <button
            onClick={() => setViewMode('text')}
            className={`
              px-3 py-1 text-sm rounded border-2 transition-all flex items-center gap-1
              ${viewMode === 'text'
                ? 'border-crt-green bg-crt-green/10 text-crt-green shadow-crt-glow-sm'
                : 'border-crt-border text-crt-green/60 hover:border-crt-borderLight'
              }
            `}
          >
            <FileText className="w-4 h-4" />
            文本
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        className={`
          flex-1 relative overflow-auto custom-scrollbar
          ${bgColor} border-2 border-crt-border rounded-lg
          ${!settings.invert ? 'crt-curved' : ''}
        `}
      >
        {status === 'idle' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-crt-green/30 text-6xl mb-4 font-mono">
                <pre>{`
    _    ____   ____ ___ ___      _    ____ _____ 
   / \\  / ___| / ___|_ _|_ _|    / \\  / ___|_   _|
  / _ \\ \\___ \\| |    | | | |    / _ \\| |     | |  
 / ___ \\ ___) | |___ | | | |   / ___ \\ |___  | |  
/_/   \\_\\____/ \\____|___|___| /_/   \\_\\____| |_|  
                `}</pre>
              </div>
              <p className="text-crt-green/50 text-lg tracking-wider">
                请上传一张图片开始
              </p>
              <div className="mt-4 text-crt-green/30 animate-blink">
                ▮
              </div>
            </div>
          </div>
        )}

        {status === 'processing' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin text-crt-green text-4xl mb-4">
                ⟳
              </div>
              <p className="text-crt-green text-lg tracking-wider animate-pulse">
                正在处理图像...
              </p>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-red-500 text-4xl mb-4">⚠</div>
              <p className="text-red-400 text-lg tracking-wider">
                处理出错，请重试
              </p>
            </div>
          </div>
        )}

        {(status === 'ready' || (status === 'processing' && previewLines.length > 0)) && (
          <>
            {viewMode === 'preview' ? (
              <div className="p-4 min-w-full">
                <pre
                  className={`
                    ascii-preview ${textColor} ${textShadow}
                    ${settings.invert ? '' : 'animate-flicker'}
                  `}
                >
                  {displayedLines.join('\n')}
                  {isPrinting && <span className="animate-blink">▮</span>}
                </pre>
              </div>
            ) : (
              <textarea
                value={asciiText}
                readOnly
                className={`
                  w-full h-full p-4 font-mono text-sm
                  ${bgColor} ${textColor} ${textShadow}
                  resize-none outline-none
                `}
                style={{ lineHeight: 1.2 }}
              />
            )}

            {!settings.invert && (
              <div className="absolute inset-0 scanlines pointer-events-none opacity-20" />
            )}
          </>
        )}
      </div>

      {previewLines.length > 0 && (
        <div className="mt-2 flex items-center justify-between text-xs text-crt-green opacity-60">
          <span>{previewLines.length} 行 × {previewLines[0]?.length || 0} 列</span>
          <span>{asciiText.length} 字符</span>
        </div>
      )}
    </div>
  );
};

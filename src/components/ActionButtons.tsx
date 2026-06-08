import React, { useState } from 'react';
import { Copy, Download, Image as ImageIcon, Check, Settings } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { copyToClipboard, exportAsciiToImage, downloadImage, getExportFilename } from '@/utils/imageExporter';

type ExportFormat = 'png' | 'jpeg';
type ExportTheme = 'crt' | 'paper' | 'dark' | 'light';

const themePresets: Record<ExportTheme, { bg: string; text: string }> = {
  crt: { bg: '#0a0a0a', text: '#39ff14' },
  paper: { bg: '#f5f0e6', text: '#1a1a1a' },
  dark: { bg: '#1a1a2e', text: '#e0e0e0' },
  light: { bg: '#ffffff', text: '#000000' },
};

export const ActionButtons: React.FC = () => {
  const { asciiText, status, settings } = useAppStore();
  const [copied, setCopied] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [exportFormat, setExportFormat] = useState<ExportFormat>('png');
  const [exportTheme, setExportTheme] = useState<ExportTheme>('crt');
  const [exportFontSize, setExportFontSize] = useState(14);
  const [exporting, setExporting] = useState(false);

  const handleCopy = async () => {
    if (!asciiText) return;
    const success = await copyToClipboard(asciiText);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExport = async () => {
    if (!asciiText) return;
    setExporting(true);

    try {
      const theme = themePresets[exportTheme];
      const dataUrl = exportAsciiToImage(asciiText, {
        fontSize: exportFontSize,
        bgColor: theme.bg,
        textColor: theme.text,
        format: exportFormat,
      });

      const filename = getExportFilename('ascii-art', exportFormat);
      downloadImage(dataUrl, filename);
    } catch (error) {
      console.error('导出失败:', error);
    } finally {
      setExporting(false);
      setShowExportOptions(false);
    }
  };

  const isDisabled = status !== 'ready' || !asciiText;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 border-b border-crt-border pb-3">
        <Settings className="w-5 h-5 text-crt-green" />
        <h2 className="text-crt-green text-shadow-crt-sm font-bold tracking-wider text-lg">
          输出操作
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleCopy}
          disabled={isDisabled}
          className={`
            btn-industrial rounded-lg px-4 py-3
            flex items-center justify-center gap-2
            text-crt-green font-bold
            ${copied ? 'border-crt-green shadow-crt-glow' : ''}
          `}
        >
          {copied ? (
            <>
              <Check className="w-5 h-5 text-crt-green" />
              <span>已复制!</span>
            </>
          ) : (
            <>
              <Copy className="w-5 h-5" />
              <span>复制文本</span>
            </>
          )}
        </button>

        <button
          onClick={() => setShowExportOptions(!showExportOptions)}
          disabled={isDisabled}
          className={`
            btn-industrial rounded-lg px-4 py-3
            flex items-center justify-center gap-2
            text-crt-green font-bold
            ${showExportOptions ? 'border-crt-green shadow-crt-glow' : ''}
          `}
        >
          <Download className="w-5 h-5" />
          <span>导出图片</span>
        </button>
      </div>

      {showExportOptions && (
        <div className="mt-4 p-4 bg-crt-bgDark border-2 border-crt-border rounded-lg space-y-4 animate-fadeIn">
          <div className="space-y-2">
            <label className="text-crt-green text-sm font-medium flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              主题风格
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(Object.keys(themePresets) as ExportTheme[]).map((themeKey) => (
                <button
                  key={themeKey}
                  onClick={() => setExportTheme(themeKey)}
                  className={`
                    p-2 rounded border-2 transition-all
                    ${exportTheme === themeKey
                      ? 'border-crt-green shadow-crt-glow-sm'
                      : 'border-crt-border hover:border-crt-borderLight'
                    }
                  `}
                >
                  <div className="flex gap-1 justify-center mb-1">
                    <div
                      className="w-4 h-4 rounded-sm border"
                      style={{ backgroundColor: themePresets[themeKey].bg, borderColor: themePresets[themeKey].text }}
                    />
                    <div
                      className="w-4 h-4 rounded-sm border"
                      style={{ backgroundColor: themePresets[themeKey].text, borderColor: themePresets[themeKey].bg }}
                    />
                  </div>
                  <div className="text-xs text-crt-green text-center">
                    {themeKey === 'crt' && 'CRT'}
                    {themeKey === 'paper' && '纸张'}
                    {themeKey === 'dark' && '暗黑'}
                    {themeKey === 'light' && '明亮'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-crt-green text-sm font-medium">
                字体大小
              </label>
              <span className="text-crt-green font-mono text-sm bg-crt-green/10 px-2 py-0.5 rounded border border-crt-border">
                {exportFontSize}px
              </span>
            </div>
            <input
              type="range"
              min="8"
              max="24"
              value={exportFontSize}
              onChange={(e) => setExportFontSize(parseInt(e.target.value, 10))}
              className="w-full h-2 input-range-custom appearance-none bg-crt-greenDarker rounded cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <label className="text-crt-green text-sm font-medium">
              文件格式
            </label>
            <div className="flex gap-2">
              {(['png', 'jpeg'] as ExportFormat[]).map((format) => (
                <button
                  key={format}
                  onClick={() => setExportFormat(format)}
                  className={`
                    flex-1 py-2 px-4 rounded border-2 transition-all uppercase font-bold text-sm
                    ${exportFormat === format
                      ? 'border-crt-green bg-crt-green/10 text-crt-green shadow-crt-glow-sm'
                      : 'border-crt-border text-crt-green/60 hover:border-crt-borderLight'
                    }
                  `}
                >
                  {format}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleExport}
            disabled={exporting}
            className="
              w-full btn-industrial rounded-lg px-4 py-3
              flex items-center justify-center gap-2
              text-crt-green font-bold
              bg-gradient-to-r from-crt-greenDarker to-crt-greenDark
              hover:from-crt-greenDark hover:to-crt-border
            "
          >
            {exporting ? (
              <>
                <span className="animate-spin">⟳</span>
                <span>导出中...</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span>下载 {exportFormat.toUpperCase()}</span>
              </>
            )}
          </button>
        </div>
      )}

      <div className="pt-2 border-t border-crt-border">
        <div className="flex items-center gap-2 text-xs text-crt-green opacity-60">
          <div className={`w-2 h-2 rounded-full ${isDisabled ? 'bg-crt-border led-off' : 'bg-crt-green led-on animate-breathing'}`} />
          <span>{isDisabled ? '等待图像输入...' : '准备就绪'}</span>
        </div>
      </div>
    </div>
  );
};

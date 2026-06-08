import React from 'react';
import { Settings, Maximize2, Type, Palette, Shuffle } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { CHAR_SETS } from '@/utils/charSets';
import { useImageProcessor } from '@/hooks/useImageProcessor';

export const ControlPanel: React.FC = () => {
  const { settings, setSettings, image } = useAppStore();
  const { reprocessWithNewWidth } = useImageProcessor();

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const width = parseInt(e.target.value, 10);
    setSettings({ width });
    if (image) {
      reprocessWithNewWidth(width);
    }
  };

  const handleCharSetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSettings({ charSet: e.target.value });
  };

  const handleCustomCharsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({ customChars: e.target.value });
  };

  const handleInvertToggle = () => {
    setSettings({ invert: !settings.invert });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 border-b border-crt-border pb-3">
        <Settings className="w-5 h-5 text-crt-green" />
        <h2 className="text-crt-green text-shadow-crt-sm font-bold tracking-wider text-lg">
          控制面板
        </h2>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-crt-green text-shadow-crt-sm font-medium flex items-center gap-2">
              <Maximize2 className="w-4 h-4" />
              输出宽度
            </label>
            <span className="text-crt-green font-mono text-sm bg-crt-green/10 px-2 py-1 rounded border border-crt-border">
              {settings.width} 字符
            </span>
          </div>
          <input
            type="range"
            min="20"
            max="200"
            value={settings.width}
            onChange={handleWidthChange}
            className="w-full h-2 input-range-custom appearance-none bg-crt-greenDarker rounded cursor-pointer"
            disabled={!image}
          />
          <div className="flex justify-between text-xs text-crt-green opacity-50">
            <span>20</span>
            <span>100</span>
            <span>200</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-crt-green text-shadow-crt-sm font-medium flex items-center gap-2">
            <Type className="w-4 h-4" />
            字符集
          </label>
          <select
            value={settings.charSet}
            onChange={handleCharSetChange}
            className="w-full bg-crt-bgDark border-2 border-crt-border text-crt-green rounded-lg px-3 py-2 font-mono text-sm focus:border-crt-green focus:outline-none focus:shadow-crt-glow-sm transition-all disabled:opacity-50"
            disabled={!image}
          >
            {CHAR_SETS.map((set) => (
              <option key={set.id} value={set.id}>
                {set.name} - {set.description}
              </option>
            ))}
          </select>

          {settings.charSet === 'custom' && (
            <input
              type="text"
              value={settings.customChars}
              onChange={handleCustomCharsChange}
              placeholder='从暗到亮排序，如: @#$%&* '
              className="w-full mt-2 bg-crt-bgDark border-2 border-crt-border text-crt-green rounded-lg px-3 py-2 font-mono text-sm focus:border-crt-green focus:outline-none focus:shadow-crt-glow-sm transition-all"
            />
          )}

          <div className="mt-2 p-2 bg-crt-bgDark rounded border border-crt-border">
            <div className="text-xs text-crt-green opacity-60 mb-1">字符预览:</div>
            <div className="font-mono text-sm text-crt-green break-all">
              {settings.charSet === 'custom'
                ? settings.customChars || '请输入自定义字符'
                : CHAR_SETS.find((s) => s.id === settings.charSet)?.chars}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-crt-green text-shadow-crt-sm font-medium flex items-center gap-2">
            <Palette className="w-4 h-4" />
            灰度映射
          </label>
          <div className="h-3 bg-gradient-to-r from-white via-gray-400 to-black rounded border border-crt-border overflow-hidden">
            <div className="h-full w-full flex">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="flex-1 border-r border-crt-border/30"
                  style={{ backgroundColor: `hsl(0, 0%, ${100 - i * 10}%)` }}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-between text-xs text-crt-green opacity-50 font-mono">
            <span>亮</span>
            <span>暗</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-crt-green text-shadow-crt-sm font-medium flex items-center gap-2">
            <Shuffle className="w-4 h-4" />
            反转灰度
          </label>
          <button
            onClick={handleInvertToggle}
            disabled={!image}
            className={`
              relative w-full p-3 rounded-lg border-2 transition-all
              flex items-center justify-between
              ${settings.invert
                ? 'border-crt-green bg-crt-green/10 shadow-crt-glow-sm'
                : 'border-crt-border bg-crt-bgDark hover:border-crt-borderLight'
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-6 rounded-full border-2 transition-all relative ${
                  settings.invert ? 'border-crt-green' : 'border-crt-border'
                }`}
              >
                <div
                  className={`
                    absolute top-0.5 w-4 h-4 rounded-full transition-all duration-200
                    ${settings.invert
                      ? 'left-6 bg-crt-green shadow-crt-glow-sm'
                      : 'left-0.5 bg-crt-border'
                    }
                  `}
                />
              </div>
              <span className="text-crt-green">
                {settings.invert ? '白底黑字模式' : '黑底白字模式'}
              </span>
            </div>
            <div className="flex gap-1">
              <div
                className={`w-5 h-5 rounded border ${
                  settings.invert ? 'bg-white border-white' : 'bg-black border-crt-border'
                }`}
              />
              <div
                className={`w-5 h-5 rounded border ${
                  settings.invert ? 'bg-black border-black' : 'bg-crt-green border-crt-green'
                }`}
              />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

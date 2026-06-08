import React from 'react';
import { History, Clock, Trash2, RotateCcw, Maximize2, Type, Shuffle } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { CHAR_SETS } from '@/utils/charSets';
import type { HistoryItem } from '@/types';

const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);

  if (diffMins < 1) return '刚刚';
  if (diffMins < 60) return `${diffMins} 分钟前`;
  if (diffHours < 24) return `${diffHours} 小时前`;

  return date.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getCharSetName = (charSetId: string): string => {
  const set = CHAR_SETS.find((s) => s.id === charSetId);
  return set ? set.name : charSetId;
};

interface HistoryCardProps {
  item: HistoryItem;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

const HistoryCard: React.FC<HistoryCardProps> = ({ item, isActive, onSelect, onDelete }) => {
  return (
    <div
      onClick={onSelect}
      className={`
        relative p-3 rounded-lg border-2 cursor-pointer transition-all group
        ${isActive
          ? 'border-crt-green bg-crt-green/10 shadow-crt-glow-sm'
          : 'border-crt-border bg-crt-bgDark hover:border-crt-borderLight'
        }
      `}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="
          absolute top-2 right-2 p-1 rounded opacity-0 group-hover:opacity-100
          bg-crt-bgDark border border-crt-border text-crt-green/60
          hover:text-red-400 hover:border-red-400 transition-all
        "
      >
        <Trash2 className="w-3 h-3" />
      </button>

      <div className="flex items-start gap-3">
        <pre
          className={`
            flex-shrink-0 w-16 h-16 p-1 rounded border overflow-hidden
            font-mono text-[6px] leading-[7px]
            ${item.settings.invert
              ? 'bg-white text-black border-crt-border'
              : 'bg-crt-bg text-crt-green border-crt-border'
            }
          `}
        >
          {item.thumbnail}
        </pre>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-xs text-crt-green/60 mb-1">
            <Clock className="w-3 h-3" />
            <span>{formatTime(item.timestamp)}</span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-crt-green">
              <Maximize2 className="w-3 h-3 opacity-60" />
              <span className="font-mono">
                {item.imageInfo?.scaledWidth || 0}×{item.imageInfo?.scaledHeight || 0}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-crt-green">
              <Type className="w-3 h-3 opacity-60" />
              <span>{getCharSetName(item.settings.charSet)}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-crt-green">
              <Shuffle className="w-3 h-3 opacity-60" />
              <span>{item.settings.invert ? '白底黑字' : '黑底白字'}</span>
            </div>
          </div>
        </div>
      </div>

      {isActive && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-crt-green rounded-full animate-breathing led-on" />
      )}
    </div>
  );
};

export const HistoryPanel: React.FC = () => {
  const { history, activeHistoryId, selectHistory, deleteHistory, clearHistory, image } =
    useAppStore();

  const isViewingHistory = activeHistoryId !== null;

  const handleBackToCurrent = () => {
    selectHistory(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-crt-border pb-3">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-crt-green" />
          <h2 className="text-crt-green text-shadow-crt-sm font-bold tracking-wider text-lg">
            历史记录
          </h2>
          <span className="text-xs text-crt-green/60 bg-crt-green/10 px-2 py-0.5 rounded border border-crt-border">
            {history.length} 条
          </span>
        </div>

        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="
              text-xs text-crt-green/60 hover:text-red-400
              flex items-center gap-1 transition-all
            "
          >
            <Trash2 className="w-3 h-3" />
            清空
          </button>
        )}
      </div>

      {isViewingHistory && (
        <button
          onClick={handleBackToCurrent}
          className="
            w-full p-3 rounded-lg border-2 border-crt-amber bg-crt-amber/10
            flex items-center justify-center gap-2 text-crt-amber
            hover:shadow-crt-glow-sm transition-all
          "
        >
          <RotateCcw className="w-4 h-4" />
          <span className="font-medium">返回当前参数</span>
        </button>
      )}

      {history.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-crt-green/20 text-4xl mb-2 font-mono">
            <pre>{`
╔═════════════════╗
║   NO RECORDS    ║
║   暂无记录      ║
╚═════════════════╝
`}</pre>
          </div>
          <p className="text-crt-green/40 text-sm">
            {image ? '调整参数后将自动保存记录' : '上传图片并调整参数生成记录'}
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-1">
          {history.map((item) => (
            <HistoryCard
              key={item.id}
              item={item}
              isActive={activeHistoryId === item.id}
              onSelect={() => selectHistory(item.id)}
              onDelete={() => deleteHistory(item.id)}
            />
          ))}
        </div>
      )}

      {history.length > 0 && (
        <div className="pt-2 border-t border-crt-border">
          <div className="flex items-center gap-2 text-xs text-crt-green opacity-40">
            <div className="w-2 h-2 rounded-full bg-crt-green/40" />
            <span>最多保存 20 条历史记录</span>
          </div>
        </div>
      )}
    </div>
  );
};

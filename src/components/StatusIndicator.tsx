import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Activity, AlertCircle, CheckCircle, Clock } from 'lucide-react';

export const StatusIndicator: React.FC = () => {
  const { status, errorMessage, imageInfo } = useAppStore();

  const statusConfig = {
    idle: {
      color: 'bg-crt-border',
      glow: '',
      text: '待机中',
      icon: Clock,
    },
    processing: {
      color: 'bg-crt-amber animate-breathing',
      glow: 'led-amber-on',
      text: '处理中',
      icon: Activity,
    },
    ready: {
      color: 'bg-crt-green animate-breathing',
      glow: 'led-on',
      text: '就绪',
      icon: CheckCircle,
    },
    error: {
      color: 'bg-red-500',
      glow: 'shadow-[0_0_10px_rgba(239,68,68,0.8)]',
      text: '错误',
      icon: AlertCircle,
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div
            className={`w-4 h-4 rounded-full ${config.color} ${config.glow}`}
          />
          <div className="absolute inset-0 w-4 h-4 rounded-full border border-crt-borderLight" />
        </div>
        <span className="text-crt-green text-shadow-crt-sm font-bold text-lg tracking-wider">
          {config.text}
        </span>
        <Icon className="w-5 h-5 text-crt-green opacity-60" />
      </div>

      {imageInfo && status === 'ready' && (
        <div className="text-xs text-crt-green opacity-70 space-y-1 pl-7">
          <div>原始尺寸: {imageInfo.originalWidth} × {imageInfo.originalHeight}</div>
          <div>输出尺寸: {imageInfo.scaledWidth} × {imageInfo.scaledHeight} 字符</div>
        </div>
      )}

      {errorMessage && (
        <div className="text-xs text-red-400 pl-7 animate-pulse">
          {errorMessage}
        </div>
      )}
    </div>
  );
};

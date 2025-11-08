'use client';

import { memo } from 'react';
import { PerformanceMetrics } from '@/lib/types';

interface PerformanceMonitorProps {
  metrics: PerformanceMetrics;
}

export const PerformanceMonitor = memo(function PerformanceMonitor({
  metrics,
}: PerformanceMonitorProps) {
  const fpsColor = metrics.fps >= 55 ? 'text-green-400' : metrics.fps >= 30 ? 'text-yellow-400' : 'text-red-400';
  const renderColor = metrics.renderTime < 16 ? 'text-green-400' : metrics.renderTime < 33 ? 'text-yellow-400' : 'text-red-400';

  return (
    <div className="dashboard-card p-4 md:p-6">
      <h3 className="text-base md:text-lg font-semibold mb-4 flex items-center gap-2 text-black">
        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
        Performance Metrics
      </h3>
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <div className="text-xs md:text-sm text-black mb-1 font-medium">FPS</div>
          <div className={`text-xl md:text-2xl font-bold ${fpsColor}`}>
            {metrics.fps.toFixed(1)}
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <div className="text-xs md:text-sm text-black mb-1 font-medium">Render Time</div>
          <div className={`text-xl md:text-2xl font-bold ${renderColor}`}>
            {metrics.renderTime.toFixed(2)}ms
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <div className="text-xs md:text-sm text-black mb-1 font-medium">Memory</div>
          <div className="text-lg md:text-xl font-semibold text-blue-600">
            {metrics.memoryUsage.toFixed(1)} MB
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <div className="text-xs md:text-sm text-black mb-1 font-medium">Data Points</div>
          <div className="text-lg md:text-xl font-semibold text-purple-600">
            {metrics.dataPointCount.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
});


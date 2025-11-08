'use client';

import { memo, useEffect, useCallback } from 'react';
import { useChartRenderer } from '@/hooks/useChartRenderer';
import { DataPoint, ChartConfig } from '@/lib/types';
import { scaleValue } from '@/lib/canvasUtils';

interface BarChartProps {
  data: DataPoint[];
  config: ChartConfig;
  color?: string;
  showGrid?: boolean;
  onRender?: () => void;
}

export const BarChart = memo(function BarChart({
  data,
  config,
  color = '#10b981',
  showGrid = true,
  onRender,
}: BarChartProps) {
  const { canvasRef, render } = useChartRenderer({
    config,
    data,
    color,
    showGrid,
  });

  const drawChart = useCallback(() => {
    const result = render();
    if (!result) return;

    const { renderer, points, bounds, yMin, yMax } = result;

    const barWidth = bounds.width / Math.max(points.length, 1);
    const zeroY = scaleValue(0, yMin, yMax, bounds.y + bounds.height, bounds.y);

    points.forEach((point, index) => {
      const x = point.x - barWidth / 2;
      const height = zeroY - point.y;
      const y = Math.min(point.y, zeroY);

      renderer.drawRect(
        x,
        y,
        barWidth * 0.8,
        Math.abs(height),
        color,
        true
      );
    });

    onRender?.();
  }, [render, color, onRender]);

  useEffect(() => {
    drawChart();
  }, [drawChart]);

  return (
    <canvas
      ref={canvasRef}
      className="chart-canvas"
    />
  );
});

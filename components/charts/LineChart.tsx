'use client';

import { memo, useEffect, useCallback } from 'react';
import { useChartRenderer } from '@/hooks/useChartRenderer';
import { DataPoint, ChartConfig } from '@/lib/types';
import { Point } from '@/lib/canvasUtils';

interface LineChartProps {
  data: DataPoint[];
  config: ChartConfig;
  color?: string;
  showGrid?: boolean;
  onRender?: () => void;
}

export const LineChart = memo(function LineChart({
  data,
  config,
  color = '#3b82f6',
  showGrid = true,
  onRender,
}: LineChartProps) {
  const { canvasRef, render } = useChartRenderer({
    config,
    data,
    color,
    showGrid,
  });

  const drawChart = useCallback(() => {
    const result = render();
    if (!result) return;

    const { renderer, points, bounds } = result;

    // Draw line path
    renderer.drawPath(points, color, 2, `${color}20`);

    // Draw line
    renderer.drawLine(points, color, 2);

    // Draw points (only for smaller datasets)
    if (points.length < 1000) {
      points.forEach((point) => {
        renderer.drawCircle(point.x, point.y, 2, color, true);
      });
    }

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

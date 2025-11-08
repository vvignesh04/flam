'use client';

import { memo, useEffect, useCallback } from 'react';
import { useChartRenderer } from '@/hooks/useChartRenderer';
import { DataPoint, ChartConfig } from '@/lib/types';

interface ScatterPlotProps {
  data: DataPoint[];
  config: ChartConfig;
  color?: string;
  pointSize?: number;
  showGrid?: boolean;
  onRender?: () => void;
}

export const ScatterPlot = memo(function ScatterPlot({
  data,
  config,
  color = '#8b5cf6',
  pointSize = 4,
  showGrid = true,
  onRender,
}: ScatterPlotProps) {
  const { canvasRef, render } = useChartRenderer({
    config,
    data,
    color,
    showGrid,
  });

  const drawChart = useCallback(() => {
    const result = render();
    if (!result) return;

    const { renderer, points } = result;

    // Draw points
    points.forEach((point) => {
      renderer.drawCircle(point.x, point.y, pointSize, color, true);
    });

    onRender?.();
  }, [render, color, pointSize, onRender]);

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


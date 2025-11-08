'use client';

import { useRef, useEffect, useCallback, useMemo } from 'react';
import { CanvasRenderer, scaleValue, getDomain, Point } from '@/lib/canvasUtils';
import { DataPoint, ChartConfig } from '@/lib/types';

interface UseChartRendererOptions {
  config: ChartConfig;
  data: DataPoint[];
  color?: string;
  showGrid?: boolean;
}

export function useChartRenderer({
  config,
  data,
  color = '#3b82f6',
  showGrid = true,
}: UseChartRendererOptions) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<CanvasRenderer | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const dpr = window.devicePixelRatio || 1;
      
      canvas.width = config.width * dpr;
      canvas.height = config.height * dpr;
      canvas.style.width = `${config.width}px`;
      canvas.style.height = `${config.height}px`;

      rendererRef.current = new CanvasRenderer(canvas);
    }
  }, [config.width, config.height]);

  const render = useCallback(() => {
    if (!rendererRef.current || data.length === 0) return;

    const renderer = rendererRef.current;
    renderer.clear();

    const bounds = {
      x: config.margin.left,
      y: config.margin.top,
      width: config.width - config.margin.left - config.margin.right,
      height: config.height - config.margin.top - config.margin.bottom,
    };

    if (showGrid) {
      renderer.drawGrid(bounds, 10, 10, '#e5e7eb', 0.5);
    }

    const xMin = config.xMin ?? data[0]?.timestamp ?? 0;
    const xMax = config.xMax ?? data[data.length - 1]?.timestamp ?? 1;
    const values = data.map((d) => d.value);
    const yMin = config.yMin ?? Math.min(...values, 0);
    const yMax = config.yMax ?? Math.max(...values, 100);

    const points: Point[] = data.map((point) => ({
      x: scaleValue(point.timestamp, xMin, xMax, bounds.x, bounds.x + bounds.width),
      y: scaleValue(point.value, yMin, yMax, bounds.y + bounds.height, bounds.y),
    }));

    return { renderer, points, bounds, xMin, xMax, yMin, yMax };
  }, [config, data, color, showGrid]);

  return {
    canvasRef,
    render,
    renderer: rendererRef.current,
  };
}


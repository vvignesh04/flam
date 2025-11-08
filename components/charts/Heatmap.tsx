'use client';

import { memo, useEffect, useCallback, useRef } from 'react';
import { ChartConfig } from '@/lib/types';
import { CanvasRenderer } from '@/lib/canvasUtils';
import { DataGenerator } from '@/lib/dataGenerator';

interface HeatmapProps {
  width: number;
  height: number;
  data: Array<{ x: number; y: number; value: number }>;
  config: ChartConfig;
  colorScale?: (value: number, min: number, max: number) => string;
  onRender?: () => void;
}

function defaultColorScale(value: number, min: number, max: number): string {
  const ratio = (value - min) / (max - min);
  const r = Math.floor(255 * ratio);
  const b = Math.floor(255 * (1 - ratio));
  return `rgb(${r}, 0, ${b})`;
}

export const Heatmap = memo(function Heatmap({
  width,
  height,
  data,
  config,
  colorScale = defaultColorScale,
  onRender,
}: HeatmapProps) {
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

  const drawChart = useCallback(() => {
    if (!rendererRef.current || data.length === 0) return;

    const renderer = rendererRef.current;
    renderer.clear();

    const bounds = {
      x: config.margin.left,
      y: config.margin.top,
      width: config.width - config.margin.left - config.margin.right,
      height: config.height - config.margin.top - config.margin.bottom,
    };

    const values = data.map((d) => d.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);

    // Find unique x and y positions
    const xPositions = Array.from(new Set(data.map((d) => d.x))).sort((a, b) => a - b);
    const yPositions = Array.from(new Set(data.map((d) => d.y))).sort((a, b) => a - b);

    const cellWidth = bounds.width / xPositions.length;
    const cellHeight = bounds.height / yPositions.length;

    // Create a map for quick lookup
    const dataMap = new Map<string, number>();
    data.forEach((d) => {
      dataMap.set(`${d.x},${d.y}`, d.value);
    });

    // Draw cells
    xPositions.forEach((x, xi) => {
      yPositions.forEach((y, yi) => {
        const value = dataMap.get(`${x},${y}`) ?? 0;
        const color = colorScale(value, minValue, maxValue);
        const cellX = bounds.x + xi * cellWidth;
        const cellY = bounds.y + yi * cellHeight;

        renderer.drawRect(cellX, cellY, cellWidth, cellHeight, color, true);
      });
    });

    onRender?.();
  }, [data, config, colorScale, onRender]);

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


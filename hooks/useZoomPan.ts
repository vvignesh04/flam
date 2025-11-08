'use client';

import { useState, useCallback, useRef } from 'react';

interface ZoomPanState {
  x: [number, number];
  y: [number, number];
}

export function useZoomPan() {
  const [zoom, setZoom] = useState<ZoomPanState>({ x: [0, 1], y: [0, 1] });
  const isPanningRef = useRef(false);
  const panStartRef = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 1.1 : 0.9;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    setZoom((prev) => {
      const xRange = prev.x[1] - prev.x[0];
      const yRange = prev.y[1] - prev.y[0];
      const newXRange = xRange / delta;
      const newYRange = yRange / delta;

      const xCenter = prev.x[0] + xRange * x;
      const yCenter = prev.y[0] + yRange * y;

      return {
        x: [
          Math.max(0, xCenter - newXRange * x),
          Math.min(1, xCenter + newXRange * (1 - x)),
        ],
        y: [
          Math.max(0, yCenter - newYRange * y),
          Math.min(1, yCenter + newYRange * (1 - y)),
        ],
      };
    });
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left mouse button
    isPanningRef.current = true;
    panStartRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanningRef.current) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const dx = (e.clientX - panStartRef.current.x) / rect.width;
    const dy = (e.clientY - panStartRef.current.y) / rect.height;

    setZoom((prev) => {
      const xRange = prev.x[1] - prev.x[0];
      const yRange = prev.y[1] - prev.y[0];

      return {
        x: [
          Math.max(0, prev.x[0] - dx),
          Math.min(1, prev.x[1] - dx),
        ],
        y: [
          Math.max(0, prev.y[0] + dy),
          Math.min(1, prev.y[1] + dy),
        ],
      };
    });

    panStartRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleMouseUp = useCallback(() => {
    isPanningRef.current = false;
  }, []);

  const resetZoom = useCallback(() => {
    setZoom({ x: [0, 1], y: [0, 1] });
  }, []);

  return {
    zoom,
    containerRef,
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    resetZoom,
  };
}


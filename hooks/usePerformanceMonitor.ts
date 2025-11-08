'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { PerformanceMonitor } from '@/lib/performanceUtils';
import { PerformanceMetrics } from '@/lib/types';

export function usePerformanceMonitor(dataPointCount: number) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    renderTime: 0,
    memoryUsage: 0,
    dataPointCount: 0,
  });

  const monitorRef = useRef<PerformanceMonitor>(new PerformanceMonitor());
  const rafRef = useRef<number | null>(null);

  const measureRender = useCallback(<T,>(fn: () => T): T => {
    return monitorRef.current.measureRender(fn);
  }, []);

  useEffect(() => {
    const updateMetrics = () => {
      monitorRef.current.update();
      const newMetrics = monitorRef.current.getMetrics(dataPointCount);
      setMetrics(newMetrics);
      rafRef.current = requestAnimationFrame(updateMetrics);
    };

    rafRef.current = requestAnimationFrame(updateMetrics);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [dataPointCount]);

  return {
    metrics,
    measureRender,
  };
}


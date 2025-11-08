'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { DataPoint, FilterOptions, AggregationPeriod } from '@/lib/types';
import { startTransition } from 'react';

interface UseDataStreamOptions {
  interval?: number;
  maxPoints?: number;
  autoStart?: boolean;
}

export function useDataStream(options: UseDataStreamOptions = {}) {
  const { interval = 100, maxPoints = 10000, autoStart = true } = options;
  
  const [data, setData] = useState<DataPoint[]>([]);
  const [isStreaming, setIsStreaming] = useState(autoStart);
  const [error, setError] = useState<Error | null>(null);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastTimestampRef = useRef<number>(Date.now());

  const fetchData = useCallback(async () => {
    if (!isStreaming) return;

    try {
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const response = await fetch(
        `/api/data?count=1&startTime=${lastTimestampRef.current}&interval=${interval}`,
        { signal: controller.signal }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const result = await response.json();
      const newPoint = result.data[0] as DataPoint;

      if (newPoint) {
        lastTimestampRef.current = newPoint.timestamp + interval;
        
        startTransition(() => {
          setData((prev) => {
            const updated = [...prev, newPoint];
            // Keep only the last maxPoints
            if (updated.length > maxPoints) {
              return updated.slice(-maxPoints);
            }
            return updated;
          });
        });
      }
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(err);
        setIsStreaming(false);
      }
    } finally {
      abortControllerRef.current = null;
    }
  }, [isStreaming, interval, maxPoints]);

  useEffect(() => {
    if (isStreaming) {
      intervalRef.current = setInterval(fetchData, interval);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [isStreaming, fetchData, interval]);

  const start = useCallback(() => {
    setIsStreaming(true);
    setError(null);
  }, []);

  const stop = useCallback(() => {
    setIsStreaming(false);
  }, []);

  const reset = useCallback(() => {
    setData([]);
    lastTimestampRef.current = Date.now();
    setError(null);
  }, []);

  const filteredData = useMemo(() => {
    return data;
  }, [data]);

  return {
    data: filteredData,
    isStreaming,
    error,
    start,
    stop,
    reset,
    count: data.length,
  };
}


import { DataPoint } from './types';

export function formatTimestamp(timestamp: number): string {
  return new Date(timestamp).toLocaleString();
}

export function formatValue(value: number, decimals: number = 2): string {
  return value.toFixed(decimals);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

export function getMinMax(data: DataPoint[]): { min: number; max: number } {
  if (data.length === 0) return { min: 0, max: 100 };
  
  const values = data.map(d => d.value);
  return {
    min: Math.min(...values),
    max: Math.max(...values),
  };
}

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return function (this: any, ...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

export function throttle<T extends (...args: any[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

import { PerformanceMetrics } from './types';

export class PerformanceMonitor {
  private frameCount: number = 0;
  private lastTime: number = performance.now();
  private fps: number = 60;
  private renderTimes: number[] = [];
  private readonly maxSamples = 60;

  measureRender<T>(fn: () => T): T {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    const renderTime = end - start;

    this.renderTimes.push(renderTime);
    if (this.renderTimes.length > this.maxSamples) {
      this.renderTimes.shift();
    }

    return result;
  }

  update(): void {
    this.frameCount++;
    const currentTime = performance.now();
    const delta = currentTime - this.lastTime;

    if (delta >= 1000) {
      this.fps = (this.frameCount * 1000) / delta;
      this.frameCount = 0;
      this.lastTime = currentTime;
    }
  }

  getMetrics(dataPointCount: number): PerformanceMetrics {
    const avgRenderTime =
      this.renderTimes.length > 0
        ? this.renderTimes.reduce((a, b) => a + b, 0) / this.renderTimes.length
        : 0;

    const memoryUsage = (performance as any).memory
      ? (performance as any).memory.usedJSHeapSize / 1048576 // Convert to MB
      : 0;

    return {
      fps: Math.round(this.fps * 10) / 10,
      renderTime: Math.round(avgRenderTime * 100) / 100,
      memoryUsage: Math.round(memoryUsage * 100) / 100,
      dataPointCount,
    };
  }

  reset(): void {
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.renderTimes = [];
  }
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

export function requestAnimationFrameThrottle(callback: () => void): () => void {
  let rafId: number | null = null;
  let lastCall = 0;

  return () => {
    const now = performance.now();
    if (now - lastCall >= 16) {
      // ~60fps
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        callback();
        lastCall = performance.now();
      });
    }
  };
}

